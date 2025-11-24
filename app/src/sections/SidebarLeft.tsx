import { NavLink } from "react-router-dom"
import { sidebarMenu } from "@/lib/menu"
import { Typography } from "@/components/ui/typography"

const SidebarLeft: React.FC = () => {
    const checkActive = (active: boolean) => {
        return `${active ? `text-[#0F7070] bg-main-100` : `text-[#32323D]`} text-sm py-2 px-[25px] font-bold flex gap-3 items-center justify-start`
    }

    return (
        <div className="sm:block hidden lg:w-48 w-20 flex-none border bg-main-200 transition-all duration-1500 ease-in-out">
            <div className="h-full flex flex-col">
                <div className="w-full h-16 py-4 px-6 flex justify-start items-center gap-1">
                    <img src='./vite.svg' alt="logo" />
                    <div className="hidden lg:block">
                        <Typography className="m-0 font-semibold">Tiến's MP3</Typography>
                    </div>
                </div>
                <div className="flex flex-col">
                    {sidebarMenu.map((value, index) => (
                        <NavLink to={value.path} key={index} className={({ isActive }) => checkActive(isActive)}>
                            {value.icon}
                            <Typography className="hidden lg:inline m-0">{value.text}</Typography>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SidebarLeft