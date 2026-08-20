"use client"
import {ImageSelector, ImageSelectorPolicy, SelectedImage} from "@/components/ui/image-selector";
import {useCallback, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {supabaseBrowserClient} from "@/lib/supabase.browser";
import {LocationView} from "@/feature/photo/components/location-view";
import {PlaceSearch} from "@/feature/photo/components/place-search";
import {SelectBox, SelectOption} from "@/components/ui/select-box";
import {countryCodeToFlag} from "@/lib/utils";
import {SearchInput} from "@/components/ui/search-input";
import {DatetimeInput} from "@/components/ui/datetime-input";
import {HashTagInput} from "@/components/ui/hash-tag";
import {Country, GooglePlace} from "@/feature/photo/type";
import {PreviewPhotoCard} from "@/feature/photo/components/photo-card";
import {useMap} from "@vis.gl/react-google-maps";
import {SingleCheckBox} from "@/components/ui/checkbox";
import {Coordinate} from "@/lib/types";


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
    const [coordinate, setCoordinate] = useState<Coordinate|null>(null);
    const [place, setPlace] = useState<GooglePlace|null>(null);
    const [takenAt, setTakenAt] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [hashTags, setHashTags] = useState<string[]>([]);
    const [useExifCoordinate, setUseExifCoordinate] = useState<boolean>(false);



    console.log("이미지", image?.originalLocation);
    console.log("구글 플레이스", place);
    console.log("DB좌표", coordinate);

    const policy: ImageSelectorPolicy  = {
        maximumBytes: 500 * 1024,
        maximumWidthOrHeight: 1600,
    }

    const map = useMap();

    useEffect(() => {
        //image가 삭제되면 촬영 날짜와 장소를 초기화한다.
        if (!image) {
            setUseExifCoordinate(false);
            return;
        }

        //image를 등록하면 EXIF DATA에서 촬영 날짜와 위치를 set한다.
        const date = image.takenAt;
        const coordinate = image.originalLocation;

        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hour = String(date.getHours()).padStart(2, "0");
            const minute = String(date.getMinutes()).padStart(2, "0");
            const second = String(date.getSeconds()).padStart(2, "0");
            setTakenAt(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
        }
    }, [image]);

    //use EXIF location 옵션에 따라 coordinate synchronize
    useEffect(() => {
        if (useExifCoordinate) {
            setCoordinate(image?.originalLocation ? {...image.originalLocation} : null);
        }

        else {
            setCoordinate(place ? {...place.location} : null);
        }
    }, [useExifCoordinate, image, place]);

    useEffect(() => {
        if (map && coordinate) {
            map.panTo(coordinate);
            map.setZoom(15)
        }

    }, [coordinate]);


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
            comment: z.string(),
            placeName: z.string().nullable(),
            placeId: z.string().nullable(),
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
            latitude: coordinate?.lat,
            longitude: coordinate?.lng,
            comment: comment,
            placeName: place?.placeName,
            placeId: place?.placeId,
            hashTags: hashTags,
        });

        if (parseResult.success) {
            debugger
            return {ok: true, error: null, data: parseResult.data};
        }

        return {ok: false, error: parseResult.error.issues[0].message}
    }

    const searchCityName = useCallback(async (keyword: string) => {
        const url = new URL("/api/admin/cities", window.location.origin);
        url.searchParams.set("search", keyword.trim().toLowerCase());
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to search cities: ${response.status}`);
        }

        const json = await response.json();
        return json.data as string[];
    }, []);


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
                        place={place}
                        takenAt={takenAt}
                        comment={comment}
                        hashTags={hashTags}
                    />
                </div>
            </div>
            <aside className="w-[40%] h-full overflow-y-scroll box-border p-3 pb-50 border border-gray-200 text-sm rounded-l-3xl">
                <div className="space-y-4">
                    <div>
                        <div className={"font-bold mb-1"}>Image</div>
                        <ImageSelector name={"image"} file={image} onFileChange={setImage} policy={policy}/>
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
                        <div className={"font-bold mb-1"}>Place</div>
                        <PlaceSearch onLocationChange={setPlace}/>
                    </div>

                    <div>
                        <div className={"font-bold mb-1"}>Location</div>
                        <SingleCheckBox
                            value={useExifCoordinate}
                            onValueChange={setUseExifCoordinate}
                            disabled={!!!image?.originalLocation}
                        >
                            use EXIf location data
                        </SingleCheckBox>
                        <div className="w-full aspect-square overflow-hidden rounded-lg border border-gray-200">
                            <LocationView
                                coordinate={coordinate}
                            />
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

