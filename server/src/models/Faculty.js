import mongoose from "mongoose"
//import Subject from "./Subject";

const facultySchema=new mongoose.Schema(
    {
        fullName:{
            type: String,
            required: true,
        },
        facultyId:{
            type: String,
            required: true,
            unique:true
        },
        semester:{
            type: Number,
            required: true
        },
        subjects:[{
            type: mongoose.Schema.Types.ObjectId, 
            ref: "MasterSubject",
        }]
    },
    {
        timestamps:true
    }
)

const Faculty= mongoose.model("Faculty", facultySchema);

export default Faculty