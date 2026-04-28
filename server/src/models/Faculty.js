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
        }
    },
    {
        timestamps:true
    }
)

const Faculty= mongoose.model("Faculty", facultySchema);

export default Faculty