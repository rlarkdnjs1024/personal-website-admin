import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {lastIndexOf} from "eslint-config-next";
import {heicTo, isHeic} from "heic-to";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


/** 배열을 페이지 단위로 잘라내는 함수의 입력 */
type paginateListInput<T> = {
    /** 페이징할 원본 배열 */
    sourceList: T[],
    /** 한 페이지에 담을 개수 (요청 사이즈) */
    pageSize: number,
    /** 조회할 페이지 번호 (1부터 시작) */
    page: number
}


/** 배열을 페이지 단위로 잘라내는 함수의 출력 */
type paginateListOutput<T> = {
    /** 페이징된 배열 */
    pagedList: T[],
    /** 요청받은 페이지 번호 */
    requestedPage: number,
    /** 요청받은 페이지 크기 */
    requestedSize: number
    /** 실제 반환된 배열 길이 (데이터 부족 시 requestedSize보다 작을 수 있음) */
    actualSize: number,
    /** 전체 데이터를 담으려면 몇 페이지가 필요한지 */
    totalPageCount: number,
    /** 전체 데이터 행의 길이 */
    totalDataLength: number,
}

/**
 * 배열을 요청된 페이지·크기에 맞춰 잘라 반환한다.
 * @param input.sourceList 페이징할 원본 배열
 * @param input.pageSize 한 페이지에 담을 개수
 * @param input.page 조회할 페이지 번호 (1부터 시작)
 * @returns 요청된 페이지에 해당하는 부분 배열. 전체 페이지 수를 초과하면 빈 배열.
 */
export function paginateList<T> (input: paginateListInput<T>): paginateListOutput<T> {
    const { sourceList, pageSize: requestedSize, page: requestedPage } = input;

    const totalDataLength = sourceList.length;
    const totalPageCount = Math.ceil(totalDataLength / requestedSize);

    const pagedList = sourceList.slice(requestedSize * (requestedPage-1), requestedSize * requestedPage);

    return {
        pagedList: pagedList,
        requestedPage: requestedPage,
        requestedSize: requestedSize,
        actualSize: pagedList.length,
        totalPageCount: totalPageCount,
        totalDataLength: totalDataLength,
    }
}

export function validateFileType (fileType: string, acceptedFileTypes: string[]) {
    return acceptedFileTypes.includes(fileType);
}

type ImageDimension = {
    width: number,
    height: number
}

export function validateImageDimension (dimension: ImageDimension, maximumDimension: ImageDimension) {
    return dimension.width <= maximumDimension.width && dimension.height <= maximumDimension.height;
}

export function validateSize (size: number, maximumSize: number) {
    return size <= maximumSize;
}

const BYTE_UNITS = ["B", "KiB", "MiB", "GiB", "TiB"];

/** 바이트를 KiB/MiB/GiB 등 1024 단위(binary prefix)로 환산해 읽기 좋은 문자열로 반환한다. */
export function formatBytes (bytes: number, fractionDigits = 2) {
    if (bytes < 0) {
        throw new Error("bytes must be a non-negative number.");
    }

    if (bytes === 0) {
        return "0 B";
    }

    const exponent = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        BYTE_UNITS.length - 1
    );

    const value = bytes / Math.pow(1024, exponent);

    //소수점 부분이 0이면(예: 500.00, 1.50 -> 1.5) 불필요한 0을 제거한다.
    const formattedValue = parseFloat(value.toFixed(fractionDigits));

    return `${formattedValue} ${BYTE_UNITS[exponent]}`;
}

//File 객체의 이름에서 확장자를 제외한 이름을 추출한다.
export function extractFileName (originalName: string) {
    const lastIndex = originalName.lastIndexOf(".");
    return lastIndex > -1 ? originalName.slice(0, lastIndex) : originalName;
}

export async function convertHeicToJpeg (file: File) {
    const isFileHeic = await isHeic(file);

    //isHeic()은 파일의 확장자나 MIME 타입을 넘어 파일 내용을 확인하여 heic인지 검사한다.
    if (!isFileHeic) {
        return file;
    }
    const heic = await heicTo({blob: file, type: "image/jpeg", quality: 0.85});

    return new File([heic], extractFileName(file.name), {type: "image/jpeg"});
}
