import {useEffect, useRef} from "react";
import {
    useMap,
    useMapsLibrary,
} from "@vis.gl/react-google-maps";
import {GooglePlace} from "@/feature/photo/type";

type PlaceSearchProps = {
    onLocationChange: (place: GooglePlace) => void;
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
                const placeName = place.name;

                if (location && placeId && placeName) {
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

                    onLocationChange({
                        location: position,
                        placeId: placeId,
                        placeName: placeName
                    });
                }
            }
        );

        return () => {
            listener.remove();
        };
    }, [map, placesLibrary, onLocationChange]);

    return (
        <input
            ref={inputRef}
            type="text"
            placeholder="Enter a location."
            className="
                w-full h-10 rounded-lg border border-gray-200
                bg-white px-3 text-sm
                outline-none transition-colors focus:border-[#4a6248d4]
            "
        />
    );
}