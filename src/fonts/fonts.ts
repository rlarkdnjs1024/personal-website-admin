import localFont from "next/font/local";



export const ribeye = localFont({
    src: "./Ribeye-Regular.ttf",
    display: "swap",
});

export const questrial = localFont({
    src: "./Questrial-Regular.ttf",
    display: "swap",
});

export const playwriteIS100 = localFont({
    src: "./PlaywriteIS-Thin.ttf",
    display: "swap",
});

export const playwriteIS200 = localFont({
    src: "./PlaywriteIS-ExtraLight.ttf",
    display: "swap",
});

export const playwriteIS300 = localFont({
    src: "./PlaywriteIS-Light.ttf",
    display: "swap",
});

export const playwriteIS400 = localFont({
    src: "./PlaywriteIS-Regular.ttf",
    display: "swap",
});

export const kalam300 = localFont({
    src: "./Kalam-Light.ttf",
    display: "swap",
});

export const kalam400 = localFont({
    src: "./Kalam-Regular.ttf",
    display: "swap",
});

export const kalam700 = localFont({
    src: "./Kalam-Bold.ttf",
    display: "swap",
});

export const spaceMono400 = localFont({
    src: "./SpaceMono-Regular.ttf",
    display: "swap",
});

export const spaceMono400Italic = localFont({
    src: "./SpaceMono-Italic.ttf",
    display: "swap",
});

export const spaceMono700 = localFont({
    src: "./SpaceMono-Bold.ttf",
    display: "swap",
});

export const spaceMono700Italic = localFont({
    src: "./SpaceMono-BoldItalic.ttf",
    display: "swap",
});

export const courierPrime400 = localFont({
    src: "./CourierPrime-Regular.ttf",
    display: "swap",
});

export const courierPrime400Italic = localFont({
    src: "./CourierPrime-Italic.ttf",
    display: "swap",
});

export const courierPrime700 = localFont({
    src: "./CourierPrime-Bold.ttf",
    display: "swap",
});

export const courierPrime700Italic = localFont({
    src: "./CourierPrime-BoldItalic.ttf",
    display: "swap",
});

// font-style/font-weight CSS 속성으로 italic, bold를 전환할 수 있도록 4개 파일을 하나의 폰트 패밀리로 묶은 버전
export const courierPrime = localFont({
    src: [
        {path: "./CourierPrime-Regular.ttf", weight: "400", style: "normal"},
        {path: "./CourierPrime-Italic.ttf", weight: "400", style: "italic"},
        {path: "./CourierPrime-Bold.ttf", weight: "700", style: "normal"},
        {path: "./CourierPrime-BoldItalic.ttf", weight: "700", style: "italic"},
    ],
    display: "swap",
});

export type Font = {
    id: string,
    label: string,
    language: string,
    className: string,
}


export const FONTS: Font[] = [
    {
        id: "RIBEYE",
        label: "ribeye",
        language: "english",
        className: ribeye.className,
    },
    {
        id: "QUESTRIAL",
        label: "questrial",
        language: "english",
        className: questrial.className,
    },
    {
        id: "PLAYWRITE_IS_100",
        label: "playwrite-is-100",
        language: "english",
        className: playwriteIS100.className,
    },
    {
        id: "PLAYWRITE_IS_200",
        label: "playwrite-is-200",
        language: "english",
        className: playwriteIS200.className,
    },
    {
        id: "PLAYWRITE_IS_300",
        label: "playwrite-is-300",
        language: "english",
        className: playwriteIS300.className,
    },
    {
        id: "PLAYWRITE_IS_400",
        label: "playwrite-is-400",
        language: "english",
        className: playwriteIS400.className,
    },
    {
        id: "KALAM_300",
        label: "kalam-300",
        language: "english",
        className: kalam300.className,
    },
    {
        id: "KALAM_400",
        label: "kalam-400",
        language: "english",
        className: kalam400.className,
    },
    {
        id: "KALAM_700",
        label: "kalam-700",
        language: "english",
        className: kalam700.className,
    },
    {
        id: "SPACE_MONO_400",
        label: "space-mono-400",
        language: "english",
        className: spaceMono400.className,
    },
    {
        id: "SPACE_MONO_400_ITALIC",
        label: "space-mono-400-italic",
        language: "english",
        className: spaceMono400Italic.className,
    },
    {
        id: "SPACE_MONO_700",
        label: "space-mono-700",
        language: "english",
        className: spaceMono700.className,
    },
    {
        id: "SPACE_MONO_700_ITALIC",
        label: "space-mono-700-italic",
        language: "english",
        className: spaceMono700Italic.className,
    },
    {
        id: "COURIER_PRIME_400",
        label: "courier-prime-400",
        language: "english",
        className: courierPrime400.className,
    },
    {
        id: "COURIER_PRIME_400_ITALIC",
        label: "courier-prime-400-italic",
        language: "english",
        className: courierPrime400Italic.className,
    },
    {
        id: "COURIER_PRIME_700",
        label: "courier-prime-700",
        language: "english",
        className: courierPrime700.className,
    },
    {
        id: "COURIER_PRIME_700_ITALIC",
        label: "courier-prime-700-italic",
        language: "english",
        className: courierPrime700Italic.className,
    },
]
