import z from "zod";
import {supabaseServerClient} from "@/lib/supabase.server";

const createPhotoSchema = z.object({
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

export function parsePayload(payload: any): any {
    return createPhotoSchema.safeParse(payload);
}



export type CreatePhotoData = z.infer<typeof createPhotoSchema>;
export async function createPhoto(
    data: CreatePhotoData,
    uploadedBy: number,
): Promise<number> {
    console.log(data);
    const {data: photoSeq, error} = await supabaseServerClient.rpc(
        "create_photo",
    {
        p_storage_path: data.storagePath,
        p_mime_type: data.mimeType,
        p_file_size_bytes: data.fileSizeBytes,
        p_width: data.width,
        p_height: data.height,
        p_uploaded_by: uploadedBy,
        p_taken_at: data.takenAt,
        p_country_code: data.countryCode,
        p_country_name: data.countryName,
        p_city_name: data.cityName,
        p_latitude: data.latitude,
        p_longitude: data.longitude,
        p_comment: data.comment,
        p_address: data.address,
        p_place_name: data.placeName,
        p_place_id: data.placeId,
        p_hash_tags: data.hashTags,
    });

    if (error) {
        throw error;
    }

    return photoSeq;
}