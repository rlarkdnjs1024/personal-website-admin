import {useRef, useState} from "react";
import {cn} from "@/lib/utils";
import {HexAlphaColorPicker} from "react-colorful";

const DEFAULT_COLORS = [

    { name: "coral red", value: "#FFD6D680" },
    { name: "apricot orange", value: "#FFE2CC80" },
    { name: "butter yellow", value: "#FFF0C280" },
    { name: "line cream", value: "#E8F5C880" },
    { name: "mint green", value: "#D9F2D080" },
    { name: "torqoise", value: "#CFEFE880" },
    { name: "pastel blue", value: "#D6ECFF80" },
    { name: "lavender blue", value: "#DCDFFF80" },
    { name: "연보라", value: "#E9D8FF80" },
    { name: "라일락 핑크", value: "#F4D6FF80" },
    { name: "베이비 핑크", value: "#FFD8EB80" },
    { name: "로즈 베이지", value: "#F6D9D080" },
    { name: "크림 베이지", value: "#E8DED380" },
    { name: "소프트 그레이", value: "#A6A59C1F" },
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
        <div>
            <div className="relative inline-block">
                <button
                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-md ring-1 ring-gray-200 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
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

            <div className="inline-block">
                <div className="flex flex-col gap-2">
                    <div className="flex gap-1">
                        {DEFAULT_COLORS.map(color => (
                            <button
                                key={color.value}
                                onClick={() => {
                                    setInputValue(color.value);
                                    setPreviewColor(color.value);
                                    onValueChange(color.value);
                                }}
                                className="h-6 w-6 rounded
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

                    <div className="flex gap-1">
                        <button onClick={() => onValueChange("#FFFDF8")}>
                            <div className={cn("w-6 h-6 rounded",  `bg-[${previewColor}]`)}/>
                        </button>
                    </div>
                </div>
            </div>


        </div>

    )
}