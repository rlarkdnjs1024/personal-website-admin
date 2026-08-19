import {AdvancedMarker, Map, Pin, useMap} from "@vis.gl/react-google-maps";
import {PlaceSearch} from "@/feature/photo/components/place-search";
import {Coordinate} from "@/lib/types";
import {GooglePlace} from "@/feature/photo/type";

export function GooglePlacePicker({place, setPlace, exifLocation}: {place: GooglePlace|null, setPlace: (place: GooglePlace) => void, exifLocation: Coordinate|null}) {

    const needExifMarker = !(!!place && !!exifLocation && isEqual(place.location, exifLocation))

    return (
        <div className={"relative w-full aspect-square"}>
            <Map
                disableDefaultUI={true}
                mapId="personal-website"
                defaultZoom={10}
                defaultCenter={{lat: 51, lng: 6}}
            >
                <PlaceSearch onLocationChange={setPlace}/>
                {place?.location && <Marker location={place.location} />}
                {needExifMarker && <Marker location={exifLocation!} backgroundColor={'#808080'} glyphText={"E"}/>}
            </Map>
        </div>

    )
}

const DEFAULT_BACKGROUND_COLOR = '#0D542B';
const DEFAULT_GLYPH_COLOR = '#FFFFFF';
const DEFAULT_BORDER_COLOR = '#FFFFFF';

type MarkerProps = {
    location: Coordinate,
    backgroundColor?: string,
    glyphColor?: string,
    borderColor?: string,
    glyphText?: string,
}

function isEqual(placeLocation: Coordinate, exifLocation: Coordinate) {
    return placeLocation.lng === exifLocation.lng && placeLocation.lat === exifLocation.lat;
}

function Marker({
                    location,
                    backgroundColor=DEFAULT_BACKGROUND_COLOR,
                    glyphColor=DEFAULT_GLYPH_COLOR,
                    borderColor=DEFAULT_BORDER_COLOR,
                    glyphText,
}: MarkerProps): React.ReactElement<MarkerProps> {
    return (
        <AdvancedMarker
            position={location}
        >
            <Pin
                background={backgroundColor}
                glyphColor={glyphColor}
                borderColor={borderColor}
                glyphText={glyphText}
            />
        </AdvancedMarker>
    )
}