import {useEffect, useRef} from "react";
import {
    ControlPosition,
    MapControl,
    useMap,
    useMapsLibrary,
} from "@vis.gl/react-google-maps";
import {Coordinate, Location} from "@/lib/types";

type PlaceSearchProps = {
    onLocationChange?: (location: Location) => void;
};


export function PlaceSearch({onLocationChange,}: PlaceSearchProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const map = useMap();
    const placesLibrary = useMapsLibrary("places");

    useEffect(() => {
        if (!map || !placesLibrary || !inputRef.current) {
            return;
        }

        const autocomplete = new placesLibrary.Autocomplete(
            inputRef.current,
            {
                fields: [
                    "geometry",
                    "name",
                    "formatted_address",
                    "address_components",
                    "place_id",
                ],
            },
        );

        //place_changed 이벤트는 사용자가 나열된 후보에서 하나를 선택했을때 발생한다.
        const listener = autocomplete.addListener(
            "place_changed",
            () => {
                const place = autocomplete.getPlace();
                const location = place.geometry?.location;
                const placeId = place.place_id;

                if (!location) {
                    return;
                }

                const position = {
                    lat: location.lat(),
                    lng: location.lng(),
                };

                if (place.geometry?.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.panTo(position);
                    map.setZoom(18);
                }

                onLocationChange?.({
                    coordinate: position,
                    address: place.formatted_address ?? "",
                    placeId: place.place_id,
                    placeName: place.name

                });
            },
        );

        return () => {
            listener.remove();
        };
    }, [map, placesLibrary, onLocationChange]);

    return (
            <div className={"absolute top-2 left-2 right-2"}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter a location."
                    className="
                        w-full rounded-md border border-gray-300
                        bg-white px-4 py-3 text-sm shadow-md
                        outline-none focus:border-[#4a6248d4]
                    "
                />
            </div>

    );
}