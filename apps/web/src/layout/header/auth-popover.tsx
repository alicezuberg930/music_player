import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@yukikaze/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yukikaze/ui/tabs"
import { Typography } from "@yukikaze/ui/typography"
import { useLocales } from "@/lib/locales"
import SignInForm from "./sign-in-form"
import SignUpForm from "./sign-up-form"
import { memo } from "react"

const AuthPopover: React.FC = () => {
  const { translate } = useLocales()

  return (
    <Dialog>
      <DialogTrigger
        nativeButton={false}
        render={<Typography variant={"span"} className="text-white" />}
      >
        {translate("sign_in")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle></DialogTitle>
        <Tabs defaultValue="sign_in">
          <TabsList>
            <TabsTrigger value="sign_in">{translate("sign_in")}</TabsTrigger>
            <TabsTrigger value="sign_up">{translate("sign_up")}</TabsTrigger>
          </TabsList>
          <TabsContent value="sign_in">
            <SignInForm />
          </TabsContent>
          <TabsContent value="sign_up">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default memo(AuthPopover)