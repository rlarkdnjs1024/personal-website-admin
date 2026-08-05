export type Location = {
    coordinate: Coordinate,
    address: string,
    placeName?: string,
    placeId?: string,
}

export type Coordinate = {
    lat: number,
    lng: number,
}
