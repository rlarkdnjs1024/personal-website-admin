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
    errorMessage?: string,

    className?: string,
}

export function TextInput({name, value, onValueChange, onKeyDown, minLength, maxLength, placeholder, errorMessage, className}: TextInputProps) {

    function getDisplayErrorMessage() {
        if (errorMessage) {
            return errorMessage;
        } else if (minLength && value.length < minLength) {
            return `(!) Should be at least ${minLength} characters.`;
        } else if (maxLength && value.length > maxLength) {
            return `(!) Should be less than ${maxLength} characters.`;
        }
        else {
            return "";
        }
    }

    const displayErrorMessage = getDisplayErrorMessage();

    return (
        <>
            <input
                name={name}
                type="text"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                maxLength={maxLength}
                className={cn("border rounded-lg border-green-800 bg-transparent text-foreground outline-none w-full", className)}
            />
            <p className={cn("text-red-600 inline", displayErrorMessage ? "visible" : "invisible")}>
                {displayErrorMessage || "\u00A0"}
            </p>
        </>

    )
}
