import {TextInput} from "@/components/input/text-input";
import {useState} from "react";

type HashTagInputProps = {
    hashtags: string[],
    onChange: (hashtags: string[]) => void,
    maxCount?: number,
    minLength?: number,
    maxLength?: number,
}

export function HashTagInput({hashtags, onChange, maxCount, minLength, maxLength}: HashTagInputProps) {

    const [inputText, setInputText] = useState("");
    console.log("해시태그 길이", hashtags.length);

    const errorMessage =
        hashtags.length === maxCount && inputText.trim() ? `You can add up to ${maxCount} hashtags.` : "";

    //text input에서 발생한 key Down event를 처리한다.
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        const code = e.code;
        const trimmed = inputText.trim();

        //space, enter로 해시태그 추가
        if (["Space", "Enter"].includes(code)) {
            e.preventDefault();

            if (!trimmed || hashtags.includes(trimmed)) {
                setInputText("");
                return;
            }

            if (maxCount && hashtags.length === maxCount) {
                return;
            }

            onChange([...hashtags, inputText.trim()]);
            setInputText("");
        }

        //뒤로가기 버튼으로 해시태그 뒤에서부터 삭제
        else if (trimmed === "" && code === "Backspace") {
            onChange([...hashtags.slice(0, hashtags.length-1)]);
        }

    }

    function handleDelete(tag: string) {
        onChange(hashtags.filter(x => x !== tag));

    }

    return (
        <div>
            {hashtags.map(tag => (
                <span key={tag} className="border border-black">
                    {"#"}{tag}
                    <button type="button" onClick={() => handleDelete(tag)}>
                        &#215;
                    </button>
                </span>
            ))}
            <TextInput
                name="hash-tag-input"
                value={inputText}
                onValueChange={setInputText}
                onKeyDown={handleKeyDown}
                minLength={minLength}
                maxLength={maxLength}
                className="border-0 inline"
                errorMessage={errorMessage}
            />
        </div>

    )
}