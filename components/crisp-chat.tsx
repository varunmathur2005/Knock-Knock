"use client"

import { useEffect } from "react"
import { Crisp } from "crisp-sdk-web"

export const CrispChat = () =>{
    useEffect(() => {
        Crisp.configure("5a8bd500-d8e3-40a8-a572-18302f3ddcd9");
    }, [])
    return null;
}