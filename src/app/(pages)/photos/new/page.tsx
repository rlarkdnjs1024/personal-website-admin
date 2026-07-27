"use client"
import {ReactNode, useState} from "react";
import {RadioGroup, RadioItem} from "@/components/common/input/radio";
import {ImageSelector, ImageSelectorPolicy, UploadImage} from "@/components/common/image-selector";
import {ColorPicker} from "@/components/pages/color-picker";
import {TextInput} from "@/components/common/input/text-input";
import {HashTagInput} from "@/components/common/input/hash-tag";
import DatePicker from "@/components/common/input/date-input";
import {SingleCheckBox} from "@/components/common/input/checkbox";
import {cn, paginateList} from "@/lib/utils";
import {Font, FONTS} from "@/fonts/fonts";
import {Pagination} from "@/components/common/pagination";
import {Button} from "@/components/common/button";
import {MapMouseEvent} from "@vis.gl/react-google-maps";
import {Map} from '@/components/common/google-map'
import {DefaultGeoLocation, LatLngLiteral} from "@/types";
import {Marker} from "@/components/common/google-map";
import {useAddress} from "@/hooks/useAddress";

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
    const [location, setLocation] = useState<LatLngLiteral>(DefaultGeoLocation);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState<boolean>(false);
    const {address, isLoading} = useAddress(location);

    const policy: ImageSelectorPolicy  = {
        maximumBytes: 500 * 1024,
        maximumWidthOrHeight: 1600,
        useAutoConvert,
        useAutoAdjust,
    }

    const PAGE_SIZE = 10;
    const pagedResult = paginateList({sourceList: FONTS, pageSize: PAGE_SIZE, page: fontSelectorPage});

    function handleImageChange(image: UploadImage|null) {
        setImage(image);

        if (image !== null && image.originalLocation !== undefined) {
            setLocation({
                lat: image.originalLocation.lat,
                lng: image.originalLocation.lng,
            });
        }
    }

    function handleMapClick (event: MapMouseEvent) {
        const clickedPosition = event.detail.latLng;
        if (!clickedPosition) return;
        setLocation({...clickedPosition});
    }

    async function handleUseExifButtonClick () {
        if (!image) {
            return;
        }

        const date = image.originalDate as Date;

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

                    <SideBarRow title={"Step 1. Choose the style of your image"}>
                        <RadioGroup
                            name={"display-style"}
                            value={displayStyle}
                            onValueChange={setDisplayStyle}
                            className="flex justify-between"
                        >
                            <RadioItem itemValue={"REC_POLAROID"}>Rectangular polaroid</RadioItem>
                            <RadioItem itemValue={"SQR_POLAROID"}>Square polaroid</RadioItem>
                            <RadioItem itemValue={"PHOTO"}>Photo</RadioItem>
                        </RadioGroup>
                    </SideBarRow>


                    <SideBarRow title={"Step 2. Select your image"}>
                        <div className="pb-2">
                            <SingleCheckBox value={useAutoConvert} onValueChange={setUseAutoConvert}>Auto convert .heic to.jpg</SingleCheckBox>
                            <SingleCheckBox value={useAutoAdjust} onValueChange={setUseAutoAdjust}>Adjust image size and dimension</SingleCheckBox>
                        </div>
                        <ImageSelector name={"image"} file={image} onFileChange={handleImageChange} policy={policy} />
                    </SideBarRow>

                    <SideBarRow
                        title={"Step 3. Where was the photo taken?"}
                        description={"*If you add a location, you will be able to find it in your map."}
                        className="relative"
                    >
                        <span>{"Location: "}</span>
                        <button
                            type="button"
                            onClick={() => setIsLocationPickerOpen(!isLocationPickerOpen)}
                        >
                            <span className="underline">{address ? address : isLoading ? "Loading address..." : "Address unavailable. Click to open map."}</span>
                        </button>

                        {isLocationPickerOpen && (
                            <div className="w-full box-border rounded-xl border border-gray-200 bg-white p-3 shadow-xl absolute z-50">
                                <div className="mb-2 flex justify-end">
                                    <button
                                        onClick={() => setIsLocationPickerOpen(false)}
                                        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <Map
                                    disableDefaultUI
                                    mapId="personal-website"
                                    className="w-full aspect-square m-auto"
                                    focusLocation={location}
                                    defaultZoom={10}
                                    defaultCenter={location}
                                    onClick={handleMapClick}
                                >
                                    <Marker
                                        location={location}
                                    />
                                </Map>
                            </div>
                        )}

                    </SideBarRow>

                    <SideBarRow
                        title={"Step 4. When was the photo taken?"}
                        description={"*The photo will be marked on your calendar"}
                    >
                        <div className={"flex justify-between"}>
                            <DatePicker value={date} onValueChange={setDate}/>
                            {image?.originalDate && (<Button onClick={() => handleUseExifButtonClick()}>use exif data</Button>)}
                        </div>

                    </SideBarRow>

                    <SideBarRow
                        title={"Step 5. Color your Polaroid"}
                    >
                        {/*/!*TODO: color picker 재사용 가능하게 분리*!/*/}
                        <ColorPicker value={color} onValueChange={setColor} name={"color"}/>
                    </SideBarRow>

                    <SideBarRow title="Step 6. Write a comment about your photo">
                        <TextInput name={"comment"} value={comment} onValueChange={setComment} maxLength={50} placeholder={"type something up to 50 characters"} />
                    </SideBarRow>

                    <SideBarRow
                        title={"Step 7. Select a font of your choice"}
                    >
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
                    </SideBarRow>

                    <SideBarRow
                        title={"Step 8. Add hashtags"}
                        description={"*You can search your photos with the attatched hashtags"}
                    >
                        {/*TODO: 빈 영역 클릭시 input에 focus되게 코드 추가하기*/}
                        <HashTagInput hashtags={hashTags} onChange={setHashTags} />
                    </SideBarRow>
                </aside>
            </div>
        )
    }

    function SideBarRow ({title, description, className, children} : {title: string, description?: string, className?: string, children: ReactNode}) {
    return (
        <div className={cn("w-full box-border pl-2 pr-2 mt-4", className)}>
            <div className={"pb-2"}>
                <div className="font-bold">{title}</div>
                {description && (<div className="text-[#4a6248d4]">{description}</div>)}
            </div>
            {children}
        </div>

        )
    }


