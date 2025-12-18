import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yukikaze/ui/tabs"
import { useLocales } from "@/lib/locales"
import MySongTab from "@/sections/me/MySongTab"
import MyPlaylistTab from "@/sections/me/MyPlaylistTab"

const MyMusicPage: React.FC = () => {
    const { translate } = useLocales()

    return (
        <div className="">
            <h1 className="text-2xl font-bold mt-12">{translate('my_music')}</h1>
            <Tabs defaultValue="song" className="mt-4">
                <TabsList className="w-full md:w-1/2">
                    <TabsTrigger value="song">{translate('song')}</TabsTrigger>
                    <TabsTrigger value="playlist">{translate('playlist')}</TabsTrigger>
                    <TabsTrigger value="album">{translate('album')}</TabsTrigger>
                    <TabsTrigger value="artist">{translate('artist')}</TabsTrigger>
                </TabsList>
                <TabsContent value="song" className="mt-4">
                    <MySongTab />
                </TabsContent>
                <TabsContent value="playlist" className="mt-4">
                    <MyPlaylistTab />
                </TabsContent>
                <TabsContent value="album" className="mt-4">
                    <div>Album content coming soon...</div>
                </TabsContent>
                <TabsContent value="artist" className="mt-4">
                    <div>Artist content coming soon...</div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default MyMusicPage