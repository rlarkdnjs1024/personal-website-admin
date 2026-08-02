import { fileTypeFromBuffer } from "file-type";
import imageCompression from "browser-image-compression";
import {heicTo} from "heic-to";

export async function getImageType(file: File) {
    const buffer = await file.arrayBuffer();

    const result = await fileTypeFromBuffer(new Uint8Array(buffer));

    // { ext: "jpg", mime: "image/jpeg" }
    return result;
}

export async function convertHeicToJpg (file: File) {

    const jpeg = await heicTo({blob: file, type: "image/jpeg"});
    const newName = file.name.replace(/\.[^.]+$/, ".jpg");
    return new File([jpeg], newName, {type: "image/jpeg"});
}

