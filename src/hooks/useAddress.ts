import {useEffect, useState} from "react";
import LatLngLiteral = google.maps.LatLngLiteral;

export function useAddress(location: LatLngLiteral) {
    const [address, setAddress] = useState<string|null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        let cancelled = false;

        async function loadAddress() {
            setIsLoading(true);

            try {
                const geocoder = new google.maps.Geocoder();
                const response = await geocoder.geocode({location});
                const result = response.results[0]?.formatted_address ?? null;
                if (cancelled) return;
                setAddress(result);

            } catch (e) {
                if (cancelled) return;
                console.error(e);
                setAddress(null);

            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadAddress();

        return () => {
            cancelled = true;
        }
    }, [location]);

    return {address, isLoading};
}