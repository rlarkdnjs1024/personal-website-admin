import {ReactNode} from "react";
import {cn} from "@/lib/utils";

export type ButtonProps = {
    onClick: () => void,
    className?: string;
    children?: ReactNode
}

export function Button({onClick, className, children}: ButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn("hover:cursor-pointer rounded-md box-border px-4 py-2 text-sm font-medium text-white bg-[#4a6248d4] hover:bg-[#4a6248] transition-colors disabled:cursor-not-allowed disabled:opacity-60", className)}
        >
            {children}
        </button>
    )
}