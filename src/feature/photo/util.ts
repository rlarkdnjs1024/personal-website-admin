export function formatTakenAt(value: string) {
    const datePart = value.split("T")[0];
    const [year, month, day] = datePart.split("-").map(Number);

    if (!year || !month || !day) {
        return "Date";
    }

    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(date);
}