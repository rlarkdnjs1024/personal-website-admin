import { createContext, useContext } from "react";

type SelectBoxContextProps<T> = {
    value: T | null;
    handleValueChange: (value: T, label: string) => void;
};

export const SelectBoxContext =
    createContext<SelectBoxContextProps<any> | null>(null);


export function useSelectBoxContext<T>() {
    const context = useContext(SelectBoxContext);
    if (!context) {
        throw new Error("SelectOption should be used within SelectBox");
    }
    return context as SelectBoxContextProps<T>;
}