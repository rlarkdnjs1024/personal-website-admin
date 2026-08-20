import {Coordinate} from "@/lib/types";
import {SelectedImage} from "@/feature/photo/components/image-selector";

export type Country = {
    code: string,
    name: string,
}

export type GooglePlace = {
    placeName: string,
    placeId: string,
    location: Coordinate,
}

export type Location = {
    coordinate: Coordinate,
    placeId?: string,
    placeName?: string,
}

export type PreviewPhotoCardProps = {
    image: SelectedImage | null;
    cityName: string;
    place: GooglePlace | null;
    takenAt: string;
    comment: string;
    hashTags: string[];
}

export type PhotoCardProps = {
    image: SelectedImage;
    cityName: string;
    place: GooglePlace;
    takenAt: string;
    comment: string;
    hashTags: string[];
}
