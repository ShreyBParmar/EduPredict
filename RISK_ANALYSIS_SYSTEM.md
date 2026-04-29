# 🎓 Student Risk Analysis System - Implementation Guide

## 📋 Overview

A comprehensive MERN stack risk analysis system that identifies at-risk students based on attendance and marks data. The system provides:

- ✅ Risk level calculation (High/Medium/Low)
- ✅ Student data table with detailed metrics
- ✅ Doughnut chart visualization
- ✅ Sorting and filtering capabilities
- ✅ Color-coded risk indicators

---

## 🚀 Features Implemented

### 1. **Risk Logic**

```javascript
getRiskLevel(attendance, marks)
```

**Risk Thresholds:**
- **High Risk**: Attendance < 60% OR Total Marks < 35
- **Medium Risk**: Attendance 60-74% OR Marks 35-49  
- **Low Risk**: Attendance ≥ 75% AND Marks ≥ 50

**Example:**
- Student A: 50% attendance, 40 marks → **High Risk** ❌
- Student B: 65% attendance, 45 marks → **Medium Risk** ⚠️
- Student C: 80% attendance, 60 marks → **Low Risk** ✅

### 2. **Backend API**

**Endpoint:**
```
GET /api/student/risk-students?subjectId=<id>&semester=<sem>
```

**Response:**
```json
{
  "success": true,
  "students": [
    {
      "_id": "mongodb_id",
      "studentId": "student_id",
      "name": "John Doe",
      "enrollmentId": "E001",
      "attendance": 65,
      "internalMarks": 25,
      "externalMarks": 30,
      "Practical": 10,
      "totalMarks": 65,
      "riskLevel": "Medium"
    }
  ],
  "summary": {
    "High": 5,
    "Medium": 8,
    "Low": 12,
    "total": 25
  }
}
```

### 3. **Frontend Components**

#### At-Risk Students Page Features:

**Summary Cards**
- High Risk count (red)
- Medium Risk count (yellow)
- Low Risk count (green)
- Total Students (blue)

**Doughnut Chart**
- Visual distribution of students by risk level
- Interactive legend
- Real-time updates

**Data Table**
Columns:
- Name
- Enrollment ID
- Attendance %
- Marks breakdown (Internal | External | Practical)
- Total Marks
- Risk Level (color-coded badge)

**Controls**
- **Sort By**: Risk Level, Student Name, Attendance ↓, Marks ↓
- **Filter By Risk**: All Students, High Risk Only, Medium Risk Only, Low Risk Only

### 4. **Color Coding**

