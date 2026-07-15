import {createContext} from "react";

type CheckBoxGroupContextType = {
    name: string,
    values: string[],
    onChange: (value: string[]) => void,

}

export const CheckBoxGroupContext = createContext<CheckBoxGroupContextType|null>(null);