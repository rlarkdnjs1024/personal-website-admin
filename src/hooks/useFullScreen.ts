import {RefObject, useEffect, useState} from "react";


export function useFullScreen(ref: RefObject<HTMLElement|null>) {
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

    async function toggleFullScreen() {

        if (!ref.current) {
            console.log("htmlElement is null");
            return;
        }

        if (document.fullscreenElement === ref.current) {
            await document.exitFullscreen();
            return;
        }

        await ref.current.requestFullscreen();
    }

    //isFullScreen은 페이지의 버튼이 아닌 Esc 키로도 변할 수 있는 상태이므로 document의 event listener가 변화를 감지하고 state를 변경한다.
    useEffect(() => {
        function handleFullScreenChange() {
            setIsFullScreen(document.fullscreenElement === ref.current);
        }

        document.addEventListener('fullscreenchange', handleFullScreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        }
    }, []);

    return {isFullScreen, toggleFullScreen};
}