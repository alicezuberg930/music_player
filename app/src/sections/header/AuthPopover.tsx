import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Typography } from "@/components/ui/typography"
import { useLocales } from "@/lib/locales"
import { SigninPage, SignupPage } from "@/pages"

const AuthPopover: React.FC = () => {
    const { translate } = useLocales()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Typography variant={'span'} className="text-white">{translate('sign_in')}</Typography>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogTitle></DialogTitle>
                <Tabs defaultValue="sign_in">
                    <TabsList>
                        <TabsTrigger value="sign_in">{translate('sign_in')}</TabsTrigger>
                        <TabsTrigger value="sign_up">{translate('sign_up')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sign_in">
                        <SigninPage />
                    </TabsContent>
                    <TabsContent value="sign_up">
                        <SignupPage />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default AuthPopover