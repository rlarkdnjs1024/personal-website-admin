import {
    cn,
    formatBytes,
    validateImageDimension,
    validateSize
} from "@/lib/utils";
import React, {useRef, useState} from "react";
import imageCompression from "browser-image-compression";
import * as exif from "exifr"
import {LatLngLiteral} from "@/types";
import {convertHeicToJpg, getImageType} from "@/lib/file";
import {useAddress} from "@/hooks/useAddress";
import DatePicker from "@/components/ui/date-input";


type ImageSelectorProps = {
    name: string;
    policy: ImageSelectorPolicy,
}

/** 업로드가 확정된 이미지 상태. 실제 전송에 쓰이는 File과 화면 표시용 메타데이터를 함께 담는다. */
export type SelectedImage = {
    uploadFile: File,
    originalName: string,
    uploadSize: number,
    uploadDimension: ImageDimension,

    //EXIF 데이터를 가져오지만 없을 수도 있다.
    originalLocation?: LatLngLiteral,
    takenAt?: string,

    //지도에서 나라와 도시로 marker clustering을 하기 위해 필요한 값들.
    countryName?: string,
    cityName?: string,

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

function formatDate(date: Date) {
    console.log(date.toISOString());
    const fullYear = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return `${fullYear}-${month}-${day}`;
}

export function ImageSelector({name, policy}: ImageSelectorProps) {

    const [file, setFile] = useState<SelectedImage|null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const {address, isLoading: isAddressLoading} = useAddress(file?.originalLocation ?? null);

    // 변환/압축/디코딩이 진행되는 동안 중복 선택을 막고 상태를 보여주기 위한 플래그
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const MAXIMUM_BYTES = policy.maximumBytes;
    const MAXIMUM_WIDTH_OR_HEIGHT = policy.maximumWidthOrHeight;

    // width/height 각각에 동일한 한도를 적용한다 (browser-image-compression의 maxWidthOrHeight와 같은 의미)
    const MAXIMUM_DIMENSION: ImageDimension = {
        width: MAXIMUM_WIDTH_OR_HEIGHT,
        height: MAXIMUM_WIDTH_OR_HEIGHT,
    };

    // <input accept="">는 MIME과 확장자를 함께 넣어야 브라우저별 파일 선택창 필터링이 안정적으로 동작한다.
    const ALLOWED_TYPES = ["image/jpeg", ".jpg", ".jpeg", "image/heic", ".heic"];

    function handleClick() {
        inputRef.current?.click();
    }

    function handleDeleteButton() {
        if (file) {
            URL.revokeObjectURL(file.previewUrl);
            setFile(null);
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
            //0. 변환 과정 전에 필요한 EXIF 정보들을 파싱한다.
            let originalLocation, originalDate;
            try {
                const exifData = await exif.parse(inputFile);

                if (exifData?.latitude !== undefined && exifData?.longitude !== undefined) {
                    originalLocation = {
                        lat: exifData.latitude as number,
                        lng: exifData.longitude as number,
                    }
                }
                originalDate = exifData?.DateTimeOriginal as Date;
            } catch (e) {
                console.error("Failed to parse exif");
                console.error(e);
            }


            //.heic, .jpg 이미지를 webp로 변환한다.
            const fileType = await getImageType(inputFile);
            const mimeType = fileType?.mime

            //파일이 손상되어 type을 가져올 수 없는 경우
            if (!mimeType) {
                window.alert("Invalid file type.");
                return;
            }

            let jpg = inputFile;

            //heic은 jpeg로 먼저 변환한다.
            if (mimeType === "image/heic") {
                jpg = await convertHeicToJpg(inputFile);
            }

            //jpg를 webp로 변환하며 policy에 맞게 resizing 및 compressing을 진행한다.
            let adjustedWebp;
            try {
                adjustedWebp = await imageCompression(jpg, {
                    fileType: "image/webp",
                    maxSizeMB: MAXIMUM_BYTES / BYTES_PER_MB,
                    maxWidthOrHeight: MAXIMUM_WIDTH_OR_HEIGHT,
                    useWebWorker: true,
                });
            } catch (e) {
                window.alert("Failed to compress image.");
                console.error(e);
                return;
            }

            // imageCompression()은 목표 용량을 100% 보장하지 않는 best-effort API이므로,
            // 압축 결과를 다시 검증해야 한다. (dimension은 5번 단계의 실제 디코딩으로 재검증)
            if (!validateSize(adjustedWebp.size, MAXIMUM_BYTES)) {
                window.alert("Compression couldn't reduce the file size enough. Please choose a smaller image.");
                return;
            }


            //    최종 파일을 실제로 디코딩해서 미리보기 URL과 "진짜" dimension을 얻는다.
            let previewUrl: string;
            let finalDimension: ImageDimension;
            try {
                const decoded = await decodeImage(adjustedWebp);
                previewUrl = decoded.url;
                finalDimension = decoded.dimension;
            } catch (e) {
                window.alert("Failed to load image.");
                console.error(e);
                return;
            }

            if (!validateImageDimension(finalDimension, MAXIMUM_DIMENSION)) {
                URL.revokeObjectURL(previewUrl);
                window.alert("Compression couldn't reduce the dimension enough. Please choose a smaller image.");
                return;
            }

            // 6. 기존에 표시 중이던 미리보기 URL은 더 이상 필요 없으니 해제한다.
            if (file) {
                URL.revokeObjectURL(file.previewUrl);
            }

            setFile({
                uploadFile: adjustedWebp,
                originalName: inputFile.name,
                originalLocation: originalLocation,
                takenAt: originalDate && formatDate(originalDate),
                uploadSize: adjustedWebp.size,
                uploadDimension: finalDimension,
                previewUrl,
            });
        } finally {
            // 성공/실패/중간 거부 등 어떤 경로로 끝나든 로딩 상태는 항상 해제한다.
            setIsLoading(false);
        }
    }

    // 세 가지 상태(로딩 중 / 빈 상태 / 파일 선택됨)가 공유하는 바깥 박스 스타일
    const boxBaseClass = "bg-gray-200 w-full h-50 box-border p-2 border border-green-900 border-dashed m-auto rounded-xl";

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


                <div className="w-[50%]">
                    <div>
                        <div className={"font-bold"}>Where was the photo taken?</div>
                        <div>{address ?? "No EXIF location found. Click to add yourself"}</div>
                    </div>
                    <div>
                        <div className={"font-bold"}>When was the photo taken?</div>
                        <div>
                            <DatePicker value={file.takenAt ?? ""} onValueChange={(value) => setFile({...file, takenAt: value})}/>
                        </div>
                    </div>
                    <div className="border-b-gray-300 border-b-1 focus-within:border-b-[#4a6248d4]">
                        <div className={"font-bold"}>Country Name</div>
                        <input
                            type="text"
                            name="country-name"
                            value={file.countryName ?? ""}
                            maxLength={30}
                            onChange={(e) => setFile({...file, countryName: e.target.value})}
                            className="w-[90%] focus:outline-none mb-1"
                        />
                    </div>
                    <div className="border-b-gray-300 border-b-1 focus-within:border-b-[#4a6248d4]">
                        <div className={"font-bold"}>City Name</div>
                        <input
                            type="text"
                            name="city-name"
                            value={file.cityName ?? ""}
                            maxLength={30}
                            onChange={(e) => setFile({...file, cityName: e.target.value})}
                            className="w-[90%] focus:outline-none mb-1"
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-end">
                    <div className="w-full text-center">
                        <button
                            type="button"
                            className="bg-[#4a6248d4] p-2 rounded-md shadow hover:cursor-pointer text-white"
                        >Add Image
                        </button>
                    </div>
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
