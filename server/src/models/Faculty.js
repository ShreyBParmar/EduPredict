import mongoose from "mongoose"

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
        role:{
            type: String,
            required: true
        }
    },
    {
        timestamps:true
    }
)

const Faculty= mongoose.model("Faculty", facultySchema);

export default Faculty