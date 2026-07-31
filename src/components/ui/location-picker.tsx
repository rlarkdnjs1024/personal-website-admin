import {useState} from "react";
import {LatLngLiteral} from "@/types";
import {Map, Marker} from '@/components/ui/google-map'
import {MapMouseEvent} from "@vis.gl/react-google-maps";

type LocationPickerProps = {
    location: LatLngLiteral,
    onMapClick: (e: MapMouseEvent) => void
}

export default function LocationPicker({location, onMapClick}: LocationPickerProps) {
    const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

    return (
        <div className="w-full box-border rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
            <div className="mb-2 flex justify-end">
                <button
                    onClick={() => setIsPickerOpen(false)}
                    className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                    ✕
                </button>
            </div>
            <Map
                disableDefaultUI
                mapId="personal-website"
                className="w-full aspect-square m-auto"
                focusLocation={location}
                defaultZoom={10}
                defaultCenter={location}
                onClick={onMapClick}
            >
                <Marker
                    location={location}
                />
            </Map>
        </div>

    )

}