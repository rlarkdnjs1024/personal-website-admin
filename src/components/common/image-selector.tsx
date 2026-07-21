import {
    cn,
    convertHeicToJpeg,
    extractFileName,
    formatBytes,
    validateFileType,
    validateImageDimension,
    validateSize
} from "@/lib/utils";
import {useRef, useState} from "react";
import {isHeic} from "heic-to";
import imageCompression from "browser-image-compression";

type ImageSelectorProps = {
    name: string;
    file: UploadImage | null,
    onFileChange: (file: UploadImage | null) => void,
    policy: ImageSelectorPolicy,
}

/** 업로드가 확정된 이미지 상태. 실제 전송에 쓰이는 File과 화면 표시용 메타데이터를 함께 담는다. */
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

/**
 * ImageSelector의 동작을 결정하는 정책.
 * - useAutoConvert: heic 파일을 jpeg로 자동 변환할지 여부. false면 heic는 그대로 거부된다.
 * - useAutoAdjust: size/dimension이 한도를 넘었을 때 자동 압축·리사이즈를 시도할지 여부. false면 즉시 거부된다.
 */
export type ImageSelectorPolicy = {
    useAutoConvert?: boolean,
    useAutoAdjust?: boolean,
    maximumBytes: number,
    maximumWidthOrHeight: number,
}

/** browser-image-compression은 용량 옵션을 MB 단위로 받기 때문에 byte ↔ MB 환산에 사용한다. */
const BYTES_PER_MB = 1024 * 1024;

/**
 * 파일의 실제 픽셀 크기를 알아낸다.
 * `new Image()` + onload 방식보다 가벼운 디코딩 전용 API(createImageBitmap)를 사용하며,
 * 미리보기를 만들 목적이 아니라 "자동 보정이 필요한가?"를 판단하기 위한 사전 체크용이다.
 */
async function getDimension(file: File): Promise<ImageDimension> {
    const bitmap = await createImageBitmap(file);
    const dimension = {width: bitmap.width, height: bitmap.height};
    bitmap.close();
    return dimension;
}

/**
 * 파일을 실제로 디코딩해서 미리보기용 objectURL과 "진짜" dimension을 얻는다.
 * 압축 라이브러리가 무엇을 했다고 주장하든, 최종 판단은 항상 이 결과를 기준으로 한다.
 * 브라우저가 디코딩할 수 없는 파일이면 reject된다.
 */
function decodeImage(file: File): Promise<{ url: string, dimension: ImageDimension }> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const url = URL.createObjectURL(file);

        image.onload = () => {
            resolve({
                url,
                dimension: {width: image.naturalWidth, height: image.naturalHeight},
            });
        };

        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to decode image."));
        };

        image.src = url;
    });
}

