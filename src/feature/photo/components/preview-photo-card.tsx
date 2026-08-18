"use client"

import {Country, Location} from "@/feature/photo/type";
import {SelectedImage} from "@/components/ui/image-selector";
import {useState} from "react";
import {formatTakenAt} from "@/feature/photo/util";

type Props = {
    image: SelectedImage | null;
    cityName: string;
    location: Location | null;
    takenAt: string;
    comment: string;
    hashTags: string[];
}

export function PreviewPhotoCard({
                                     image,
    cityName,
                                     location,
                                     takenAt,
                                     comment,
                                     hashTags,
                                 }: Props) {
    const [showDetails, setShowDetails] = useState(false);

    const place = location?.placeName || cityName;
    const hasDetails = Boolean(comment || hashTags.length > 0);

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
                <div
                    className={`
                        text-[14px] font-medium tracking-wide
                        ${place ? "text-[#283128]" : "text-gray-300"}
                    `}
                >
                    {place || "Place"}
                </div>

                <div
                    className={`
                        mt-1 text-[11px] tracking-[0.14em]
                        ${takenAt ? "text-gray-400" : "text-gray-300"}
                    `}
                >
                    {takenAt
                        ? formatTakenAt(takenAt)
                        : "Date"}
                </div>
            </div>

            {/* Photo */}
            <div
                className={`
                    relative aspect-square w-full overflow-hidden bg-[#f5f6f4]
                    ${image && hasDetails ? "cursor-pointer" : ""}
                `}
                onClick={() => {
                    if (image && hasDetails) {
                        setShowDetails(prev => !prev);
                    }
                }}
            >
                {image ? (
                    <img
                        src={image.previewUrl}
                        alt="Preview"
                        className="block h-full w-full object-cover"
                        draggable={false}
                    />
                ) : (
                    <div
                        className="
                            flex h-full w-full
                            flex-col items-center justify-center
                            border border-dashed border-[#4a6248]/25
                            text-[#4a6248]/40
                        "
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="mb-3 h-6 w-6"
                        >
                            <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="2"
                            />
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path d="m21 15-5-5L5 21"/>
                        </svg>

                        <span className="text-xs">
                            Select a photo
                        </span>
                    </div>
                )}

                {/* Details overlay */}
                {image && showDetails && hasDetails && (
                    <div
                        className="
                            absolute inset-0
                            flex flex-col justify-end
                            bg-black/60
                        "
                    >
                        <div className="max-h-full overflow-y-auto p-4">
                            {comment && (
                                <p className="text-[13px] leading-5 text-white">
                                    {comment}
                                </p>
                            )}

                            {hashTags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
                                    {hashTags.map(tag => (
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
    );
}

