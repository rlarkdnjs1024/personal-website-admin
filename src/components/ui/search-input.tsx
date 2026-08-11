import { useEffect, useRef, useState } from "react";
import {TextInput} from "@/components/ui/text-input";
import {cn} from "@/lib/utils";

type SearchInputProps = {
    name: string;
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    getSuggestions: (keyword: string) => Promise<string[]>;
    className?: string;
};

export function SearchInput({
                                name,
                                value,
                                onValueChange,
                                placeholder,
                                getSuggestions,
                                className,
                            }: SearchInputProps) {
    const [options, setOptions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const isSelectingRef = useRef(false);

    useEffect(() => {
        if (isSelectingRef.current) {
            isSelectingRef.current = false;
            return;
        }

        if (!value.trim()) {
            setOptions([]);
            setIsOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const result = await getSuggestions(value);

                setOptions(result);
                setIsOpen(result.length > 0);
            } catch (error) {
                console.error("Failed to get suggestions", error);

                setOptions([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [value, getSuggestions]);

    function handleSelect(option: string) {
        isSelectingRef.current = true;

        onValueChange(option);
        setOptions([]);
        setIsOpen(false);
    }

    return (
        <div className={cn("relative", className)}>
            <TextInput
                name={name}
                value={value}
                onValueChange={onValueChange}
                placeholder={placeholder}
            />

            {isOpen && (
                <div
                    className="
                        absolute left-0 top-full z-20
                        mt-1 w-full
                        overflow-hidden
                        rounded-md
                        border border-gray-100
                        bg-white
                        shadow-lg
                    "
                >
                    <div className="max-h-52 overflow-y-auto py-1">
                        {options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className="
                                    block h-10 w-full
                                    px-3
                                    text-left
                                    hover:bg-gray-100
                                "
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}