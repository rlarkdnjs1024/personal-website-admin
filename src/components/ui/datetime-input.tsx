import {Datetime} from "@/types";

type DatetimeInputProps = {
    name: string;
    value: Datetime | null;
    onValueChange: (date: Datetime | null) => void;
    className?: string;
}

export function DatetimeInput({name, value, onValueChange, className}: DatetimeInputProps) {

    function formatDatetime(datetime: Datetime) {
        return `${datetime.date}T${datetime.time}`
    }

    function handleChange(value: string) {
        if (!value) {
            onValueChange(null);
            return;
        }

        const date = value.split("T").at(0)!;
        const time = value.split("T").at(1)!;
        onValueChange({date, time});
    }

    return (
        <div className={className}>
            <input
                name={name}
                type="datetime-local"
                step="1"
                value={value ? formatDatetime(value) : ""}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    )
}