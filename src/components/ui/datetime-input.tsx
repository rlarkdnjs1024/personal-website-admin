import {Datetime} from "@/types";

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
            />
        </div>
    )
}