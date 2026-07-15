import {CheckBoxGroupContext} from "@/context/check-box-context";
import {useContext} from "react";

type SingleCheckBoxProps = {
    value: boolean
    onValueChange: (value: boolean) => void
    children: React.ReactNode
}


export function SingleCheckBox({value, onValueChange, children}: SingleCheckBoxProps) {
    return (
        <label>
            <input
                type={"checkbox"}
                checked={value}
                onChange={(e) => onValueChange(e.target.checked)} />
            {children}
        </label>

    )
}

type CheckBoxGroupProps = {
    name: string,
    values: string[],
    onChange: (value: string[]) => void,
    children: React.ReactNode
}

export function CheckBoxGroup({name, values, onChange, children}: CheckBoxGroupProps) {
    return (
        <CheckBoxGroupContext value={{name, values, onChange}}>
            {children}
        </CheckBoxGroupContext>
    )
}

type CheckBoxItemProps = {
    itemValue: string,
    children: React.ReactNode
}

export function CheckBoxItem({itemValue, children}: CheckBoxItemProps) {

    const context = useContext(CheckBoxGroupContext);

    if (!context) {
        throw new Error("Checkbox item can only be used within checkbox item groups");
    }

    const {name, values, onChange} = context;

    function handleChange(targetValue: string, checked: boolean) {
        if (checked) {
            onChange([...values, itemValue]);
        } else {
            onChange(values.filter(x => x !== targetValue));
        }
    }

    return (
        <label>
            <input
                name={name}
                type="checkbox"
                checked={values.includes(itemValue)}
                onChange={(e) => handleChange(itemValue, e.target.checked)}
            />
            {children}
        </label>

    )
}


