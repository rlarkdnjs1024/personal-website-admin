import {SelectBoxContext, useSelectBoxContext} from "@/context/select-box-context";
import {cn} from "@/lib/utils";
import React, {useContext, useState} from "react";

type SelectBoxProps<T> = {
    value: T|null;
    onValueChange: (value: T) => void;
    placeholder: string;
    children: React.ReactNode;
    className?: string;
}


export function SelectBox<T>({value, onValueChange, placeholder, children, className}: SelectBoxProps<T>) {

    const [displayValue, setDisplayValue] = useState<string>(placeholder);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const isDefaultValue = displayValue === placeholder;

    const handleValueChange = (value: T, label: string) => {
        onValueChange(value);
        setDisplayValue(label);
        setIsOpen(false);
    }

    return (
        <SelectBoxContext.Provider value={{value, handleValueChange}}>
            <div className={cn("relative w-full", className)}>
                <div className={cn(
                    "h-10 rounded-lg border px-3 bg-white transition-colors",
                    isOpen ? "border-[#4a6248d4]" : "border-gray-200"
                )}>
                    <div className="flex items-center h-full">
                        <div className="flex-1">
                            <span className={isDefaultValue ? "text-gray-400" : undefined}>
                                {displayValue}
                            </span>
                        </div>

                        <DropDownIcon
                            isOpen={isOpen}
                            onClick={() => setIsOpen(!isOpen)}
                            className="size-5 text-gray-400"
                        />
                    </div>
                </div>

                {
                    isOpen && (
                        <div className="absolute top-full left-0 z-10 mt-1 w-full rounded-lg bg-white shadow-md max-h-50 overflow-y-scroll">
                            {children}
                        </div>
                    )
                }

            </div>
        </SelectBoxContext.Provider>


    )
}


type SelectOptionProps<T> = {
    optionValue: T;
    label: string;
    className?: string;
}

export function SelectOption<T>({optionValue, label, className}: SelectOptionProps<T>) {
    const context = useSelectBoxContext();

    if (!context) {
        throw new Error("SelectOption should be used within the SelectBox");
    }

    const {value: selectedValue, handleValueChange} = context;

    return (
            <button
                type="button"
                className={cn("w-full text-left h-10 p-2 hover:bg-gray-100 hover:cursor-pointer border-b border-b-gray-100", className)}
                onClick={()=>handleValueChange(optionValue, label)}
            >
                {label}
            </button>
    )
}


type DropDownIconProps = {
    isOpen: boolean;
    onClick: () => void;
    className?: string;
}
function DropDownIcon({isOpen, onClick, className}: DropDownIconProps): React.ReactNode {
    return (
        <button
            type="button"
            onClick={onClick}
            className={"hover:cursor-pointer"}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
            >
                {
                    isOpen ? (
                        <g>
                            <path fill="none" d="M0 0h24v24H0z"/>
                            <path fill="currentColor" d="M12 11.828l-2.828 2.829-1.415-1.414L12 9l4.243 4.243-1.415 1.414L12 11.828z"/>
                        </g>
                    ) : (
                        <g>
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path
                                fill="currentColor"
                                d="M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z"
                            />
                        </g>
                    )
                }

            </svg>
        </button>
    );
}