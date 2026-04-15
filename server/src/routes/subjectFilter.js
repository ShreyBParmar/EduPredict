import express from "express"
import MasterSubject from "../models/MasterSubject.js"

const router=express.Router()

router.get("/filter",async(req,res)=>{
    try{
        const {semester}=req.query;
        const subjects=await MasterSubject.find({semester: Number(semester)})
        res.json(subjects)
    }
    catch(err){
       console.error("Error fetching subjects:", err.message);
       res.status(500).json({ message: err.message });
    }
})

export default router