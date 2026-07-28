import {AdvancedMarker, ControlPosition, MapControl, Pin, useMap} from "@vis.gl/react-google-maps";
import LatLngLiteral = google.maps.LatLngLiteral;
import {Map as MapPrimitive, MapMouseEvent} from "@vis.gl/react-google-maps";
import {ReactNode, useEffect, useRef, useState} from "react";
import {useFullScreen} from "@/hooks/useFullScreen";

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
    focusLocation: LatLngLiteral,
    children: ReactNode,
    onClick?: (event: MapMouseEvent) => void,
    className?: string,
    disableDefaultUI?: boolean,
}

export function Map({
                        mapId,
                        defaultZoom,
                        defaultCenter,
                        focusLocation,
                        children,
                        onClick,
                        className,
                        disableDefaultUI,
                    }: MapProps): React.ReactNode {

    const wrapperRef = useRef<HTMLDivElement>(null);
    const {isFullScreen, toggleFullScreen} = useFullScreen(wrapperRef);

    return (
        <div
            ref={wrapperRef}
            className={className}
        >
            <MapPrimitive
                disableDefaultUI={disableDefaultUI}
                mapId={mapId}
                defaultZoom={defaultZoom}
                defaultCenter={defaultCenter}
                onClick={onClick}
            >
                {children}

                <MapControl position={ControlPosition.TOP_RIGHT}>
                    <div className="flex flex-row gap-1 m-2">
                        <FocusButton
                            focusLocation={focusLocation}
                        />

                        <ToggleFullscreenButton
                            isFullScreen={isFullScreen}
                            onToggle={toggleFullScreen}
                        />
                    </div>
                </MapControl>
            </MapPrimitive>
        </div>
    );
}

function FocusButton({focusLocation,}: { focusLocation: google.maps.LatLngLiteral; }): React.ReactNode {
    const map = useMap();

    function handleButtonClick() {
        map?.panTo(focusLocation);
        map?.setZoom(18);
    }

    return (
        <button onClick={handleButtonClick} className="hover:cursor-pointer bg-gray-100 rounded-md p-1.5">
            <FocusIcon className="w-4 h-4"/>
        </button>
    );
}

type ToggleFullscreenButtonProps = {
    isFullScreen: boolean;
    onToggle: () => Promise<void>;
};

function ToggleFullscreenButton({isFullScreen, onToggle,}: ToggleFullscreenButtonProps): React.ReactNode {
    return (
        <button onClick={onToggle} className="hover:cursor-pointer bg-gray-100 rounded-md p-1.5">
            {isFullScreen ? <FullScreenExitIcon className="w-4 h-4"/> : <FullScreenIcon className="w-4 h-4"/>}
        </button>
    );
}

function FocusIcon({className}: { className?: string }): React.ReactNode {
    return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path fill="#000000" d="M264,4281 L264,4286 C264,4286.552 263.552,4287 263,4287 C262.448,4287 262,4286.552 262,4286 L262,4282 C262,4281.448 261.552,4281 261,4281 L257,4281 C256.448,4281 256,4280.552 256,4280 C256,4279.448 256.448,4279 257,4279 L262,4279 C263.105,4279 264,4279.895 264,4281 L264,4281 Z M262,4299 L257,4299 C256.448,4299 256,4298.552 256,4298 C256,4297.448 256.448,4297 257,4297 L261,4297 C261.552,4297 262,4296.552 262,4296 L262,4292 C262,4291.448 262.448,4291 263,4291 C263.552,4291 264,4291.448 264,4292 L264,4297 C264,4298.105 263.105,4299 262,4299 L262,4299 Z M244,4297 L244,4292 C244,4291.448 244.448,4291 245,4291 C245.552,4291 246,4291.448 246,4292 L246,4296 C246,4296.552 246.448,4297 247,4297 L251,4297 C251.552,4297 252,4297.448 252,4298 C252,4298.552 251.552,4299 251,4299 L246,4299 C244.895,4299 244,4298.105 244,4297 L244,4297 Z M244,4286 L244,4281 C244,4279.895 244.895,4279 246,4279 L251,4279 C251.552,4279 252,4279.448 252,4280 C252,4280.552 251.552,4281 251,4281 L247,4281 C246.448,4281 246,4281.448 246,4282 L246,4286 C246,4286.552 245.552,4287 245,4287 C244.448,4287 244,4286.552 244,4286 L244,4286 Z M244.01,4289 L244,4289.01 L244,4288.99 L244.01,4289 Z M254,4291 C252.897,4291 252,4290.103 252,4289 C252,4287.897 252.897,4287 254,4287 C255.103,4287 256,4287.897 256,4289 C256,4290.103 255.103,4291 254,4291 L254,4291 Z M257.859,4290 L259,4290 C259.552,4290 260,4289.552 260,4289 C260,4288.448 259.552,4288 259,4288 L257.859,4288 C257.496,4286.599 256.401,4285.504 255,4285.141 L255,4284 C255,4283.448 254.552,4283 254,4283 C253.448,4283 253,4283.448 253,4284 L253,4285.141 C251.599,4285.504 250.504,4286.599 250.141,4288 L249,4288 C248.448,4288 248,4288.448 248,4289 C248,4289.552 248.448,4290 249,4290 L250.141,4290 C250.504,4291.401 251.599,4292.496 253,4292.859 L253,4294 C253,4294.552 253.448,4295 254,4295 C254.552,4295 255,4294.552 255,4294 L255,4292.859 C256.401,4292.496 257.496,4291.401 257.859,4290 L257.859,4290 Z"
                  transform="translate(-244,-4279)"/>
        </svg>
    );
}

