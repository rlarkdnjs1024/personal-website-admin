type LoadingDotsProps = {
    label: string;
}

export function LoadingDots({label}: LoadingDotsProps) {
    return (
        <span className="flex items-center">
            {label}
            <span className="ml-0.5 flex items-end">
                <span className="animate-bounce [animation-delay:-0.3s]">.</span>
                <span className="animate-bounce [animation-delay:-0.15s]">.</span>
                <span className="animate-bounce">.</span>
            </span>
        </span>
    )
}
