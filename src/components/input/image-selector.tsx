import {validateFileType, validateImageDimension, validateSize} from "@/lib/utils";

type ImageSelectorProps = {
    name: string;
    file: UploadImage | null,
    onFileChange: (file: UploadImage) => void,
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

    const ALLOWED_TYPES = ["image/jpg", "image/png", "image/heic"];

    //이미지 파일의 크기는 500KiB로 제한
    const MAXIMUM_SIZE = 500 * 1024;

    //이미지 파일의 최대 가로 세로 크기 제한
    const MAXIMUM_DIMENSION = {width: 1000, height: 1000};


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
            window.alert("지원하는 파일 타입이 아닙니다.");
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
        image.src = URL.createObjectURL(inputFile);

    }


    return (
        <div>
            <label className={"bg-gray-500 w-full h-20 block"}>
                클릭해서 사진을 선택하세요.
                <input
                    type="file"
                    className={"sr-only"}
                    onChange={(e) => handleFileUpload(e.target.files)}
                />
            </label>
            {/*preview 영역*/}
            {
                file && (
                    <div>
                        <img src={file.previewUrl}/>
                        <div>{file.size}B {file.originalName} {file.dimension.width}x{file.dimension.height}</div>
                        <button>

                        </button>
                    </div>
                )
            }
        </div>
    )
}