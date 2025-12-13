import type { Artist } from "@/@types/artist"
import ArtistCard from "../ArtistCard"
import { useIsMobile } from "@/hooks/useMobile"

export const favoriteArtistsHC = {
    "title": "Nghệ sĩ yêu thích",
    "items": [
        {
            "encodeId": "IW6W8W8I",
            "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/c/5/7/8/c578249e44cd377dcbf086d18039369c.jpg",
            "song": {
                "items": [
                    {
                        "encodeId": "Z7BOE00F",
                        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/5/0/5/e50594cc050440bdcf5f8a09bb7fb050.jpg"
                    },
                    {
                        "encodeId": "Z7BIE0WD",
                        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/0/b/9/2/0b92673d872b15554dad2a5a0facd4e3.jpg"
                    },
                    {
                        "encodeId": "Z7BWOB9O",
                        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/a/2/4/f/a24f9dafba10dfdaf74fbb0267e5b1da.jpg"
                    }
                ]
            }
        },
        {
            "encodeId": "IWZ9ZOCU",
            "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/a/2/4/f/a24f9dafba10dfdaf74fbb0267e5b1da.jpg",
            "song": {
                "items": [
                    {
                        "encodeId": "Z7BOE00F",
                        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/5/0/5/e50594cc050440bdcf5f8a09bb7fb050.jpg"
                    },
                    {
                        "encodeId": "Z7BOE00F",
                        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/5/0/5/e50594cc050440bdcf5f8a09bb7fb050.jpg"
                    },
                    {
                        "encodeId": "Z7BOE00F",
                        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/5/0/5/e50594cc050440bdcf5f8a09bb7fb050.jpg"
                    }
                ]
            }
        },
        {
            "encodeId": "IWZFEAOO",
            "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w360_r1x1_jpeg/avatars/9/6/d/b/96dbe0a4fec177e02fff12ce9ccedf01.jpg",
            "song": {
                "items": [
                    {
                        "encodeId": "Z7BOE00F",
                        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/5/0/5/e50594cc050440bdcf5f8a09bb7fb050.jpg"
                    },
                    {
                        "encodeId": "Z7BOE00F",
                        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/5/0/5/e50594cc050440bdcf5f8a09bb7fb050.jpg"
                    },
                    {
                        "encodeId": "Z7BOE00F",
                        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/5/0/5/e50594cc050440bdcf5f8a09bb7fb050.jpg"
                    }
                ]
            }
        },
        {
            "encodeId": "IWZ9ZWI8",
            "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/1/f/1/3/1f136550b8f5e050b89f50b210d57e41.jpg",
            "song": {
                "items": [
                    {
                        "encodeId": "Z7BOE00F",
                        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/5/0/5/e50594cc050440bdcf5f8a09bb7fb050.jpg"
                    },
                    {
                        "encodeId": "Z7BOE00F",
                        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/5/0/5/e50594cc050440bdcf5f8a09bb7fb050.jpg"
                    },
                    {
                        "encodeId": "Z7BOE00F",
                        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/5/0/5/e50594cc050440bdcf5f8a09bb7fb050.jpg"
                    }
                ]
            }
        },
        {
            "encodeId": "IWZFFOWB",
            "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/4/c/e/a/4ceac8b6c213bcaf2841f5afa0709beb.jpg",
            "song": {
                "items": [
                    {
                        "encodeId": "Z7BOE00F",
                        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/5/0/5/e50594cc050440bdcf5f8a09bb7fb050.jpg"
                    },
                    {
                        "encodeId": "Z7BOE00F",
                        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/5/0/5/e50594cc050440bdcf5f8a09bb7fb050.jpg"
                    },
                    {
                        "encodeId": "Z7BOE00F",
                        "thumbnail": "https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/5/0/5/e50594cc050440bdcf5f8a09bb7fb050.jpg"
                    }
                ]
            }
        }
    ]
}

type Props = {
    artists: Artist[]
}

const ArtistSection: React.FC<Props> = ({ artists }) => {
    const isMobile = useIsMobile()

    return (
        <section className="mt-12">
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Nhạc sĩ nổi bật</h3>
                    <span className="text-xs uppercase">Tất cả</span>
                </div>
                {/* <div className="flex gap-3">
                    {favoriteArtistsHC.items?.slice(0, isMobile ? 2 : 5)?.map(singer => (
                        <Link to={'/'} key={singer?.encodeId} className="flex-1 relative h-80" aria-label={`View ${singer?.encodeId || 'artist'} profile`}>
                            <img src={singer?.thumbnail} alt={singer?.encodeId} className="w-full h-full object-cover rounded-md" />
                            <div className="absolute w-full flex justify-evenly bottom-[5%]">
                                <img src={singer?.song?.items[0]?.thumbnail} alt="song" className="w-1/4 rounded-md object-cover" />
                                <img src={singer?.song?.items[1]?.thumbnail} alt="song" className="w-1/4 rounded-md object-cover" />
                                <img src={singer?.song?.items[2]?.thumbnail} alt="song" className="w-1/4 rounded-md object-cover" />
                            </div>
                        </Link>
                    ))}
                </div> */}
            </div>
            <div className="flex items-center mt-12 gap-4">
                {artists.slice(0, isMobile ? 2 : 5)?.map(artist => (
                    <ArtistCard artist={artist} key={artist?.id} visibleSlides={isMobile ? 2 : 5} />
                ))}
            </div>
        </section>
    )
}

export default ArtistSection