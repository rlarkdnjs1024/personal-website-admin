import {ReactNode} from "react";
import {cn} from "@/lib/utils";

export type ButtonProps = {
    onClick?: () => void,
    type?: "button" | "submit";
    className?: string;
    children?: ReactNode
    loading?: boolean;
}

export function Button({onClick, type = "button", className, children, loading}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
            className={cn("flex items-center justify-center gap-2 hover:cursor-pointer rounded-md box-border px-4 py-2 text-sm font-medium text-white bg-[#4a6248d4] hover:bg-[#4a6248] transition-colors disabled:cursor-not-allowed disabled:opacity-60", className)}
        >
            {children}
        </button>
    )
}