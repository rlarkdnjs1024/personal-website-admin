import {Context, createContext} from "react";

type SelectBoxContextProps = {
    value: string|null;
    handleValueChange: (value: string, label: string) => void;
}

export const SelectBoxContext = createContext<SelectBoxContextProps|null>(null)