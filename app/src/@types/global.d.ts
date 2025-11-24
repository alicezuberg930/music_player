// Source - https://stackoverflow.com/a
// Posted by Pavel Šindelka
// Retrieved 2025-11-24, License - CC BY-SA 4.0
import { MotionProps as OriginalMotionProps } from "framer-motion";

declare module "framer-motion" {
    interface MotionProps extends OriginalMotionProps {
        className?: string;
    }
}
