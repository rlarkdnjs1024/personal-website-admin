import {FONTS} from "@/fonts/fonts";
import {cn} from "@/lib/utils";

type FontSelectorProps = {
    value: string;
    onValueChange: (value: string) => void;
}

export function FontSelector({value, onValueChange}: FontSelectorProps) {
    return (
        <div className="border w-full">
            {FONTS.map(font => (
                <div key={font.id}>
                    <button
                        className="w-full flex items-center hover:bg-gray-100 hover:cursor-pointer border-b-blue-800"
                        onClick={() => onValueChange(font.id)}
                    >
                        <span>{font.label}</span>
                        <span className={cn("flex-1 text-center", font.className)}>Everything will be great in 2026</span>
                        <span className="w-4 text-right">{value === font.id && <>&#10004;</>}</span>
                    </button>
                </div>
            ))}
        </div>
    )
}