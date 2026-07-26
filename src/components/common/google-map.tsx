import {AdvancedMarker, ControlPosition, MapControl, Pin, useMap} from "@vis.gl/react-google-maps";
import LatLngLiteral = google.maps.LatLngLiteral;
import {Map as MapPrimitive, MapMouseEvent} from "@vis.gl/react-google-maps";
import {ReactNode, useEffect, useRef, useState} from "react";
import {Button} from "@/components/common/button";

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
    const [isFullscreen, setIsFullscreen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    async function toggleFullscreen() {
        const wrapper = wrapperRef.current;

        if (!wrapper) return;

        if (document.fullscreenElement === wrapper) {
            await document.exitFullscreen();
            return;
        }

        await wrapper.requestFullscreen();
    }

    useEffect(() => {
        function handleFullscreenChange() {
            setIsFullscreen(
                document.fullscreenElement === wrapperRef.current
            );
        }

        document.addEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
        };
    }, []);

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
                    <div className="flex gap-2">
                        <FocusButton
                            focusLocation={focusLocation}
                        />

                        <ToggleFullscreenButton
                            isFullscreen={isFullscreen}
                            onToggle={toggleFullscreen}
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
        <Button onClick={handleButtonClick}>
            focus
        </Button>
    );
}

type ToggleFullscreenButtonProps = {
    isFullscreen: boolean;
    onToggle: () => Promise<void>;
};

function ToggleFullscreenButton({isFullscreen, onToggle,}: ToggleFullscreenButtonProps): React.ReactNode {
    return (
        <Button onClick={onToggle}>
            {isFullscreen ? "전체화면 종료" : "전체화면"}
        </Button>
    );
}

