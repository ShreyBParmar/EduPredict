// seed/seedSubjects.js

import mongoose from "mongoose";
import MasterSubject from "../models/MasterSubject.js";

mongoose.connect("mongodb://shreyparmar004:Mydbisgood101930@ac-qairu8n-shard-00-00.zof1x8f.mongodb.net:27017,ac-qairu8n-shard-00-01.zof1x8f.mongodb.net:27017,ac-qairu8n-shard-00-02.zof1x8f.mongodb.net:27017/?ssl=true&replicaSet=atlas-9tbikx-shard-0&authSource=admin&appName=Cluster0");

const subjects = [

  // Semester 1
  { semester: 1, subjectName: "Physics", subjectCode: "3110011" },
  { semester: 1, subjectName: "Basic Electrical Engineering", subjectCode: "3110005" },
  { semester: 1, subjectName: "Basic Civil Engineering", subjectCode: "3110004" },
  { semester: 1, subjectName: "English", subjectCode: "3110002" },
  { semester: 1, subjectName: "Engineering Workshop", subjectCode: "3110012" },

  // Semester 2
  { semester: 2, subjectName: "Mathematics II", subjectCode: "3110004" },
  { semester: 2, subjectName: "Chemistry", subjectCode: "3110001" },
  { semester: 2, subjectName: "Programming for Problem Solving", subjectCode: "3110016" },
  { semester: 2, subjectName: "Engineering Graphics", subjectCode: "3110013" },
  { semester: 2, subjectName: "Communication Skills", subjectCode: "3110003" },

  // Semester 3
  { semester: 3, subjectName: "Data Structures", subjectCode: "3130702" },
  { semester: 3, subjectName: "Digital Electronics", subjectCode: "3130703" },
  { semester: 3, subjectName: "Object Oriented Programming (C++)", subjectCode: "3130704" },
  { semester: 3, subjectName: "Discrete Mathematics", subjectCode: "3130705" },
  { semester: 3, subjectName: "Computer Organization & Architecture", subjectCode: "3130706" },

  // Semester 4
  { semester: 4, subjectName: "Operating Systems", subjectCode: "3140702" },
  { semester: 4, subjectName: "Database Management Systems", subjectCode: "3140703" },
  { semester: 4, subjectName: "Design and Analysis of Algorithms", subjectCode: "3140704" },
  { semester: 4, subjectName: "Microprocessor and Interfacing", subjectCode: "3140705" },
  { semester: 4, subjectName: "Software Engineering", subjectCode: "3140706" },

  // Semester 5
  { semester: 5, subjectName: "Computer Networks", subjectCode: "3150701" },
  { semester: 5, subjectName: "Theory of Computation", subjectCode: "3150702" },
  { semester: 5, subjectName: "Web Technology", subjectCode: "3150703" },
  { semester: 5, subjectName: "Data Mining", subjectCode: "3150704" },
  { semester: 5, subjectName: "System Programming", subjectCode: "3150705" },

  // Semester 6
  { semester: 6, subjectName: "Artificial Intelligence", subjectCode: "3160704" },
  { semester: 6, subjectName: "Mobile Computing", subjectCode: "3160707" },
  { semester: 6, subjectName: "Distributed Systems", subjectCode: "3160708" },
  { semester: 6, subjectName: "Compiler Design", subjectCode: "3160709" },
  { semester: 6, subjectName: "Professional Ethics", subjectCode: "3160001" },

  // Semester 7
  { semester: 7, subjectName: "Machine Learning", subjectCode: "3170716" },
  { semester: 7, subjectName: "Big Data Analytics", subjectCode: "3170717" },
  { semester: 7, subjectName: "Information and Network Security", subjectCode: "3170718" },
  { semester: 7, subjectName: "Cloud Computing", subjectCode: "3170719" },
  { semester: 7, subjectName: "Internet of Things", subjectCode: "3170720" }

];

const seedSubjects = async () => {

  try {

    await MasterSubject.insertMany(subjects);

    console.log("Subjects seeded successfully");

    mongoose.connection.close();

  } catch (error) {

    console.log(error);

  }
};

seedSubjects();