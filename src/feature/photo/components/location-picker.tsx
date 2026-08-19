import {AdvancedMarker, Map, Pin, useMap} from "@vis.gl/react-google-maps";
import {PlaceSearch} from "@/feature/photo/components/place-search";
import {Location} from "@/feature/photo/type";
import {Coordinate} from "@/lib/types";
import AdvancedMarkerClickEvent = google.maps.marker.AdvancedMarkerClickEvent;

export function LocationPicker({location, setLocation}: {location: Location|null, setLocation: (location: Location) => void}) {

    const map = useMap();

    if (map && location) {
        map.panTo(location?.coordinate);
    }

    return (
        <div className={"relative w-full aspect-square"}>
            <Map
                disableDefaultUI={true}
                mapId="personal-website"
                defaultZoom={10}
                defaultCenter={{lat: 51, lng: 6}}
            >
                <PlaceSearch onLocationChange={setLocation} />
                {location && <Marker location={location.coordinate} onCLick={(e) => console.log(e)}/>}
            </Map>
        </div>

    )
}

const DEFAULT_BACKGROUND_COLOR = '#0D542B';
const DEFAULT_GLYPH_COLOR = '#FFFFFF';
const DEFAULT_BORDER_COLOR = '#FFFFFF';

type MarkerProps = {
    location: Coordinate,
    onCLick: (e: AdvancedMarkerClickEvent) => void
}
function Marker({location, onCLick}: MarkerProps): React.ReactElement<MarkerProps> {
    return (
        <AdvancedMarker
            position={location}
            onClick={onCLick}
        >
            <Pin
                background={DEFAULT_BACKGROUND_COLOR}
                glyphColor={DEFAULT_GLYPH_COLOR}
                borderColor={DEFAULT_BORDER_COLOR}
            />
        </AdvancedMarker>
    )
}