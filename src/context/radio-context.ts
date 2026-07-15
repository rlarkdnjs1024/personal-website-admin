import {Context, createContext} from "react";

type RadioContextType = {
    name: string;
    value: string;
    onValueChange: (value: string) => void;
}

export const RadioGroupContext = createContext<RadioContextType|null>(null)