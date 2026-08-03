"use client"
import {ImageSelector, ImageSelectorPolicy, SelectedImage} from "@/components/ui/image-selector";
import {useEffect, useState} from "react";
import {TextInput} from "@/components/ui/text-input";
import {Button} from "@/components/ui/button";

export function NewPhotoPage() {
    const [image, setImage] = useState<SelectedImage|null>(null);
    const [countryName, setCountryName] = useState<string>("");
    const [cityName, setCityName] = useState<string>("");
    const [countryCode, setCountryCode] = useState<string>("");

    console.log(image);

    const policy: ImageSelectorPolicy  = {
        maximumBytes: 500 * 1024,
        maximumWidthOrHeight: 1600,
    }

    function handleSubmit() {

    }

    return (
        <div>
            <ImageSelector name={"image"} file={image} onFileChange={setImage} policy={policy}/>

            <div className="border-b-gray-300 border-b-1 focus-within:border-b-[#4a6248d4]">
                <div className={"font-bold"}>Country Name</div>
                <TextInput
                    name={"country-name"}
                    value={countryName}
                    onValueChange={setCountryName}
                />
            </div>

            <div className="border-b-gray-300 border-b-1 focus-within:border-b-[#4a6248d4]">
                <div className={"font-bold"}>Country Code</div>
                <TextInput
                    name={"city-name"}
                    value={countryCode}
                    onValueChange={setCountryCode}
                />
            </div>


            <div className="border-b-gray-300 border-b-1 focus-within:border-b-[#4a6248d4]">
                <div className={"font-bold"}>City Name</div>
                <TextInput
                    name={"city-name"}
                    value={cityName}
                    onValueChange={setCityName}
                />
            </div>

            <Button onClick={handleSubmit}>submit</Button>

        </div>


    )
}