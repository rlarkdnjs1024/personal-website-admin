"use client"

import {APIProvider} from "@vis.gl/react-google-maps";
import {ReactNode} from "react";

export function GoogleMapProvider({children} : {children: ReactNode}) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {

        throw new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY가 설정되지 않았습니다.");

    }
    return <APIProvider apiKey={apiKey} onLoad={()=>console.log("google map provider loaded")}>{children}</APIProvider>;
}