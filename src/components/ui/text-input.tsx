import {cn} from "@/lib/utils";
import {KeyboardEventHandler} from "react";

type TextInputProps = {
    name: string,
    value: string,
    onValueChange: (value: string) => void,

    onKeyDown?: KeyboardEventHandler<HTMLInputElement>,
    minLength?: number,
    maxLength?: number,
    placeholder?: string,

    className?: string,
}

export function TextInput({name, value, onValueChange, onKeyDown, minLength, maxLength, placeholder, className}: TextInputProps) {

    return (
            <input
                name={name}
                type="text"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                maxLength={maxLength}
                className={cn("border rounded-lg box-border pl-1 pr-1 border-green-800 bg-transparent text-foreground outline-none w-full", className)}
            />
    )
}