| Risk Level | Color | Usage |
|-----------|-------|-------|
| High Risk | Red (#ef4444) | Alert/Critical |
| Medium Risk | Yellow (#eab308) | Warning |
| Low Risk | Green (#22c55e) | Safe/Good |

---

## 📂 File Structure

### Backend
```
server/
├── src/
│   ├── controllers/
│   │   └── studentController.js    (getRiskStudents function)
│   ├── utils/
│   │   └── riskAnalysis.js        (Risk logic utilities)
│   └── routes/
│       └── studentRoutes.js        (/api/student routes)
```

### Frontend
```
frontend/src/
├── pages/
│   └── faculty/
│       └── tabs/
│           └── RiskStudent.jsx    (Main component)
└── utils/
    └── riskAnalysis.js            (Frontend utilities)
```

---

## 🛠️ How to Use

### Step 1: Upload Student Data
1. Go to **Faculty Dashboard**
2. Go to **Upload Marks** tab
3. Select a subject and semester
4. Upload internal, external, and practical marks for students
5. Click "Save Marks"

### Step 2: Mark Attendance
1. Go to **Mark Attendance** tab
2. Select subject and date
3. Mark present/absent for students
4. Click "Save Attendance"
5. Repeat for multiple days (attendance % is auto-calculated)

### Step 3: View Risk Analysis
1. Go to **At-Risk Student** tab
2. Select a subject (if not already selected)
3. Review:
   - Summary cards showing student counts
   - Doughnut chart of risk distribution
   - Detailed table with all student data

### Step 4: Filter & Sort
- **Sort By**: Choose how to organize students
  - By Risk Level (High → Medium → Low)
  - By Name (A-Z)
  - By Attendance (Highest first)
  - By Marks (Highest first)

- **Filter By Risk**: Show only students in specific risk category
  - High Risk students need immediate attention
  - Medium Risk students need monitoring
  - Low Risk students are performing well

---

## 📊 Data Calculation

### Attendance Calculation
```javascript
Attendance % = (classesAttended / classesHeld) * 100
```

### Total Marks Calculation
```javascript
Total Marks = InternalMarks + ExternalMarks + PracticalMarks
```

### Risk Level Calculation
```javascript
if (attendance < 60 || totalMarks < 35) → High Risk
else if ((attendance >= 60 && attendance < 75) || (totalMarks >= 35 && totalMarks < 50)) → Medium Risk
else if (attendance >= 75 && totalMarks >= 50) → Low Risk
```

---

## 🎯 Use Cases

### Identifying Struggling Students
- Filter by "High Risk Only" to see students needing immediate intervention
- High Risk students have either:
  - Poor attendance (< 60%) → May need counseling/motivation
  - Low marks (< 35) → May need academic support

### Monitoring Progress
- Use the summary cards to track changes over time
- Doughnut chart shows overall class health at a glance

### Targeted Support
- Medium Risk students (yellow) are at a critical threshold
- Additional study sessions or extra coaching can push them to Low Risk
- Mark them for special attention

### Class Analytics
- See distribution of student performance
- Identify if majority are struggling (redesign teaching)
- Identify if all students are doing well (maintain approach)

---

## 🔧 Customization

### To Change Risk Thresholds

**Backend:** [server/src/utils/riskAnalysis.js](server/src/utils/riskAnalysis.js)
```javascript
export const getRiskLevel = (attendance, marks) => {
  // Modify these values:
  if (att < 60 || totalMarks < 35) {  // ← CHANGE THESE
    return "High";
  }
  // ... etc
};
```

**Frontend:** [frontend/src/utils/riskAnalysis.js](frontend/src/utils/riskAnalysis.js)
```javascript
// Same function - keep in sync!
```

### To Change Colors

**Backend (for API responses):**
```javascript
export const getRiskColor = (riskLevel) => {
  const colors = {
    High: { chart: "#ef4444" },    // ← CHANGE THIS
    Medium: { chart: "#eab308" },
    Low: { chart: "#22c55e" }
  };
};
```

**Frontend (for UI):**
```javascript
export const getChartColors = {
  High: "#ef4444",    // ← CHANGE THIS
  Medium: "#eab308",
  Low: "#22c55e"
};
```

---

## 📈 Future Enhancements

- [ ] Historical trend analysis (risk changes over time)
- [ ] Automated alerts for high-risk students
- [ ] Parent/Guardian notifications
- [ ] Intervention recommendations AI
- [ ] Export reports (PDF, Excel)
- [ ] Peer comparison analytics
- [ ] Subject-wise performance comparison

---

## 🐛 Troubleshooting

### No Students Showing?
1. ✅ Verify marks have been uploaded in "Upload Marks" tab
2. ✅ Verify attendance has been marked in "Mark Attendance" tab
3. ✅ Select the correct subject and semester
4. ✅ Check browser console (F12) for errors

### Chart Not Displaying?
1. ✅ Ensure Chart.js is installed: `npm install chart.js react-chartjs-2`
2. ✅ Hard refresh browser (Ctrl+Shift+R)
3. ✅ Check console for errors

### Attendance Showing 0%?
1. ✅ Attendance is calculated from attendance records
2. ✅ Go to "Mark Attendance" tab and mark students present
3. ✅ Attendance % updates automatically after marking

---

## ✅ Testing Checklist

- [ ] Select a subject with student data
- [ ] Verify summary cards show correct counts
- [ ] Verify chart displays with correct data
- [ ] Click "Sort By" options - table should update
- [ ] Click "Filter By Risk" - table should filter correctly
- [ ] Hover over table rows - background should change
- [ ] Risk badges show correct color (Red/Yellow/Green)
- [ ] No console errors in browser DevTools

---

**Version:** 1.0  
**Last Updated:** April 28, 2026  
**Status:** ✅ Production Ready