function FullScreenIcon({className}: { className?: string }): React.ReactNode {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M23 4C23 2.34315 21.6569 1 20 1H16C15.4477 1 15 1.44772 15 2C15 2.55228 15.4477 3 16 3H20C20.5523 3 21 3.44772 21 4V8C21 8.55228 21.4477 9 22 9C22.5523 9 23 8.55228 23 8V4Z" fill="#0F0F0F"/>
            <path d="M23 16C23 15.4477 22.5523 15 22 15C21.4477 15 21 15.4477 21 16V20C21 20.5523 20.5523 21 20 21H16C15.4477 21 15 21.4477 15 22C15 22.5523 15.4477 23 16 23H20C21.6569 23 23 21.6569 23 20V16Z" fill="#0F0F0F"/>
            <path d="M4 21H8C8.55228 21 9 21.4477 9 22C9 22.5523 8.55228 23 8 23H4C2.34315 23 1 21.6569 1 20V16C1 15.4477 1.44772 15 2 15C2.55228 15 3 15.4477 3 16V20C3 20.5523 3.44772 21 4 21Z" fill="#0F0F0F"/>
            <path d="M1 8C1 8.55228 1.44772 9 2 9C2.55228 9 3 8.55228 3 8L3 4C3 3.44772 3.44772 3 4 3H8C8.55228 3 9 2.55228 9 2C9 1.44772 8.55228 1 8 1H4C2.34315 1 1 2.34315 1 4V8Z" fill="#0F0F0F"/>
        </svg>
    );
}

function FullScreenExitIcon({className}: { className?: string }): React.ReactNode {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M7 16L2 16C1.44772 16 1 15.5523 1 15C1 14.4477 1.44772 14 2 14L7 14C8.65685 14 10 15.3431 10 17V22C10 22.5523 9.55228 23 9 23C8.44772 23 8 22.5523 8 22V17C8 16.4477 7.55228 16 7 16Z" fill="#0F0F0F"/>
            <path d="M10 2C10 1.44772 9.55229 1 9 1C8.44772 1 8 1.44772 8 2L8 7C8 7.55228 7.55228 8 7 8L2 8C1.44772 8 1 8.44771 1 9C1 9.55228 1.44772 10 2 10L7 10C8.65685 10 10 8.65685 10 7L10 2Z" fill="#0F0F0F"/>
            <path d="M14 22C14 22.5523 14.4477 23 15 23C15.5523 23 16 22.5523 16 22V17C16 16.4477 16.4477 16 17 16H22C22.5523 16 23 15.5523 23 15C23 14.4477 22.5523 14 22 14H17C15.3431 14 14 15.3431 14 17V22Z" fill="#0F0F0F"/>
            <path d="M14 7C14 8.65686 15.3431 10 17 10L22 10C22.5523 10 23 9.55228 23 9C23 8.44772 22.5523 8 22 8L17 8C16.4477 8 16 7.55229 16 7L16 2C16 1.44772 15.5523 1 15 1C14.4477 1 14 1.44772 14 2L14 7Z" fill="#0F0F0F"/>
        </svg>
    );
}