export function ImageSelector({name, file, onFileChange, policy}: ImageSelectorProps) {

    const inputRef = useRef<HTMLInputElement | null>(null);

    // 변환/압축/디코딩이 진행되는 동안 중복 선택을 막고 상태를 보여주기 위한 플래그
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const AUTO_CONVERT = policy.useAutoConvert ?? false;
    const AUTO_ADJUST = policy.useAutoAdjust ?? false;

    const MAXIMUM_BYTES = policy.maximumBytes;
    const MAXIMUM_WIDTH_OR_HEIGHT = policy.maximumWidthOrHeight;

    // width/height 각각에 동일한 한도를 적용한다 (browser-image-compression의 maxWidthOrHeight와 같은 의미)
    const MAXIMUM_DIMENSION: ImageDimension = {
        width: MAXIMUM_WIDTH_OR_HEIGHT,
        height: MAXIMUM_WIDTH_OR_HEIGHT,
    };

    // <input accept="">는 MIME과 확장자를 함께 넣어야 브라우저별 파일 선택창 필터링이 안정적으로 동작한다.
    // heic는 useAutoConvert가 켜져 있을 때만 선택 가능한 옵션으로 노출한다.
    const ALLOWED_TYPES = [
        "image/jpeg", ".jpg", ".jpeg",
        "image/png", ".png",
        ...(AUTO_CONVERT ? ["image/heic", ".heic"] : []),
    ];

    function handleClick() {
        inputRef.current?.click();
    }

    function handleDeleteButton() {
        if (file) {
            URL.revokeObjectURL(file.previewUrl);
            onFileChange(null);
        }
    }

    async function handleFileUpload(files: FileList | null) {
        const inputFile = files?.item(0);

        //파일이 선택되지 않은 경우(취소 등) 처리
        if (!inputFile) {
            return;
        }

        setIsLoading(true);

        try {
            // 1. heic 여부 판단 후 필요하면 jpeg로 변환한다.
            //    MIME 타입/확장자는 브라우저마다 heic를 다르게 표기해서 신뢰할 수 없으므로,
            //    isHeic()으로 실제 파일 내용을 직접 검사해서 판단한다.
            let convertedFile = inputFile;
            const isFileHeic = await isHeic(inputFile);

            if (isFileHeic && AUTO_CONVERT) {
                try {
                    convertedFile = await convertHeicToJpeg(inputFile);
                } catch (e) {
                    window.alert("Failed to convert image.");
                    console.error(e);
                    return;
                }
            }

            // 2. 변환 이후에도 jpeg/png가 아니면 거부한다.
            //    (heic 자동 변환이 꺼져 있는데 heic가 들어온 경우, 혹은 애초에 지원하지 않는 포맷인 경우)
            if (!validateFileType(convertedFile.type, ["image/jpeg", "image/png"])) {
                window.alert("File type is not supported.");
                return;
            }

            // 3. 자동 보정(압축)이 필요한지 판단하기 위해 실제 dimension을 먼저 확인한다.
            //    파일 용량(byte)은 File.size로 바로 알 수 있지만, dimension은 디코딩을 거쳐야만 알 수 있다.
            let originalDimension: ImageDimension;
            try {
                originalDimension = await getDimension(convertedFile);
            } catch (e) {
                window.alert("Failed to load image.");
                console.error(e);
                return;
            }

            const isSizeExceeded = !validateSize(convertedFile.size, MAXIMUM_BYTES);
            const isDimensionExceeded = !validateImageDimension(originalDimension, MAXIMUM_DIMENSION);

            let adjustedFile = convertedFile;
            let wasAdjusted = false;

            // 4. size 또는 dimension이 한도를 넘으면, 자동 보정이 켜져 있을 때만 압축을 시도한다.
            //    꺼져 있으면 사용자가 직접 더 작은 이미지를 골라야 한다.
            if (isSizeExceeded || isDimensionExceeded) {
                if (!AUTO_ADJUST) {
                    window.alert(isSizeExceeded ? "Your file size is too large." : "Your image exceeds the dimension limit.");
                    return;
                }

                try {
                    adjustedFile = await imageCompression(convertedFile, {
                        maxSizeMB: MAXIMUM_BYTES / BYTES_PER_MB,
                        maxWidthOrHeight: MAXIMUM_WIDTH_OR_HEIGHT,
                        useWebWorker: true,
                    });
                } catch (e) {
                    window.alert("Failed to auto compress image.");
                    console.error(e);
                    return;
                }

                wasAdjusted = true;

                // imageCompression()은 목표 용량을 100% 보장하지 않는 best-effort API이므로,
                // 압축 결과를 다시 검증해야 한다. (dimension은 5번 단계의 실제 디코딩으로 재검증)
                if (!validateSize(adjustedFile.size, MAXIMUM_BYTES)) {
                    window.alert("Compression couldn't reduce the file size enough. Please choose a smaller image.");
                    return;
                }
            }

            // 5. 최종 파일을 실제로 디코딩해서 미리보기 URL과 "진짜" dimension을 얻는다.
            //    압축이 일어났다면 픽셀이 바뀌었으므로, 3번 단계의 dimension을 재사용하지 않고 다시 확인한다.
            let previewUrl: string;
            let finalDimension: ImageDimension;
            try {
                const decoded = await decodeImage(adjustedFile);
                previewUrl = decoded.url;
                finalDimension = decoded.dimension;
            } catch (e) {
                window.alert("Failed to load image.");
                console.error(e);
                return;
            }

            if (!validateImageDimension(finalDimension, MAXIMUM_DIMENSION)) {
                URL.revokeObjectURL(previewUrl);
                window.alert(
                    wasAdjusted
                        ? "Compression couldn't reduce the dimension enough. Please choose a smaller image."
                        : "Your image exceeds the dimension limit."
                );
                return;
            }

            // 6. 기존에 표시 중이던 미리보기 URL은 더 이상 필요 없으니 해제한다.
            if (file) {
                URL.revokeObjectURL(file.previewUrl);
            }

            onFileChange({
                originalFile: adjustedFile,
                originalName: extractFileName(adjustedFile.name),
                size: adjustedFile.size,
                dimension: finalDimension,
                previewUrl,
            });
        } finally {
            // 성공/실패/중간 거부 등 어떤 경로로 끝나든 로딩 상태는 항상 해제한다.
            setIsLoading(false);
        }
    }

    // 세 가지 상태(로딩 중 / 빈 상태 / 파일 선택됨)가 공유하는 바깥 박스 스타일
    const boxBaseClass = "bg-gray-200 w-[95%] h-20 box-border p-2 border border-green-900 border-dashed m-auto rounded-xl";

    function renderBox() {
        if (isLoading) {
            return (
                <div className={cn(boxBaseClass, "flex items-center justify-center")}>
                    <span>Uploading image...</span>
                </div>
            );
        }

        if (file === null) {
            return (
                <div className={cn(boxBaseClass, "flex flex-col items-center justify-center")}>
                    <div>
                        <button className="text-green-900 underline hover:cursor-pointer" onClick={handleClick}>
                            <span>Click</span>
                        </button>
                        {" "}to add image
                    </div>
                    <div className="text-sm text-gray-500 flex flex-col items-center justify-center">
                        <div>
                            {!AUTO_ADJUST && `${formatBytes(MAXIMUM_BYTES)}, ${MAXIMUM_WIDTH_OR_HEIGHT}x${MAXIMUM_WIDTH_OR_HEIGHT} px`}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className={cn(boxBaseClass, "flex justify-between")}>
                <div className="relative">
                    <img
                        src={file.previewUrl}
                        className="h-full aspect-square object-cover"
                    />
                    <button
                        onClick={handleDeleteButton}
                        className="absolute block rounded-full w-[1.5em] aspect-square bg-white hover:cursor-pointer z-10 -right-1 -top-1 hover:scale-110"
                    >
                        x
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div>{file.originalName}</div>
                    <div>{file.dimension.width} x {file.dimension.height} ({formatBytes(file.size)})</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {renderBox()}
            <input
                type="file"
                ref={inputRef}
                className="sr-only"
                accept={ALLOWED_TYPES.join(",")}
                onChange={(e) => handleFileUpload(e.target.files)}
            />
        </div>
    );
}
