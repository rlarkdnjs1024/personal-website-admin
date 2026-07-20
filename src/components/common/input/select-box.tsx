//value는 문자열 형태로 관리하고 state가 숫자 등의 형식일때는 state를 소유한 컴포넌트에서 handler 함수를 만들어서 string을
//변환하여 사용한다.

type SelectBoxProps = {
    name: string;
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    className?: string;

}


export function SelectBox({name, value, onValueChange, children, className}: SelectBoxProps) {

    return (
        <select
            name={name}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            className={className}
        >
            {children}
        </select>
    )

}


type SelectOptionProps = {
    optionValue: string;
    children: React.ReactNode;
    className?: string;
}

export function SelectOption({optionValue, children, className}: SelectOptionProps) {
    return (
        <option value={optionValue} className={className}>
            {children}
        </option>
    )
}