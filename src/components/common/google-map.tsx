import {AdvancedMarker, Pin} from "@vis.gl/react-google-maps";
import LatLngLiteral = google.maps.LatLngLiteral;
import {Map as MapPrimitive, MapMouseEvent} from "@vis.gl/react-google-maps";
import {ReactNode} from "react";

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

type MapProps = {
    mapId: string,
    defaultZoom: number,
    defaultCenter: LatLngLiteral,
    children: ReactNode,
    onClick?: () => void,
    className?: string,
    disableDefaultUI?: boolean,
}

export function Map({
    mapId,
    defaultZoom,
    defaultCenter,
    children,
    onClick,
    className,
    disableDefaultUI,
                    }: MapProps): ReactNode {
    return (
        <div>
            <MapPrimitive
                disableDefaultUI
                mapId={mapId}
                className={className}
                defaultZoom={defaultZoom}
                defaultCenter={defaultCenter}
                onClick={onClick}
            >
                {children}
            </MapPrimitive>

        </div>

    )
}
