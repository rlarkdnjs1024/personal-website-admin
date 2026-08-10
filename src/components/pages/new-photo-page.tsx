"use client"
import {ImageSelector, ImageSelectorPolicy, SelectedImage} from "@/components/ui/image-selector";
import {useEffect, useState} from "react";
import {TextInput} from "@/components/ui/text-input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {supabaseBrowserClient} from "@/lib/supabase.browser";
import {Location} from "@/types";
import {LocationPicker} from "@/components/ui/location-picker";
import {SelectBox, SelectOption} from "@/components/ui/select-box";
import {countryCodeToFlag} from "@/lib/utils";


type NewPhotoPageProps = {
    countryList: {
        name: string,
        code: string,
    }[]
}
export function NewPhotoPage({countryList}: NewPhotoPageProps) {
    const [image, setImage] = useState<SelectedImage|null>(null);
    const [countryName, setCountryName] = useState<string|null>(null);
    const [cityName, setCityName] = useState<string>("");
    const [location, setLocation] = useState<Location|null>(null);
    const [takenAt, setTakenAt] = useState<string | null>(null);
    const [hashTags , setHashTags] = useState<string[]>([]);

    console.log(image);
    console.log(location)

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
            countryName: countryName,
            cityName: cityName,
            latitude: image.originalLocation?.lat,
            longitude: image.originalLocation?.lng,
        });

        if (parseResult.success) {
            return {ok: true, error: null, data: parseResult.data};
        }

        return {ok: false, error: parseResult.error.issues[0].message}
    }

    return (
        <div className={"h-full w-full flex"}>
            <div className="flex-1 flex flex-col justify-center">
                {image && (
                    <div className={"w-[50%] m-auto box-border p-2 shadow"}>
                        <img src={image.previewUrl} alt={"preview image"} />
                        {location && countryName && cityName && (
                            <div>
                                {countryName}, {cityName}, {location.placeName ?? location.address}
                            </div>
                        )}
                        {takenAt && (
                            <div>{takenAt}</div>
                        )}
                        <div>
                        </div>
                    </div>
                )}
            </div>
            <aside className="w-[40%] h-full overflow-y-scroll box-borer p-3 pb-50 border border-gray-200 text-sm rounded-l-3xl">
                <div>
                    <div className={"font-bold"}>Image</div>
                    <ImageSelector name={"image"} file={image} onFileChange={setImage} policy={policy}/>
                </div>


                <div>
                    <div className="font-bold">Country</div>

                    <SelectBox
                        value={countryName}
                        onValueChange={setCountryName}
                        placeholder={"Select a country"}
                    >
                        {countryList.map(x => <SelectOption key={x.code} optionValue={x.code} label={`${countryCodeToFlag(x.code)} ${x.name}`}/>)}

                    </SelectBox>

                </div>

                <div className="border-b-gray-300 border-b-1 focus-within:border-b-[#4a6248d4]">
                    <div className={"font-bold"}>City Name</div>
                    <TextInput
                        name={"city-name"}
                        value={cityName}
                        onValueChange={setCityName}
                        placeholder={"Type to search existing city or add yourself"}
                    />
                </div>

                <div className="border-b-gray-300 border-b-1 focus-within:border-b-[#4a6248d4]">
                    <div className={"font-bold"}>Location</div>
                    <div className={"w-full aspect-square"}>
                        <LocationPicker location={location} setLocation={setLocation}/>
                    </div>

                </div>

                <Button onClick={handleSubmit}>submit</Button>
            </aside>


        </div>

    )
}





