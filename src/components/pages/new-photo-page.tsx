"use client"
import {ImageSelector, ImageSelectorPolicy, SelectedImage} from "@/components/ui/image-selector";
import {useState} from "react";

export function NewPhotoPage() {
    const [image, setImage] = useState<SelectedImage|null>(null);

    const policy: ImageSelectorPolicy  = {
        maximumBytes: 500 * 1024,
        maximumWidthOrHeight: 1600,
    }
    return (
        <ImageSelector name={"image"} file={image} onFileChange={setImage} policy={policy}/>
    )
}