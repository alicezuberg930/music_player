import type { Response } from "@/@types"
import { HomeShimmer } from "@/components/loading-placeholder"
import { homeQueries } from "@/lib/queries/home"
import { httpClient } from "@/lib/repository/http-client"
import { ArtistSection, BannerSlider, WeekChart, NewReleaseList, PlaylistSection } from "@/pages/home/components"
import { useAuthContext } from "@/providers/auth-provider"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "@yukikaze/ui"
import { Button } from "@yukikaze/ui/button"

type SendNotificationResult = {
    sent: number
    failed: number
}

const HomePage: React.FC = () => {
    const { user } = useAuthContext()
    const { data, isLoading } = useQuery(homeQueries().all.queryOptions())
    const { mutate: sendNotification, isPending } = useMutation({
        mutationFn: async () => {
            if (!user?.id) throw new Error("Please sign in before sending a notification")

            return await httpClient.post<Response<SendNotificationResult>>("/notifications/send", {
                title: "Yukikaze Music",
                content: "This notification was sent from the backend.",
                type: "home_test",
                toUserId: user.id,
                uniqueKey: "home_test_notification",
                icon: "/web-app-manifest-192x192.png",
                link: "/",
            })
        },
        onSuccess: (response) => {
            const sent = response.data?.sent ?? 0
            const failed = response.data?.failed ?? 0
            if (sent > 0) {
                toast.success(`Notification sent to ${sent} device${sent > 1 ? "s" : ""}`)
                return
            }
            if (failed > 0) {
                toast.error(`Notification delivery failed for ${failed} device${failed > 1 ? "s" : ""}`)
                return
            }
            toast.error("No push subscription found for this user")
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to send notification")
        },
    })

    const songs = data?.newReleaseSongs ?? []
    const playlists = data?.newPlaylists ?? []
    const artists = data?.weeklyTopArtists ?? []
    const banners = data?.banners ?? []

    return (
        <>
            {isLoading ? (
                <HomeShimmer />
            ) : data && (
                <>
                    <BannerSlider banners={banners} />

                    <NewReleaseList songs={songs} />

                    <PlaylistSection playlists={playlists} />

                    <ArtistSection artists={artists} />

                    <WeekChart />
                </>
            )}
            <Button onClick={() => sendNotification()} disabled={!user?.id || isPending}>
                {isPending ? "Sending..." : "Send Notification"}
            </Button>
        </>
    )
}

export default HomePage
