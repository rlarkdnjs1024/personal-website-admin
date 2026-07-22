import {RadioGroupContext} from "@/context/radio-context";
import {useContext} from "react";

type RadioGroupProps = {
    name: string;
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    errorMessage?: string;
}

export function RadioGroup({name, value, onValueChange, children}: RadioGroupProps) {
    return (
            <RadioGroupContext value={{name, value, onValueChange: onValueChange}}>
                {children}
            </RadioGroupContext>

    )
}

type RadioItemProps = {
    itemValue: string;
    children: React.ReactNode;
}

export function RadioItem({itemValue, children}: RadioItemProps) {
    const groupContext = useContext(RadioGroupContext);

    if (!groupContext) {
        throw new Error("Component Radio Item can only be used within RadioGroup");
    }

    const {name, value, onValueChange} = groupContext;

    return (
        <label className="hover:cursor-pointer flex justify-center items-center">
            <input
                type="radio"
                name={name}
                value={itemValue}
                onChange={() => onValueChange(itemValue)}
                checked={value === itemValue}
                className="hover:cursor-pointer mr-1"
            />
            <span>{children}</span>
        </label>

    )
}