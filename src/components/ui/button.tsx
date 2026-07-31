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
            className={cn("hover:cursor-pointer hover:bg-gray-100 rounded-md box-border pr-1 pl-1 border border-green-900 bg-[#FFFFFFB3]", className)}
        >
            {children}
        </button>
    )
}