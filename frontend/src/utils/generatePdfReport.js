import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateAcademicReportPDF = async (studentData, subjects) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // Helper function to add text with wrapping
  const addWrappedText = (text, x, y, maxWidth, fontSize = 10) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * 5;
  };

  // Helper function for section headers
  const addSectionHeader = (title, y) => {
    doc.setFillColor(41, 128, 185); // Blue background
    doc.rect(10, y - 3, pageWidth - 20, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(title, 15, y + 2);
    doc.setTextColor(0, 0, 0);
    return y + 12;
  };

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredSpace) => {
    if (yPosition + requiredSpace > pageHeight - 10) {
      doc.addPage();
      yPosition = 15;
    }
  };

  // ========== HEADER SECTION ==========
  doc.setFillColor(30, 58, 138); // Dark blue
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('ACADEMIC PERFORMANCE REPORT', pageWidth / 2, 12, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 20, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  yPosition = 35;

  // ========== STUDENT INFORMATION SECTION ==========
  yPosition = addSectionHeader('STUDENT INFORMATION', yPosition);
  checkPageBreak(30);

  doc.setFontSize(10);
  const infoData = [
    ['Full Name:', studentData?.fullName || 'N/A'],
    ['Email:', studentData?.email || 'N/A'],
    ['Enrollment ID:', studentData?.enrollmentId || 'N/A'],
    ['Semester:', studentData?.semester || 'N/A']
  ];

  infoData.forEach(([label, value]) => {
    doc.setFont(undefined, 'bold');
    doc.text(label, 15, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(String(value || 'N/A'), 60, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // ========== CALCULATE STATISTICS ==========
  const calculateStats = () => {
    if (!subjects || subjects.length === 0) {
      return {
        avgAttendance: 0,
        avgMarks: 0,
        totalSubjects: 0,
        strongSubjects: 0,
        weakSubjects: 0
      };
    }

    const totalAttendance = subjects.reduce((sum, s) => sum + (s.attendance || 0), 0);
    const avgAttendance = parseFloat((totalAttendance / subjects.length).toFixed(2));

    const totalMarks = subjects.reduce((sum, s) => {
      const marks = ((s.internalMarks || 0) + (s.externalMarks || 0) + (s.Practical || 0)) / 130 * 100;
      return sum + marks;
    }, 0);
    const avgMarks = parseFloat((totalMarks / subjects.length).toFixed(2));

    const strongSubjects = subjects.filter(s => {
      const marks = ((s.internalMarks || 0) + (s.externalMarks || 0) + (s.Practical || 0)) / 130 * 100;
      return marks >= 70;
    }).length;

    const weakSubjects = subjects.filter(s => {
      const marks = ((s.internalMarks || 0) + (s.externalMarks || 0) + (s.Practical || 0)) / 130 * 100;
      return marks < 60;
    }).length;

    return {
      avgAttendance,
      avgMarks,
      totalSubjects: subjects.length,
      strongSubjects,
      weakSubjects
    };
  };

  const stats = calculateStats();

  // ========== SUMMARY STATISTICS ==========
  yPosition = addSectionHeader('SUMMARY STATISTICS', yPosition);
  checkPageBreak(35);

  const statsData = [
    ['Average Attendance:', `${stats.avgAttendance}%`],
    ['Average Marks:', `${stats.avgMarks}%`],
    ['Total Subjects:', `${stats.totalSubjects}`],
    ['Strong Subjects (>=70%):', `${stats.strongSubjects}`],
    ['Weak Subjects (<60%):', `${stats.weakSubjects}`]
  ];

  statsData.forEach(([label, value]) => {
    doc.setFont(undefined, 'bold');
    doc.text(label, 11, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(String(value), 95, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // ========== ATTENDANCE DETAILS ==========
yPosition = addSectionHeader('ATTENDANCE DETAILS', yPosition);
checkPageBreak(50);

// Attendance table
const attendanceHeaders = [
  'Subject',
  'Code',
  'Attendance %',
  'Classes Held',
  'Classes Attended'
];

const attendanceData = subjects.map(subject => [
  (subject.subject?.subjectName ||
   subject.subjectName ||
   'Unknown').substring(0, 18),

  subject.subject?.subjectCode ||
  subject.subjectCode ||
  'N/A',

  `${subject.attendance || 0}%`,

  String(subject.classesHeld || 0),

  String(subject.classesAttended || 0)
]);

doc.setFontSize(9);
doc.setFont(undefined, 'bold');
doc.setTextColor(0, 0, 0);

let cellX = 10;

// Wider table
const colWidths = [48, 24, 28, 30, 40];

// HEADER
doc.setTextColor(0,0,0);
doc.setFont(undefined,'bold');

attendanceHeaders.forEach((header, i) => {

  // NO RECT HERE

  doc.text(
    header,
    cellX + 2,
    yPosition + 2,
    {
      maxWidth: colWidths[i] - 4
    }
  );

  cellX += colWidths[i];
});

yPosition += 8;

doc.setFont(undefined, 'normal');
doc.setFontSize(8);

// DATA ROWS
attendanceData.forEach((row, rowIdx) => {

  checkPageBreak(10);

  cellX = 10;

  // Light zebra striping
  const bgColor =
    rowIdx % 2 === 0
      ? 248
      : 255;

  doc.setFillColor(
    bgColor,
    bgColor,
    bgColor
  );

  // Full row background
  doc.rect(
    10,
    yPosition - 3,
    pageWidth - 20,
    7,
    'F'
  );

  row.forEach((cell, colIdx) => {

    doc.text(
      String(cell),
      cellX + 2,
      yPosition + 2,
      {
        maxWidth:
          colWidths[colIdx] - 4
      }
    );

    cellX += colWidths[colIdx];

  });

  yPosition += 7;

});

yPosition += 8;

  // ========== MARKS DETAILS ==========
  yPosition = addSectionHeader('MARKS DETAILS', yPosition);
  checkPageBreak(50);

  const calculateGrade = (totalMarks) => {
    const percentage = (totalMarks / 130) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  const marksHeaders = ['Subject', 'Code', 'Internal', 'External', 'Practical', 'Total', 'Grade'];
  const marksDataRows = subjects.map(subject => [
    (subject.subject?.subjectName || subject.subjectName || 'Unknown').substring(0, 12),
    subject.subject?.subjectCode || subject.subjectCode || 'N/A',
    subject.internalMarks || 0,
    subject.externalMarks || 0,
    subject.Practical || 0,
    subject.totalMarks || 0,
    calculateGrade(subject.totalMarks || 0)
  ]);

  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  
  let marksX = 10;
const marksColWidths = [28, 20, 20, 20, 20, 20, 18];

doc.setFont(undefined, 'bold');
doc.setTextColor(0, 0, 0);

// Header (NO RECTANGLE FILL)
marksHeaders.forEach((header, i) => {

  doc.text(
    header,
    marksX + 2,
    yPosition + 2,
    {
      maxWidth: marksColWidths[i] - 4
    }
  );

  marksX += marksColWidths[i];

});

yPosition += 8;

doc.setFont(undefined, 'normal');

// Data rows
marksDataRows.forEach((row, rowIdx) => {

  checkPageBreak(8);

  marksX = 10;

  const bgColor =
    rowIdx % 2 === 0
      ? 248
      : 255;

  doc.setFillColor(
    bgColor,
    bgColor,
    bgColor
  );

  doc.rect(
    10,
    yPosition - 3,
    pageWidth - 20,
    7,
    'F'
  );

  row.forEach((cell, colIdx) => {

    doc.text(
      String(cell ?? ''),
      marksX + 2,
      yPosition + 2,
      {
        maxWidth:
          marksColWidths[colIdx] - 4
      }
    );

    marksX += marksColWidths[colIdx];

  });

  yPosition += 7;

});

yPosition += 10;

  // ========== FOOTER ==========
  checkPageBreak(20);
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('This is an automated report generated by the Student Risk Analysis System.', pageWidth / 2, pageHeight - 10, { align: 'center' });
  const totalPages = doc.internal.pages.length - 1;
  doc.text(`Page 1 of ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: 'center' });

  // Save the PDF
  const fileName = `Academic_Report_${studentData?.enrollmentId || 'Student'}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};

export const generatePdfFromHTML = async (elementId, filename) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found');
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const doc = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    const imgData = canvas.toDataURL('image/png');

    while (heightLeft >= 0) {
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      if (heightLeft > 0) {
        doc.addPage();
        position = heightLeft - imgHeight;
      }
    }

    doc.save(filename || 'report.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const generateFacultyStudentReportPDF = async (facultyData, selectedSubject, students) => {
  console.log("📋 PDF Generation Started")
  
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // Helper function for page breaks
  const checkPageBreak = (requiredSpace) => {
    if (yPosition + requiredSpace > pageHeight - 10) {
      doc.addPage();
      yPosition = 15;
    }
  };

  // Helper function for section headers
  const addSectionHeader = (title, y) => {
    doc.setFillColor(41, 128, 185); // Blue background
    doc.rect(10, y - 3, pageWidth - 20, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(title, 15, y + 2);
    doc.setTextColor(0, 0, 0);
    return y + 12;
  };

  // ========== HEADER SECTION ==========
  doc.setFillColor(30, 58, 138); // Dark blue
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('FACULTY STUDENT PERFORMANCE REPORT', pageWidth / 2, 12, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 20, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  yPosition = 35;

  // ========== FACULTY & SUBJECT INFORMATION ==========
  yPosition = addSectionHeader('FACULTY & SUBJECT INFORMATION', yPosition);
  checkPageBreak(35);

  doc.setFontSize(10);
  const headerData = [
    ['Faculty Name:', facultyData?.fullName || 'N/A'],
    ['Email:', facultyData?.email || 'N/A'],
    ['Subject:', selectedSubject?.subjectName || 'N/A'],
    ['Subject Code:', selectedSubject?.subjectCode || 'N/A'],
    ['Semester:', selectedSubject?.semester || 'N/A']
  ];

  headerData.forEach(([label, value]) => {
    doc.setFont(undefined, 'bold');
    doc.text(label, 15, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(String(value || 'N/A'), 60, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // ========== SUMMARY STATISTICS ==========
  if (students && students.length > 0) {
    console.log("📊 Generating summary for students:", students.length);

    yPosition = addSectionHeader('CLASS SUMMARY', yPosition);
    checkPageBreak(30);

    const summary = {
      total: students.length,
      highRisk: students.filter(s => s.riskLevel?.includes('High')).length,
      mediumRisk: students.filter(s => s.riskLevel?.includes('Medium')).length,
      lowRisk: students.filter(s => s.riskLevel?.includes('Low')).length,
      avgAttendance: (students.reduce((sum, s) => sum + (parseFloat(s.attendance) || 0), 0) / students.length).toFixed(2),
      avgMarks: (students.reduce((sum, s) => sum + (parseFloat(s.totalMarks) || 0), 0) / students.length).toFixed(2)
    };

    doc.setFontSize(10);
    const summaryData = [
      ['Total Students:', String(summary.total)],
      ['High Risk:', String(summary.highRisk)],
      ['Medium Risk:', String(summary.mediumRisk)],
      ['Low Risk:', String(summary.lowRisk)],
      ['Average Attendance:', `${summary.avgAttendance}%`],
      ['Average Marks:', `${summary.avgMarks}/130`]
    ];

    summaryData.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, 15, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(value, 90, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // ========== STUDENT DETAILS TABLE ==========
    yPosition = addSectionHeader('STUDENT PERFORMANCE DETAILS', yPosition);
    checkPageBreak(50);

    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');

    const headers = ['Student Name', 'Enrollment ID', 'Attendence %', 'Internal', 'External', 'Total', 'Risk'];
    const colWidths = [38, 28, 25, 18, 18, 18, 22];

    let headerX = 10;
    doc.setFillColor(255, 255, 255); // pure white
doc.setDrawColor(200, 200, 200); // border color
doc.setTextColor(0, 0, 0); // black text

headers.forEach((header, i) => {
  doc.text(
    header,
    headerX + 2,
    yPosition + 2,
    { maxWidth: colWidths[i] - 4 }
  );

  headerX += colWidths[i];
});

    yPosition += 8;
    doc.setFont(undefined, 'normal');

    // Student rows
    if (students.length > 0) {
      students.forEach((student, rowIdx) => {
        checkPageBreak(8);
        
        let cellX = 10;
        const bgColor = rowIdx % 2 === 0 ? 248 : 255;
        doc.setFillColor(bgColor, bgColor, bgColor);
        doc.rect(10, yPosition - 3, pageWidth - 20, 7, 'F');

        const getRiskColor = (risk) => {
          if (risk?.includes('High')) return 'High';
          if (risk?.includes('Medium')) return 'Medium';
          return 'Low';
        };

        // Get values with defaults
        const studentName = String(student.name || student.fullName || 'N/A').substring(0, 25);
        const enrollmentId = String(student.enrollmentId || student.enrollmentno || 'N/A');
        const attendance = String(student.attendance || 0);
        const internalMarks = String(student.internalMarks || student.internal || 0);
        const externalMarks = String(student.externalMarks || student.external || 0);
        const totalMarks = String(student.totalMarks || (parseFloat(student.internalMarks || 0) + parseFloat(student.externalMarks || 0)) || 0);
        const riskLevel = getRiskColor(student.riskLevel);

        const rowData = [
          studentName,
          enrollmentId,
          attendance,
          internalMarks,
          externalMarks,
          totalMarks,
          riskLevel
        ];

        rowData.forEach((cell, colIdx) => {
          doc.setFontSize(8);
          doc.text(String(cell !== null && cell !== undefined ? cell : ''), cellX + 2, yPosition + 2, { maxWidth: colWidths[colIdx] - 4 });
          cellX += colWidths[colIdx];
        });

        yPosition += 7;
      });
    }
  } else {
    yPosition += 20;
    doc.setFontSize(10);
    doc.text('No student data available', pageWidth / 2, yPosition, { align: 'center' });
  }

  yPosition += 10;

  // ========== FOOTER ==========
  checkPageBreak(20);
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('This is an automated report generated by the Student Risk Analysis System.', pageWidth / 2, pageHeight - 10, { align: 'center' });
  const totalPages = doc.internal.pages.length - 1;
  doc.text(`Page 1 of ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: 'center' });

  // Save the PDF
  const fileName = `Faculty_Report_${selectedSubject?.subjectCode || 'Subject'}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};
