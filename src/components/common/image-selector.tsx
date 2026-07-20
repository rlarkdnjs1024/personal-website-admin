import {validateFileType, validateImageDimension, validateSize} from "@/lib/utils";
import {useRef} from "react";

type ImageSelectorProps = {
    name: string;
    file: UploadImage | null,
    onFileChange: (file: UploadImage | null) => void,
}

export type UploadImage = {
    originalFile: File,
    originalName: string,
    size: number,
    dimension: ImageDimension,
    previewUrl: string,
}

type ImageDimension = {
    width: number,
    height: number
}

export function ImageSelector({file, onFileChange}: ImageSelectorProps) {

    const inputRef = useRef<HTMLInputElement | null>(null);

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/heic"];

    //이미지 파일의 크기는 2MiB로 제한
    const MAXIMUM_SIZE = 2 * 1024 * 1024;

    //이미지 파일의 최대 가로 세로 크기 제한
    const MAXIMUM_DIMENSION = {width: 5000, height: 7000};

    function handleClick() {
        if (inputRef) {
            inputRef.current?.click()
        }
    }


    function handleFileUpload(files: FileList | null) {

        const previewUrl = file?.previewUrl;

        //null인 경우 처리
        if (!files) {
            return;
        }

        const inputFile = files.item(0);

        if (!inputFile) {
            return;
        }

        //File객체의 type property는 파일의 MIME type을 반환한다.
        const fileType = inputFile.type;
        const fileSize = inputFile.size;

        //이미지의 MIME type을 검사한다.
        if (!validateFileType(fileType, ALLOWED_TYPES)) {
            window.alert(`지원하는 파일 타입이 아닙니다. ${fileType}`);
            return;
        }

        if (!validateSize(fileSize, MAXIMUM_SIZE)) {
            window.alert("이미지의 용량이 너무 큽니다.");
            return;
        }

        //여기서 heic을 jpg로 변환한다.

        const image = new Image();
        image.onload = () => {

            const fileDimension = {
                width: image.naturalWidth,
                height: image.naturalHeight,
            }
            if (!validateImageDimension(fileDimension, MAXIMUM_DIMENSION)) {
                URL.revokeObjectURL(image.src);
                window.alert("이미지의 크기가 너무 큽니다.");
                return;
            }

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            onFileChange({
                originalFile: inputFile,
                originalName: inputFile.name,
                size: fileSize,
                dimension: fileDimension,
                previewUrl: image.src,
            })
        }

        image.onerror = () => {
            window.alert("이미지 로드 중 에러가 발생했습니다.");
            URL.revokeObjectURL(image.src);
        }

        image.src = URL.createObjectURL(inputFile);

    }

    function handleDeleteButton() {
        if (file) {
            URL.revokeObjectURL(file.previewUrl);
            onFileChange(null);
        }

    }


    return (
        <div>
            {
                file === null ? (
                    <div className="bg-gray-200 w-[95%] h-20 box-border p-2 border border-green-900 border-dashed m-auto flex items-center justify-center rounded-xl">
                <span>
                    <button className="text-green-900 underline hover:cursor-pointer" onClick={() => handleClick()}>
                        Click
                    </button>
                    {" "}or drag&drop image
                </span>
                    </div>
                ) : (
                    <div
                        className="bg-gray-200 w-[95%] h-20 box-border p-2 border border-green-900 border-dashed m-auto flex justify-between rounded-xl">
                        <div className="relative">
                            <img
                                src={file.previewUrl}
                                className="h-full aspect-square object-cover"
                            />
                            <button
                                onClick={() => handleDeleteButton()}
                                className="absolute block rounded-full w-[1.5em] aspect-square bg-white hover:cursor-pointer z-10 -right-1 -top-1 hover:scale-110"
                            >
                                x
                            </button>
                        </div>
                        <div className={"flex flex-col items-center justify-center"}>
                            <div>
                                {file.originalName}
                            </div>
                            <div>
                                {file.dimension.width} x {file.dimension.height} ({file.size}B)
                            </div>
                        </div>

                    </div>
                )
            }

            <input
                type="file"
                ref={inputRef}
                className={"sr-only"}
                accept={ALLOWED_TYPES.join(",")}
                onChange={(e) => handleFileUpload(e.target.files)}
            />
        </div>
    )
}