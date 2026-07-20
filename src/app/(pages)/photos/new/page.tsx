"use client"
import {ReactNode, useState} from "react";
import {RadioGroup, RadioItem} from "@/components/common/input/radio";
import {ImageSelector, UploadImage} from "@/components/common/image-selector";
import {ColorPicker} from "@/components/common/color-picker";
import {TextInput} from "@/components/common/input/text-input";
import {HashTagInput} from "@/components/common/input/hash-tag";
import DatePicker from "@/components/common/input/date-input";

type DisplayStyleType = "REC_POLAROID" | "SQR_POLAROID" | "PHOTO"

export default function Home() {

    const [displayStyle, setDisplayStyle] = useState<string>("REC_POLAROID");
    const [image, setImage] = useState<UploadImage|null>(null);
    const [color, setColor] = useState<string>("#A6A59C1F");
    const [comment, setComment] = useState<string>("");
    const [hashTags, setHashTags] = useState<string[]>([]);
    const [date, setDate] = useState<string>("2025-12-31");


        return (
            <div className="h-full flex flex-row">
                <section className="h-full flex-1 flex flex-col justify-between">
                    <div
                        className="w-[33%] [aspect-ratio:1/1.6] [container-type:inline-size] [rotate:3deg] m-auto px-[0.5%] pt-[1%] pb-[0.5%] bg-blue-50 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                        <img
                            src="/img_conver_test.jpg"
                            className="mb-[1%] block w-full aspect-[1/1.3] object-cover"
                        />

                        <div className="text-[7cqw]">
                        <span>
                            2026.11.14
                            <br/>
                            Napolitan spaghetti in Osaka!
                        </span>
                        </div>
                    </div>
                </section>

                {/*사진 편집 도구 사이드바*/}
                <aside className="w-[35%] h-full box-borer p-3 border border-gray-200 text-sm rounded-l-3xl">
                    <div className={"font-bold text-lg"}>Follow the instructions to style your photo</div>

                    <SideBarRow> Step 1. Choose the style of your image</SideBarRow>
                    <div>
                        <RadioGroup name={"display-style"} value={displayStyle} onValueChange={setDisplayStyle}>
                            <RadioItem itemValue={"REC_POLAROID"}>Rectangular polaroid</RadioItem>
                            <RadioItem itemValue={"SQR_POLAROID"}>Square polaroid</RadioItem>
                            <RadioItem itemValue={"PHOTO"}>Photo</RadioItem>
                        </RadioGroup>
                    </div>

                    <SideBarRow>Step 2. Select your image</SideBarRow>
                    <ImageSelector name={"image"} file={image} onFileChange={setImage} />

                    <SideBarRow>Step 3. Color your Polaroid</SideBarRow>
                    <ColorPicker value={color} onValueChange={setColor} name={"color"}/>

                    <SideBarRow>Step 4. Write a comment about your photo</SideBarRow>
                    <TextInput name={"comment"} value={comment} onValueChange={setComment} maxLength={50} placeholder={"type something up to 50 characters"} />

                    <SideBarRow>Step 5. Add additional information</SideBarRow>
                    <div>meta data will not appear onscreen but used to search and filter.</div>

                    <HashTagInput hashtags={hashTags} onChange={setHashTags} />

                    <DatePicker value={date} onValueChange={setDate}/>

                </aside>
            </div>
        )
    }

    function SideBarRow ({children} : {children: ReactNode}) {
    return (
        <div className={"font-bold pb-2 pt-4"}>{children}</div>
        )
    }
