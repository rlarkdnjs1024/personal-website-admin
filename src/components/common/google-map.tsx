import {AdvancedMarker, Pin} from "@vis.gl/react-google-maps";
import LatLngLiteral = google.maps.LatLngLiteral;

type MarkerProps = {
    location: LatLngLiteral,
    onClick?: () => void,
    background?: string,
    glyphColor?: string,
    borderColor?: string,
}

const DEFAULT_BACKGROUND_COLOR = '#0D542B';
const DEFAULT_GLYPH_COLOR = '#FFFFFF';
const DEFAULT_BORDER_COLOR = '#FFFFFF';

export function Marker({location, onClick, background, glyphColor, borderColor}: MarkerProps) {
    background = background ?? DEFAULT_BACKGROUND_COLOR;
    glyphColor = glyphColor ?? DEFAULT_GLYPH_COLOR;
    borderColor = borderColor ?? DEFAULT_BORDER_COLOR;

    return (
        <AdvancedMarker
            position={location}
            onClick={onClick}
        >
            <Pin background={background} glyphColor={glyphColor} borderColor={borderColor} />
        </AdvancedMarker>
    )
}
