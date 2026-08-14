import {z} from "zod";

export const postPhotoSchema = z.object({
    storagePath: z.string().max(500, "storagePath must be at most 500 characters"),
    mimeType: z.string().max(100, "mimeType must be at most 100 characters"),
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
    comment: z.string().min(0, "comment is missing"),
    address: z.string().min(0, "address is missing"),
    placeName: z.string().min(0, "placeName is missing"),
    placeId: z.string().min(0, "placeId is missing"),
    hashTags: z.array(z.string()),
})