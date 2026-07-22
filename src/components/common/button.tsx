import {ReactNode} from "react";

export type ButtonProps = {
    onClick: () => void,
    children: ReactNode
}

export function Button({onClick, children}: ButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="hover:cursor-pointer rounded-md box-border pr-1 pl-1 border border-green-900 bg-gray-200"
        >
            {children}
        </button>
    )
}