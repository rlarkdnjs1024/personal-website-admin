import {Location} from "@/lib/types";
import {Map} from "@vis.gl/react-google-maps";
import {PlaceSearch} from "@/components/ui/place-search";
import {Marker} from "@/components/ui/google-map";

export function LocationPicker({location, setLocation}: {location: Location|null, setLocation: (location: Location) => void}) {
    return (
        <div className={"relative w-full aspect-square"}>
            <Map
                disableDefaultUI={true}
                mapId="personal-website"
                defaultZoom={10}
                defaultCenter={{lat: 51, lng: 6}}
            >
                <PlaceSearch onLocationChange={setLocation} />
                {location && <Marker location={location.coordinate}/>}
            </Map>
        </div>

    )
}