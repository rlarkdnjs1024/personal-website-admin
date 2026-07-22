import {FONTS} from "@/fonts/fonts";
import {cn} from "@/lib/utils";

type FontSelectorProps = {
    value: string|null;
    onValueChange: (value: string|null) => void;
}

export function FontSelector({value, onValueChange}: FontSelectorProps) {
    return (
        <div className="w-full rounded-xl box-border pt-3 pb-3 border w-full">
            {FONTS.map(font => (

                    <button
                        key={font.id}
                        className={cn("w-full box-border pl-2 pr-2 flex justify-between hover:bg-gray-100 hover:cursor-pointer",  value === font.id && "bg-gray-200")}
                        onClick={() => onValueChange(font.id)}
                    >
                        <span>{font.label}</span>
                        <span className={font.className}>AaBbCc1234</span>
                    </button>
            ))}
        </div>
    )
}