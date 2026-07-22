"use client"
import {ReactNode, useState} from "react";
import {RadioGroup, RadioItem} from "@/components/common/input/radio";
import {ImageSelector, ImageSelectorPolicy, UploadImage} from "@/components/common/image-selector";
import {ColorPicker} from "@/components/common/color-picker";
import {TextInput} from "@/components/common/input/text-input";
import {HashTagInput} from "@/components/common/input/hash-tag";
import DatePicker from "@/components/common/input/date-input";
import {SingleCheckBox} from "@/components/common/input/checkbox";
import {cn, paginateList} from "@/lib/utils";
import {Font, FONTS} from "@/fonts/fonts";
import {Pagination} from "@/components/common/pagination";
import {Button} from "@/components/common/button";
import * as exifr from "exifr";

type DisplayStyleType = "REC_POLAROID" | "SQR_POLAROID" | "PHOTO"

export default function Home() {


    const [displayStyle, setDisplayStyle] = useState<string>("REC_POLAROID");
    const [image, setImage] = useState<UploadImage|null>(null);
    const [color, setColor] = useState<string>("#A6A59C1F");
    const [comment, setComment] = useState<string>("");
    const [hashTags, setHashTags] = useState<string[]>([]);
    const [date, setDate] = useState<string>("");
    const [useAutoConvert, setUseAutoConvert] = useState<boolean>(true);
    const [useAutoAdjust, setUseAutoAdjust] = useState<boolean>(true);
    const [font, setFont] = useState<Font|null>(null);
    const [fontSelectorPage, setFontSelectorPage] = useState<number>(1);

    const policy: ImageSelectorPolicy  = {
        maximumBytes: 500 * 1024,
        maximumWidthOrHeight: 1600,
        useAutoConvert,
        useAutoAdjust,
    }

    const PAGE_SIZE = 10;
    const pagedResult = paginateList({sourceList: FONTS, pageSize: PAGE_SIZE, page: fontSelectorPage});

    async function handleUseExifButtonClick () {
        if (!image) {
            return;
        }

        const date = image.originalDate;

        if (!date) {
            window.alert("No date info in exif");
            return;
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        setDate(`${year}-${month}-${day}`);
    }


    return (
            <div className="h-full flex flex-row">
                <section className="h-full flex-1 flex flex-col justify-between overflow-hidden">
                    <div
                        style={{backgroundColor: color}}
                        className="w-[33%] [aspect-ratio:1/1.6] [container-type:inline-size] [rotate:3deg] m-auto px-[0.5%] pt-[1.5%] pb-[0.5%] bg-blue-50 shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden">
                        {
                            image === null ? (
                                <div className="mb-[1%] block w-full aspect-[1/1.3] bg-gray-400"></div>

                            ) : (
                                <img
                                    src={image?.previewUrl}
                                    className="mb-[1%] block w-full aspect-[1/1.3] object-cover"
                                />
                            )
                        }
                        <div className="text-[7cqw] w-full">
                            <span className={font?.className}>
                                {comment}
                            </span>
                        </div>
                    </div>
                </section>

                {/*사진 편집 도구 사이드바*/}
                <aside className="w-[40%] h-full overflow-scroll box-borer p-3 pb-50 border border-gray-200 text-sm rounded-l-3xl">
                    <div className={"font-bold text-lg"}>Follow the instructions to style your photo</div>

                    <SideBarRow> Step 1. Choose the style of your image</SideBarRow>
                    <div className={"flex items-center justify-between pl-2 pr-2 box-border"}>
                        <RadioGroup name={"display-style"} value={displayStyle} onValueChange={setDisplayStyle}>
                            <RadioItem itemValue={"REC_POLAROID"}>Rectangular polaroid</RadioItem>
                            <RadioItem itemValue={"SQR_POLAROID"}>Square polaroid</RadioItem>
                            <RadioItem itemValue={"PHOTO"}>Photo</RadioItem>
                        </RadioGroup>
                    </div>

                    <SideBarRow>Step 2. Select your image</SideBarRow>
                    <div className="pb-2">
                        <div>
                            <SingleCheckBox value={useAutoConvert} onValueChange={setUseAutoConvert}>Auto convert .heic to.jpg</SingleCheckBox>
                        </div>
                        <div >
                            <SingleCheckBox value={useAutoAdjust} onValueChange={setUseAutoAdjust}>Adjust image size and dimension</SingleCheckBox>
                        </div>
                    </div>

                    <ImageSelector name={"image"} file={image} onFileChange={setImage} policy={policy} />

                    <SideBarRow>Step 3. Color your Polaroid</SideBarRow>
                    <ColorPicker value={color} onValueChange={setColor} name={"color"}/>

                    <SideBarRow>Step 4. Select a font</SideBarRow>
                    <div className="w-full rounded-xl box-border pt-3 pb-3 border border-green-900">
                        <Pagination
                            currentPage={fontSelectorPage}
                            onPageChange={setFontSelectorPage}
                            actualSize={pagedResult.actualSize}
                            totalPageCount={pagedResult.totalPageCount}
                            totalDataLength={pagedResult.totalDataLength}
                        >
                            {pagedResult.pagedList.map(x => (
                                <button
                                    key={x.id}
                                    className={cn("w-full box-border pl-2 pr-2 flex justify-between hover:bg-gray-100 hover:cursor-pointer",  font?.id === x.id && "bg-gray-200")}
                                    onClick={() => setFont(x)}
                                >
                                    <span>{x.label}</span>
                                    <span className={x.className}>AaBbCc1234</span>
                                </button>
                            ))}
                        </Pagination>
                    </div>

                    <SideBarRow>Step 5. Write a comment about your photo</SideBarRow>
                    <TextInput name={"comment"} value={comment} onValueChange={setComment} maxLength={50} placeholder={"type something up to 50 characters"} />

                    <SideBarRow>Step 6. Add additional information</SideBarRow>
                    <div className={"w-full box-border pr-2 pl-2"}>
                        <div>When was the photo taken? It will be marked on your calendar</div>
                        <DatePicker value={date} onValueChange={setDate}/>

                        {image && (<Button onClick={() => handleUseExifButtonClick()}>use exif data</Button>)}

                        <div>Add hashtags that can be used to search.</div>
                        <div>
                            <HashTagInput hashtags={hashTags} onChange={setHashTags} />
                        </div>

                    </div>
                </aside>
            </div>
        )
    }

    function SideBarRow ({children} : {children: ReactNode}) {
    return (
        <div className={"font-bold pb-2 pt-4"}>{children}</div>
        )
    }


