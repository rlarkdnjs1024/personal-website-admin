import {AdvancedMarker, Pin} from "@vis.gl/react-google-maps";
import {Coordinate} from "@/lib/types";

const DEFAULT_BACKGROUND_COLOR = '#0D542B';
const DEFAULT_GLYPH_COLOR = '#FFFFFF';
const DEFAULT_BORDER_COLOR = '#FFFFFF';

type LocationProps = {
    coordinate: Coordinate | null;
}

export function Location({coordinate}: LocationProps) {
    if (!coordinate) return null;

    return (
        <AdvancedMarker position={coordinate}>
            <Pin
                background={DEFAULT_BACKGROUND_COLOR}
                glyphColor={DEFAULT_GLYPH_COLOR}
                borderColor={DEFAULT_BORDER_COLOR}
            />
        </AdvancedMarker>
    )
}
