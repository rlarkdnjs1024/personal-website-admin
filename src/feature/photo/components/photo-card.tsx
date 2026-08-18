"use client"

import {Country, Location} from "@/feature/photo/type";
import {SelectedImage} from "@/components/ui/image-selector";
import {useState} from "react";

type Props = {
    image: SelectedImage,
    country: Country,
    cityName: string,
    location: Location,
    takenAt: string,
    comment: string,
    hashTags: string[],
}

export function PhotoCard(
    {
        image,
        country,
        cityName,
        location,
        takenAt,
        comment,
        hashTags
    }: Props
) {

    const [showDetails, setShowDetails] = useState(false);
    return (
        <div
            className="
                                w-full max-w-[400px]
                                rounded-[4px]
                                bg-white
                                p-3 pb-4
                                shadow-[0_18px_45px_rgba(0,0,0,0.10)]
                                ring-1 ring-black/[0.04]
                            "
        >
            {/* Place + Date */}
            <div className="px-2 pb-3 text-center">
                {location && (
                    <div className="text-[14px] font-medium tracking-wide text-[#283128]">
                        {location.placeName || cityName}
                    </div>
                )}

                {takenAt && (
                    <div className="mt-1 text-[11px] tracking-[0.14em] text-gray-400">
                        {formatTakenAt(takenAt)}
                    </div>
                )}
            </div>

            {/* Photo */}
            <div
                className="relative aspect-square w-full cursor-pointer overflow-hidden bg-gray-100"
                onClick={() => setShowDetails((prev) => !prev)}
            >
                <img
                    src={image.previewUrl}
                    alt="Preview"
                    className="block h-full w-full object-cover"
                    draggable={false}
                />

                {showDetails && (comment || hashTags.length > 0) && (
                    <div className="absolute inset-0 flex flex-col justify-end bg-black/60">
                        <div className="max-h-full overflow-y-auto p-4">
                            {comment && (
                                <p className="text-[13px] leading-5 text-white">
                                    {comment}
                                </p>
                            )}

                            {hashTags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
                                    {hashTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[11px] text-white/80"
                                        >
                                                            #{tag}
                                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function formatTakenAt(value: string) {
    if (!value) return "";
    const date = new Date(value);

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(date);
}