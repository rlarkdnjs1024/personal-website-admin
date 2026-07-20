import {useRef, useState} from "react";
import {cn} from "@/lib/utils";
import {HexAlphaColorPicker} from "react-colorful";

const DEFAULT_COLORS = [
    { name: "Coral Red", value: "#FFD6D680" },
    { name: "Apricot Orange", value: "#FFE2CC80" },
    { name: "Butter Yellow", value: "#FFF0C280" },
    { name: "Lime Cream", value: "#E8F5C880" },
    { name: "Mint Green", value: "#D9F2D080" },
    { name: "Turquoise", value: "#CFEFE880" },
    { name: "Pastel Blue", value: "#D6ECFF80" },
    { name: "Lavender Blue", value: "#DCDFFF80" },
    { name: "Light Purple", value: "#E9D8FF80" },
    { name: "Lilac Pink", value: "#F4D6FF80" },
    { name: "Baby Pink", value: "#FFD8EB80" },
    { name: "Rose Beige", value: "#F6D9D080" },
    { name: "Cream Beige", value: "#E8DED380" },
    { name: "Soft Gray", value: "#A6A59C1F" },
    { name: "Peach Pink", value: "#FFCDBD80" },
    { name: "Honey Gold", value: "#F6D58A80" },
    { name: "Sage Green", value: "#C8DDBF80" },
    { name: "Powder Teal", value: "#BFE3DF80" },
    { name: "Periwinkle", value: "#C9D0F580" },
    { name: "Dusty Mauve", value: "#D8BFD080" },
];

type ColorPickerProps = {
    value: string,
    onValueChange: (value: string) => void,

    name: string,
}

export function ColorPicker({value, onValueChange, name}: ColorPickerProps) {
    const [inputValue, setInputValue] = useState<string>("#E8DED380");
    const [previewColor, setPreviewColor] = useState<string>("#E8DED380");
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const colorPickerRef = useRef<HTMLInputElement>(null);

    function validateHex(value: string) {
        return /^#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?$/.test(value);
    }

    function handleManualColorChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.toUpperCase();
        setInputValue(value);

        if (validateHex(value)) {
            setPreviewColor(value);
            onValueChange(value);
        }
    }

    return (
        <div className="flex w-full justify-between">
            <div className="relative w-[20%]">
                <button
                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                    className="w-full aspect-square rounded-full border-4 border-white shadow-md ring-1 ring-gray-200 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
                    style={{ backgroundColor: previewColor }}
                >
                </button>

                {isPickerOpen && (
                    <div className="absolute left-full top-0 z-50 ml-3 rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
                        <div className="mb-2 flex justify-end">
                            <button
                                onClick={() => setIsPickerOpen(false)}
                                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <HexAlphaColorPicker
                            color={value}
                            onChange ={(previewValue) => {
                                setPreviewColor(previewValue.toUpperCase())
                                setInputValue(previewValue.toUpperCase())
                        }}
                            onChangeEnd={(color) => onValueChange(color)}
                        />
                        <div>
                            <input
                                type="text"
                                maxLength={9}
                                value={inputValue}
                                onChange={handleManualColorChange}
                                className={`
                                    w-28
                                    cursor-default
                                    border-0 border-b border-gray-300
                                    bg-transparent px-1 py-1
                                    outline-none
                                    transition-shadow
                                    focus:border-gray-400
                                    `}

                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-10 gap-1 w-[70%] items-center">
                    {DEFAULT_COLORS.map(color => (
                        <button
                            key={color.value}
                            onClick={() => {
                                setInputValue(color.value);
                                setPreviewColor(color.value);
                                onValueChange(color.value);
                            }}
                            className="w-full aspect-square rounded
                                    border border-black/10
                                    shadow-sm
                                    transition-all duration-150
                                    hover:-translate-y-0.5
                                    hover:cursor-pointer
                                    hover:scale-110
                                    hover:border-black/20
                                    hover:shadow-md
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-gray-400
                                    focus-visible:ring-offset-2
                                    active:scale-95"
                            style={{ backgroundColor: color.value }}
                        >
                        </button>
                    ))}
                </div>
        </div>

    )
}