type DatePickerProps = {
    value: string;
    onValueChange: (value: string) => void;
}

export default function TimePicker({value, onValueChange}: DatePickerProps) {
    return (
        <input
            type="time"
            value={value ?? undefined}
            onChange={(e) => onValueChange(e.target.value)}
        />
    )
}