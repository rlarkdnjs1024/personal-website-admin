import {Datetime} from "@/lib/types";

type DatetimeInputProps = {
    name: string;
    value: string;
    onValueChange: (date: string) => void;
    className?: string;
}

export function DatetimeInput({name, value, onValueChange, className}: DatetimeInputProps) {

    return (
        <div className={className}>
            <input
                name={name}
                type="datetime-local"
                step="1"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-[#4a6248d4]"
            />
        </div>
    )
}