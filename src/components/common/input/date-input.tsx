

type DatePickerProps = {
    value: string|null;
    onValueChange: (value: string|null) => void;
}

export default function DatePicker({value, onValueChange}: DatePickerProps) {
    return (
        <input
            type="date"
            value={value ?? undefined}
            onChange={(e) => onValueChange(e.target.value)}
        />
    )
}