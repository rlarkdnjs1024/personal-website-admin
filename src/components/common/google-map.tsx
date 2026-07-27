import {AdvancedMarker, ControlPosition, MapControl, Pin, useMap} from "@vis.gl/react-google-maps";
import LatLngLiteral = google.maps.LatLngLiteral;
import {Map as MapPrimitive, MapMouseEvent} from "@vis.gl/react-google-maps";
import {ReactNode, useEffect, useRef, useState} from "react";
import {Button} from "@/components/common/button";
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
                    <div className="flex">
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
        <Button onClick={handleButtonClick} className={"bg-[#FFFFFFB3] rounded-md p-2"}>
            focus
        </Button>
    );
}

type ToggleFullscreenButtonProps = {
    isFullScreen: boolean;
    onToggle: () => Promise<void>;
};

function ToggleFullscreenButton({isFullScreen, onToggle,}: ToggleFullscreenButtonProps): React.ReactNode {
    return (
        <Button onClick={onToggle} className={"bg-[#FFFFFFB3] rounded-md p-2"}>
            {isFullScreen ? "exit full screen" : "full screen"}
        </Button>
    );
}

