import {cn} from "@/lib/utils";
import {KeyboardEventHandler} from "react";

type TextInputProps = {
    name: string,
    value?: string,
    onValueChange: (value: string) => void,
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>,
    maxLength?: number,
    placeholder?: string,
    className?: string,
}

export function TextInput({name, value, onValueChange, onKeyDown, maxLength, placeholder, className}: TextInputProps) {

    return (
            <input
                name={name}
                type="text"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                maxLength={maxLength}
                className={cn("w-full outline-none", className)}
            />
    )
}
