import {Coordinate} from "@/lib/types";

export type Country = {
    code: string,
    name: string,
}

export type Location = {
    coordinate: Coordinate,
    address: string,
    placeName?: string,
    placeId?: string,
}

