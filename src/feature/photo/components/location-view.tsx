import {Map} from "@vis.gl/react-google-maps";
import {Location} from "@/feature/photo/components/location";
import {Coordinate} from "@/lib/types";

type GooglePlacePickerProps = {
    coordinate: Coordinate|null;
}

export function LocationView({coordinate}: GooglePlacePickerProps) {

    return (
        <div className={"relative w-full aspect-square"}>
            <Map
                disableDefaultUI={true}
                mapId="personal-website"
                defaultZoom={10}
                defaultCenter={{lat: 51, lng: 6}}
            >
                <Location coordinate={coordinate}/>
            </Map>
        </div>

    )
}
