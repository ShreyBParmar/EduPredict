import bcrypt from "bcryptjs";
import crypto from "crypto";
import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js"
import User from "../models/User.js";
import jwt from "jsonwebtoken";

//Registration of student
export const registerStudent = async (req, res) => {
  /*
  try {
    const { fullName, email, password, enrollmentId, year } = req.body;

    if (!fullName || !email || !password || !year || !enrollmentId) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // further logic: check existing user, hash password, save to DB
    const userExist = await Student.findOne({enrollmentId});

    if(userExist){
      return res.status(409).json(
        {
          message: "Student is already already enrolled with this ID!!"
        }
      )
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const student= await Student.create({
        fullName,
        email,
        password:hashedPassword,
        enrollmentId,
        year 
    })

    await User.create({
      email,
      password: hashedPassword,
      role: "student",
      refId: student._id
    });

    return res.status(201).json({
      success:true,
      message:"Student registered successfully",
      userId:student._id
    })
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }  
    */
   try {
    const { fullName, email, password, enrollmentId, semester } = req.body;

    // 1️basic validation
    if (!fullName || !email || !password || !semester || !enrollmentId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check student existence (by enrollmentId)
    const studentExist = await Student.findOne({ enrollmentId });

    if (studentExist) {
      return res.status(409).json({
        message: "Student already enrolled with this ID"
      });
    }

    // check email existence (auth)
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    //  hash password
    const hashedPassword = await bcrypt.hash(password, 12);

     // create student profile
    const student = await Student.create({
      fullName,
      enrollmentId,
      semester
    });

    // create auth user
    await User.create({
      email,
      password: hashedPassword,
      role: "student",
      refId: student._id
    });

    // send response ONCE
    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      userId:student._id
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Registration of faculty  safsdf 
export const registerFaculty = async (req, res) => {
  /*
  try {
    const { fullName, email, password, facultyId, role } = req.body;

    if (!fullName || !email || !password || !facultyId || !role ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // further logic: check existing user, hash password, save to DB
    const userExist = await Faculty.findOne({facultyId});

    if(userExist){
      return res.status(400).json(
        {
          message: "Faculty is already created!!"
        }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const faculty= await Faculty.create({
        fullName,
        email,
        password:hashedPassword,
        facultyId,
        role 
    })

    return res.status(201).json({
      success:true,
      message:"Faculty is saved",
      userId:faculty._id
    })

  } catch (error) {
    res.status(500).json({ message: error.message });
  }  
    */
   try {
    const { fullName, email, password, facultyId, role } = req.body;

    // basic validation
    if (!fullName || !email || !password || !role || !facultyId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //  check student existence (by enrollmentId)
    const facultyExist = await Faculty.findOne({ facultyId });
    
    if (facultyExist) {
      return res.status(409).json({
        message: "Faculty already enrolled with this ID"
      });
    }

    // check email existence (auth)
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    //  hash password
    const hashedPassword = await bcrypt.hash(password, 12);

     //  create student profile
    const faculty = await Faculty.create({
      fullName,
      facultyId,
      role
    });

    // create auth user
    await User.create({
      email,
      password: hashedPassword,
      role: "faculty",
      refId: faculty._id
    });

    //  send response ONCE
    return res.status(201).json({
      success: true,
      message: "Faculty registered successfully",
      userId:faculty._id
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Login of student
/*
export const loginStudent =async(req,res)=>{
  try{
    
    const{email,password}=req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }    

    const student= await Student.findOne({email}).select("+password")

    if(!student){
      res.status(401).json({message: "Invalid email or password!!!"})
    }

    const ismatch=await bcrypt.compare(password,student.password)

    if(!ismatch){
      res.stauts(401).json({message: "Inalid email or password"})
    }

    return res.status(200).json({
      success:true,
      message:"Login successful",
      userId: student._id
    })

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success:true,
      message:"Login successful",
      token
    })
     
  }
  catch(error){
    res.status(500).json({message: error.message});
  }
 
}

//Login of faculty
export const loginFaculty =async(req,res)=>{
  try{

    const{email,password}=req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }    

    const faculty= await Faculty.findOne({email}).select("+password")

    if(!faculty){
      res.status(401).json({message: "Invalid email or password!!!"})
    }

    const ismatch=await bcrypt.compare(password,faculty.password)

    if(!ismatch){
      res.stauts(401).json({message: "Inalid email or password"})
    }

    return res.status(200).json({
      success:true,
      message:"Login successful",
      userId: faculty._id
    })

    const token = jwt.sign(
      { id: faculty._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.stauts(200).json({
      success:true,
      message:"Login successful",
      token
    })
  }
  catch(error){
    res.status(500).json({message: error.message});
  }
}
*/

export const login =async(req,res)=>{
  try{
    const { email, password } = req.body;

  //  find user in USERS collection
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!user.isActive) {
  return res.status(401).json({ message: "Account deactivated" });
}


  // compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // generate token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // send role to frontend
  return res.status(200).json({
    success: true,
    token,
    role: user.role
  });
  }
  catch(error){
    res.status(500).json({message: error.message});
  }
}


export const forgotPassword=async(req,res)=>{
  console.log("Forgot password hit"); 
  try { 
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user || !user.isActive) {
      return res.status(404).json({
        message: "User not found or account inactive"
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save token + expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset link (send via email in production)
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // For development (temporary)
    console.log("Password Reset Link:", resetLink);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent"
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    console.log("Now:", Date.now());
    


    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords doesn't match" });
    }

    // Hash received token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find matching user
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    console.log("Expiry:", user.resetPasswordExpire);

    if (!user) {
      return res.status(400).json({
        message: "Token invalid or expired"
      });
    }

    // Hash new password
    user.password = await bcrypt.hash(password, 12);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
