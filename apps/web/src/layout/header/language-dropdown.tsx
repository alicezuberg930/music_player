import useLocales from "@/lib/locales/useLocales"
import { Avatar, AvatarImage } from "@yukikaze/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@yukikaze/ui/dropdown-menu"
import { Typography } from "@yukikaze/ui/typography"
import { memo } from "react"

const LanguageDropdown: React.FC = () => {
  const { onChangeLang, currentLang, allLangs } = useLocales()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        render={<Avatar />}
      >
        <AvatarImage src={currentLang.icon} alt={currentLang.value} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-100" align="end">
        <DropdownMenuGroup>
          {allLangs.map((lang) => (
            <DropdownMenuItem
              key={lang.value}
              onClick={() => onChangeLang(lang.value)}
            >
              <Typography>{lang.label}</Typography>
              <DropdownMenuShortcut>
                <img src={lang.icon} alt={lang.value} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default memo(LanguageDropdown)