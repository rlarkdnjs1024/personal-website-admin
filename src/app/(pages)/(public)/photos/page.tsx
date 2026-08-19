import {PhotoCard} from "@/feature/photo/components/photo-card";
import {Country, Location} from "@/feature/photo/type";
import {SelectedImage} from "@/components/ui/image-selector";

type PhotoListItem = {
    seq: number;
    image: SelectedImage;
    country: Country;
    cityName: string;
    location: Location;
    takenAt: string;
    comment: string;
    hashTags: string[];
};

// TODO: DB에서 조회한 사진 목록으로 교체
const photoList: PhotoListItem[] = [
    {
        seq: 1,
        image: {previewUrl: "https://picsum.photos/seed/photo-1/800/800"} as SelectedImage,
        country: {code: "JP", name: "Japan"},
        cityName: "Tokyo",
        location: {
            coordinate: {lat: 35.6586, lng: 139.7454},
            address: "Shibuya, Tokyo, Japan",
            placeName: "Shibuya Crossing",
        },
        takenAt: "2025-04-02T10:00:00",
        comment: "사람들 사이로 벚꽃이 흩날리던 시부야의 오후.",
        hashTags: ["tokyo", "shibuya", "spring"],
    },
    {
        seq: 2,
        image: {previewUrl: "https://picsum.photos/seed/photo-2/800/800"} as SelectedImage,
        country: {code: "FR", name: "France"},
        cityName: "Paris",
        location: {
            coordinate: {lat: 48.8584, lng: 2.2945},
            address: "Champ de Mars, Paris, France",
            placeName: "Eiffel Tower",
        },
        takenAt: "2025-06-14T19:30:00",
        comment: "",
        hashTags: ["paris", "eiffeltower"],
    },
    {
        seq: 3,
        image: {previewUrl: "https://picsum.photos/seed/photo-3/800/800"} as SelectedImage,
        country: {code: "KR", name: "South Korea"},
        cityName: "Jeju",
        location: {
            coordinate: {lat: 33.3617, lng: 126.5292},
            address: "Aewol-eup, Jeju, South Korea",
            placeName: "Hyeopjae Beach",
        },
        takenAt: "2025-08-01T16:20:00",
        comment: "여름 바다는 언제나 옳다.",
        hashTags: ["jeju", "beach", "summer"],
    },
    {
        seq: 4,
        image: {previewUrl: "https://picsum.photos/seed/photo-4/800/800"} as SelectedImage,
        country: {code: "IT", name: "Italy"},
        cityName: "Rome",
        location: {
            coordinate: {lat: 41.8902, lng: 12.4922},
            address: "Piazza del Colosseo, Rome, Italy",
            placeName: "Colosseum",
        },
        takenAt: "2025-05-10T09:15:00",
        comment: "",
        hashTags: [],
    },
    {
        seq: 5,
        image: {previewUrl: "https://picsum.photos/seed/photo-5/800/800"} as SelectedImage,
        country: {code: "US", name: "United States"},
        cityName: "New York",
        location: {
            coordinate: {lat: 40.7580, lng: -73.9855},
            address: "Manhattan, New York, USA",
            placeName: "Times Square",
        },
        takenAt: "2024-12-24T21:00:00",
        comment: "크리스마스 이브의 타임스퀘어는 낮보다 밝았다.",
        hashTags: ["newyork", "christmas", "night"],
    },
    {
        seq: 6,
        image: {previewUrl: "https://picsum.photos/seed/photo-6/800/800"} as SelectedImage,
        country: {code: "PT", name: "Portugal"},
        cityName: "Lisbon",
        location: {
            coordinate: {lat: 38.7139, lng: -9.1394},
            address: "Alfama, Lisbon, Portugal",
            placeName: "Alfama District",
        },
        takenAt: "2025-03-22T17:45:00",
        comment: "",
        hashTags: ["lisbon", "alfama"],
    },
];

export default function Page() {
    return (
        <div className="min-h-screen bg-[#f7f7f5]">
            <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
                <div className="mb-14 text-center">
                    <div className="text-[11px] font-medium tracking-[0.35em] text-gray-400">
                        TRAVEL DIARY
                    </div>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#283128] sm:text-4xl">
                        Photos
                    </h1>
                    <p className="mt-3 text-sm text-gray-400">
                        지금까지 다녀온 순간들을 기록합니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 justify-items-center gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                    {photoList.map((photo) => (
                        <PhotoCard
                            key={photo.seq}
                            image={photo.image}
                            country={photo.country}
                            cityName={photo.cityName}
                            location={photo.location}
                            takenAt={photo.takenAt}
                            comment={photo.comment}
                            hashTags={photo.hashTags}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
