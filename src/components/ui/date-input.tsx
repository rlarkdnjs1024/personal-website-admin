

type DatePickerProps = {
    value: string;
    onValueChange: (value: string) => void;
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