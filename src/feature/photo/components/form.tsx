"use client"
import {ImageSelector, ImageSelectorPolicy, SelectedImage} from "@/components/ui/image-selector";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {supabaseBrowserClient} from "@/lib/supabase.browser";
import {LocationPicker} from "@/components/ui/location-picker";
import {SelectBox, SelectOption} from "@/components/ui/select-box";
import {countryCodeToFlag} from "@/lib/utils";
import {SearchInput} from "@/components/ui/search-input";
import {DatetimeInput} from "@/components/ui/datetime-input";
import {HashTagInput} from "@/components/ui/hash-tag";
import {Country, Location} from "@/feature/photo/type";
import {PreviewPhotoCard} from "@/feature/photo/components/preview-photo-card";


type NewPhotoPageProps = {
    countryList: {
        name: string,
        code: string,
    }[]
}

export function Form({countryList}: NewPhotoPageProps) {
    const [image, setImage] = useState<SelectedImage|null>(null);
    const [country, setCountry] = useState<Country|null>(null);
    const [cityName, setCityName] = useState<string>("");
    const [location, setLocation] = useState<Location|null>(null);
    const [takenAt, setTakenAt] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [hashTags, setHashTags] = useState<string[]>([]);



    console.log(image);
    console.log(takenAt);
    console.log(country)

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

        const getUploadUrlPath = new URL("/api/admin/photos/uploadUrl", window.location.origin);
        getUploadUrlPath.searchParams.set("takenAt", dto.data!.takenAt);

        //서버에서 사진 업로드용 signed url을 받아온다.
        let result;
        try {
            result = await fetch(getUploadUrlPath);
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
         debugger

        if (!image) return {ok: false, error: "Image is not attached"};

        const scheme = z.object({
            mimeType: z.string(),
            fileSizeBytes: z.number().int("fileSizeBytes must be an integer").positive("fileSizeBytes must be a positive number"),
            width: z.number().int("width must be an integer").positive("width must be a positive number"),
            height: z.number().int("height must be an integer").positive("height must be a positive number"),
            takenAt: z.iso.datetime({
                local: true
                ,error: "takenAt must be a valid date in YYYY-MM-DDTHH:mm:ss format"
            }),
            countryName: z.string().max(50, "countryName must be at most 50 characters"),
            countryCode: z.string().min(2).max(2),
            cityName: z.string().max(50, "cityName must be at most 50 characters"),
            latitude: z.number().min(-90, "latitude must be at least -90").max(90, "latitude must be at most 90"),
            longitude: z.number().min(-180, "longitude must be at least -180").max(180, "longitude must be at most 180"),
            comment: z.string().min(1, "comment is missing"),
            address: z.string().min(1, "address is missing"),
            placeName: z.string().min(1, "placeName is missing"),
            placeId: z.string().min(1, "placeId is missing"),
            hashTags: z.array(z.string()),

        });

        const parseResult = scheme.safeParse({
            mimeType: image.uploadMimeType,
            fileSizeBytes: image.uploadSize,
            width: image.uploadDimension.width,
            height: image.uploadDimension.height,
            takenAt: takenAt,
            countryName: country?.name,
            countryCode: country?.code,
            cityName: cityName,
            latitude: location?.coordinate.lat,
            longitude: location?.coordinate.lng,
            comment: comment,
            address: location?.address,
            placeName: location?.placeName,
            placeId: location?.placeId,
            hashTags: hashTags,
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
            setTakenAt(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
        }
    }

    return (
        <div className={"h-full w-full flex"}>
            <div className="relative flex-1 overflow-hidden ">
                {/* subtle background */}
                <div
                    className="
                        absolute inset-0
                        opacity-[0.035]
                        bg-[radial-gradient(#263526_1px,transparent_1px)]
                        [background-size:22px_22px]
                    "
                />
                <div className="relative flex h-full items-center justify-center p-12">
                    <PreviewPhotoCard
                        image={image}
                        cityName={cityName}
                        location={location} takenAt={takenAt} comment={comment} hashTags={hashTags}
                    />
                </div>
            </div>
            <aside className="w-[40%] h-full overflow-y-scroll box-border p-3 pb-50 border border-gray-200 text-sm rounded-l-3xl">
                <div className="space-y-4">
                    <div>
                        <div className={"font-bold mb-1"}>Image</div>
                        <ImageSelector name={"image"} file={image} onFileChange={handleImageChange} policy={policy}/>
                    </div>

                    <div>
                        <div className="font-bold mb-1">Country</div>
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

                    <div>
                        <div className={"font-bold mb-1"}>City Name</div>
                        <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 transition-colors focus-within:border-[#4a6248d4]">
                            <SearchInput
                                name="city-name"
                                value={cityName}
                                onValueChange={setCityName}
                                getSuggestions={searchCityName}
                                placeholder={"Type to search existing city or add yourself"}
                            />
                        </div>
                    </div>

                    <div>
                        <div className={"font-bold mb-1"}>Location</div>
                        <div className="w-full aspect-square overflow-hidden rounded-lg border border-gray-200">
                            <LocationPicker location={location} setLocation={setLocation}/>
                        </div>
                    </div>

                    <div>
                        <div className={"font-bold mb-1"}>Date and Time</div>
                        <DatetimeInput name={"taken-at"} value={takenAt} onValueChange={setTakenAt}/>
                    </div>
                    <div>
                        <div className={"font-bold mb-1"}>Comments</div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
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
                                focus:border-[#4a6248d4]
                            "
                            placeholder="Write a comment about your photo."
                        />
                    </div>

                    <div className="pb-20">
                        <div className={"font-bold mb-1"}>Hashtags</div>
                        <HashTagInput hashtags={hashTags} onChange={setHashTags}/>
                    </div>

                    <Button
                        className="m-auto"
                        onClick={handleSubmit}
                    >
                        submit!
                    </Button>

                </div>
            </aside>
        </div>
    )
}

