import mongoose from "mongoose";

const userSchema=new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
            select: false
        },
        role:{
            type: String,
            enum: ["student", "faculty"],
            required: true
        },
        refId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },

        resetPasswordToken: {type: String},
        resetPasswordExpire: {type: Date}
    },
    {
        timestamps:true
    }
)

const User= mongoose.model("User", userSchema);

export default User;