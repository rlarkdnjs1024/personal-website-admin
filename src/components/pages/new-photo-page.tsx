"use client"
import {ImageSelector, ImageSelectorPolicy, SelectedImage} from "@/components/ui/image-selector";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {supabaseBrowserClient} from "@/lib/supabase.browser";
import {Datetime, Location} from "@/types";
import {LocationPicker} from "@/components/ui/location-picker";
import {SelectBox, SelectOption} from "@/components/ui/select-box";
import {countryCodeToFlag} from "@/lib/utils";
import {SearchInput} from "@/components/ui/search-input";
import DatePicker from "@/components/ui/date-input";
import {DatetimeInput} from "@/components/ui/datetime-input";
import {HashTagInput} from "@/components/ui/hash-tag";


type NewPhotoPageProps = {
    countryList: {
        name: string,
        code: string,
    }[]
}

export function NewPhotoPage({countryList}: NewPhotoPageProps) {
    const [image, setImage] = useState<SelectedImage|null>(null);
    const [country, setCountry] = useState<{code: string, name: string}|null>(null);
    const [cityName, setCityName] = useState<string>("");
    const [location, setLocation] = useState<Location|null>(null);
    const [takenAt, setTakenAt] = useState<Datetime|null>(null);
    const [hashTags , setHashTags] = useState<string[]>([]);

    console.log(image)

    const policy: ImageSelectorPolicy  = {
        maximumBytes: 500 * 1024,
        maximumWidthOrHeight: 1600,
    }

    async function handleSubmit() {

        debugger
        const dto = toDto();

        if (!dto.ok) {
            window.alert(dto.error);
            return;
        }

        const url = new URL("/api/admin/photos/uploadUrl", window.location.origin);
        url.searchParams.set("takenAt", dto.data!.takenAt);

        //서버에서 사진 업로드용 signed url을 받아온다.

        let result;
        try {
            result = await fetch(url);

        } catch (e) {
            console.error(e)
            window.alert("Network Error");
            return;
        }

        let uploadUrl
        try {
            uploadUrl = await result.json();

            if (!result.ok) {
                window.alert(uploadUrl.message);
                return;
            }
        } catch (e) {
            console.error(e);
            window.alert("Internal server error");
            return;
        }

        try {
            const {error} = await supabaseBrowserClient
                .storage
                .from("images")
                .uploadToSignedUrl(uploadUrl.path, uploadUrl.token, image!.uploadFile);

            if (error) {
                window.alert("Internal server error");
                return;
            }

        } catch (e) {
            console.error(e);
            window.alert("Network error");
            return;
        }

        //metadata 업로드 api
        try {
            const result = await fetch("/api/admin/photos", {
                method: "POST",
                body: JSON.stringify({...dto.data, storagePath: uploadUrl.path})
            });

            if (!result.ok) {
                window.alert(uploadUrl.message);
                return;
            }
            window.location.href = "/admin"

        } catch (e) {
            console.error(e);
            window.alert("Network error");
            return;
        }


    }

    function toDto() {

        if (!image) return {ok: false, error: "image not found"};

        const scheme = z.object({
            mimeType: z.string(),
            fileSizeBytes: z.number().int("fileSizeBytes must be an integer").positive("fileSizeBytes must be a positive number"),
            width: z.number().int("width must be an integer").positive("width must be a positive number"),
            height: z.number().int("height must be an integer").positive("height must be a positive number"),
            takenAt: z.iso.date("takenAt must be a valid date in YYYY-MM-DD format"),
            countryName: z.string().max(50, "countryName must be at most 50 characters"),
            cityName: z.string().max(50, "cityName must be at most 50 characters"),
            latitude: z.number().min(-90, "latitude must be at least -90").max(90, "latitude must be at most 90"),
            longitude: z.number().min(-180, "longitude must be at least -180").max(180, "longitude must be at most 180"),
        });

        const parseResult = scheme.safeParse({
            mimeType: image.uploadMimeType,
            fileSizeBytes: image.uploadSize,
            width: image.uploadDimension.width,
            height: image.uploadDimension.height,
            takenAt: image.takenAt,
            countryName: country?.name,
            cityName: cityName,
            latitude: image.originalLocation?.lat,
            longitude: image.originalLocation?.lng,
        });

        if (parseResult.success) {
            return {ok: true, error: null, data: parseResult.data};
        }

        return {ok: false, error: parseResult.error.issues[0].message}
    }

    async function searchCityName(keyword: string) {
        const url = new URL("/api/admin/cities", window.location.origin);
        url.searchParams.set("search", keyword.trim().toLowerCase());
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to search cities: ${response.status}`);
        }

        const json = await response.json();
        return json.data as string[];
    }

    function handleImageChange(image: SelectedImage|null) {
        setImage(image);
        //이미지가 존재하고 EXIF data에 찍힌 날짜가 존재하면 taken at 객체를 조정한다.
        const date = image?.takenAt;

        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hour = String(date.getHours()).padStart(2, "0");
            const minute = String(date.getMinutes()).padStart(2, "0");
            const second = String(date.getSeconds()).padStart(2, "0");
            setTakenAt({date: `${year}-${month}-${day}`, time: `${hour}:${minute}:${second}`});
        }
    }


    return (
        <div className={"h-full w-full flex"}>
            <div className="flex-1 flex flex-col justify-center">
                {image && (
                    <div className={"w-[50%] m-auto box-border p-2 shadow"}>
                        <img src={image.previewUrl} alt={"preview image"} />
                        {location && country && cityName && (
                            <div>
                                {country.name}, {cityName}, {location.placeName ?? location.address}
                            </div>
                        )}
                        {takenAt && (
                            <div>{takenAt.date} {takenAt.time}</div>
                        )}
                        <div>
                        </div>
                    </div>
                )}
            </div>
            <aside className="w-[40%] h-full overflow-y-scroll box-borer p-3 pb-50 border border-gray-200 text-sm rounded-l-3xl">
                <div>
                    <div className={"font-bold"}>Image</div>
                    <ImageSelector name={"image"} file={image} onFileChange={handleImageChange} policy={policy}/>
                </div>


                <div>
                    <div className="font-bold">Country</div>

                    <SelectBox
                        value={country}
                        onValueChange={setCountry}
                        placeholder={"Select a country"}
                    >
                        {countryList
                            .map(x =>
                                <SelectOption key={x.code} optionValue={x} label={`${countryCodeToFlag(x.code)} ${x.name}`}/>
                            )
                        }

                    </SelectBox>

                </div>

                <div className="border-b-gray-300 border-b-1 focus-within:border-b-[#4a6248d4]">
                    <div className={"font-bold"}>City Name</div>
                    <SearchInput
                        name="city-name"
                        value={cityName}
                        onValueChange={setCityName}
                        getSuggestions={searchCityName}
                        placeholder={"Type to search existing city or add yourself"}
                    />
                </div>

                <div className="border-b-gray-300 border-b-1 focus-within:border-b-[#4a6248d4]">
                    <div className={"font-bold"}>Location</div>
                    <div className={"w-full aspect-square"}>
                        <LocationPicker location={location} setLocation={setLocation}/>
                    </div>
                </div>

                <div >
                    <div className={"font-bold"}>Date and Time</div>

                        <DatetimeInput name={"taken-at"} value={takenAt} onValueChange={setTakenAt}/>

                </div>
                <div >
                    <div className={"font-bold"}>Comments</div>
                    <textarea
                        className="
                        w-full h-32
                        resize-none
                        rounded-lg
                        border border-gray-200
                        bg-white
                        px-3 py-2.5
                        text-sm text-gray-700
                        placeholder:text-gray-400
                        outline-none
                        focus:border-[#4a6248d4]"
                        placeholder="Write a comment about your photo."
                    />
                </div>

                <div>
                    <div className={"font-bold"}>Hashtags</div>
                    <HashTagInput hashtags={hashTags} onChange={setHashTags}/>
                </div>


                <Button onClick={handleSubmit}>submit</Button>
            </aside>


        </div>

    )
}





