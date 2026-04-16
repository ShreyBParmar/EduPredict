import React, { createContext, useContext, useState } from "react";

const facultySem=createContext()

export const SubjectProvider =({children})=>{
    const [sem,setSem]=useState("")


    return(
        <facultySem.Provider value={sem,setSem}>
            {children}
        </facultySem.Provider>
    )
}