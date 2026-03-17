
async function downloadRolls() {
    // ১. চেক করা হচ্ছে ডাটা আছে কি না
    if (currentStudents.length === 0) {
        Swal.fire("ডেটা নেই", "প্রথমে সার্চ করে স্টুডেন্ট লিস্ট লোড করুন।", "warning");
        return;
    }

    // ২. লোডিং এনিমেশন
    Swal.fire({
        title: 'Excel ফাইল তৈরি হচ্ছে...',
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Roll List');

        // ৩. হেডার কলাম তৈরি এবং ডিজাইন (SL এবং Roll)
        worksheet.columns = [
            { header: 'SL No', key: 'sl', width: 10 },
            { header: 'Roll Number', key: 'roll', width: 20 }
        ];

        // হেডারের স্টাইল (বোল্ড এবং ব্যাকগ্রাউন্ড কালার)
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4F81BD' } // নীল রঙের হেডার
        };
        worksheet.getRow(1).alignment = { horizontal: 'center' };

        // ৪. ডাটা ইনসার্ট করা
        currentStudents.forEach((student, index) => {
            const row = worksheet.addRow({
                sl: student.sl || (index + 1), // যদি sl না থাকে তবে ইনডেক্স ব্যবহার করবে
                roll: student.roll
            });

            // ডাটা এলাইনমেন্ট (সেন্টার)
            row.alignment = { horizontal: 'center' };
            
            // বর্ডার দেওয়া (ঐচ্ছিক)
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        // ৫. ফাইল তৈরি এবং ডাউনলোড
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        // ফাইলের নাম নির্ধারণ (Subject Code থাকলে সেটা দিয়ে হবে)
        const subCode = document.getElementById("subDisplayCode").innerText || "Roll_List";
        a.href = url;
        a.download = `Roll_List_${subCode}.xlsx`;
        a.click();
        
        window.URL.revokeObjectURL(url);
        Swal.close();
        Swal.fire("সফল!", "SL এবং Roll লিস্ট ডাউনলোড হয়েছে।", "success");

    } catch (error) {
        console.error(error);
        Swal.fire("Error", "ফাইল তৈরি করতে সমস্যা হয়েছে।", "error");
    }
}

async function downloadSeatLabels() {
    if (currentStudents.length === 0) {
        Swal.fire("ডেটা নেই", "প্রথমে সার্চ করে লিস্ট লোড করুন।", "warning");
        return;
    }

    Swal.fire({
        title: 'Excel ফাইল তৈরি হচ্ছে...',
        didOpen: () => { Swal.showLoading(); }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Seat Labels');

    const centerName = "Pirgonj Govt. Technical School & College";
    const examTitle = "Diploma in Engineering Examination 2026";

    // কলামের প্রশস্ততা সেট করা
    worksheet.columns = [
        { width: 18 }, { width: 20 }, { width: 3 }, { width: 18 }, { width: 20 }, { width: 3 }, { width: 18 }, { width: 20}              
    ];

    let currentRow = 1;

    for (let i = 0; i < currentStudents.length; i += 3) {
        const students = [ currentStudents[i], currentStudents[i + 1], currentStudents[i + 2] ];

        const row1 = worksheet.getRow(currentRow);
        const row2 = worksheet.getRow(currentRow + 1);
        const row3 = worksheet.getRow(currentRow + 2);
        const row4 = worksheet.getRow(currentRow + 3);

        students.forEach((student, index) => {
            if (!student) return;

            const startCol = index * 3 + 1; // ১ম কার্ড ১ থেকে, ২য় কার্ড ৪ থেকে...

            // ক. সেন্টার নেম (Merge & Center)
            worksheet.mergeCells(currentRow, startCol, currentRow, startCol + 1);
            const cellTitle = worksheet.getCell(currentRow, startCol);
            cellTitle.value = centerName;
            cellTitle.font = { size: 10, bold: true };
            cellTitle.alignment = { vertical: 'middle', horizontal: 'center' };

            // খ. এক্সাম টাইটেল (Merge & Center)
            worksheet.mergeCells(currentRow + 1, startCol, currentRow + 1, startCol + 1);
            const cellExam = worksheet.getCell(currentRow + 1, startCol);
            cellExam.value = examTitle;
            cellExam.font = { size: 11, bold: true };
            cellExam.alignment = { vertical: 'middle', horizontal: 'center' };

            // গ. ডিপার্টমেন্ট (Left Box)
            const cellDept = worksheet.getCell(currentRow + 2, startCol);
            cellDept.value = `(${student.dept || '64'}) Civil`;
            cellDept.font = { size: 10 };
            cellDept.alignment = { vertical: 'middle', horizontal: 'center' };

            // ঘ. রেগুলার স্ট্যাটাস (Bottom Left Box)
            const cellStatus = worksheet.getCell(currentRow + 3, startCol);
            cellStatus.value = "Regular";
            cellStatus.font = { size: 10 };
            cellStatus.alignment = { vertical: 'middle', horizontal: 'center' };

            // ঙ. রোল নাম্বার (Right Large Box)
            worksheet.mergeCells(currentRow + 2, startCol + 1, currentRow + 3, startCol + 1);
            const cellRoll = worksheet.getCell(currentRow + 2, startCol + 1);
            cellRoll.value = student.roll;
            cellRoll.font = { size: 24, bold: true };
            cellRoll.alignment = { vertical: 'middle', horizontal: 'center' };

            // চ. বর্ডার সেট করা
            for (let r = 0; r <= 3; r++) {
                for (let c = 0; c <= 1; c++) {
                    worksheet.getCell(currentRow + r, startCol + c).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            }
        });

        currentRow += 5; 
    }

    // ফাইল ডাউনলোড
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    const subCode = document.getElementById("subDisplayCode")?.innerText || "Export";
    anchor.download = `${subCode}_Seat_Labels.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);

    Swal.close();
    Swal.fire("সফল!", "Excel ফাইলটি তৈরি হয়েছে।", "success");
}

function downloadRoutine() {
    if (!routineData || Object.keys(routineData).length === 0) {
        Swal.fire("ডেটা নেই", "রুটিন ডাটা লোড হয়নি!", "info");
        return;
    }

    const reportData = [];
    Object.keys(routineData).sort().forEach(date => {
        const exams = routineData[date];
        exams.forEach(ex => {
            reportData.push({
                "Date": date + "-03-2026",
                "Shift": ex.time,
                "Subject Code": ex.subjectCode,
                "Examinee Count": ex.examineeNos
            });
        });
    });

    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Exam_Routine");
    ws['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 }];

    XLSX.writeFile(wb, "Diploma_Exam_Routine_2026.xlsx");
}


function downloadQuestionCountPDF() {
    Swal.fire({title: 'প্রসেসিং হচ্ছে...', html: 'সার্ভার থেকে সকল ডাটা সংগ্রহ করা হচ্ছে।', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }
    });

    fetch(API_URL + "?action=specificSearch")
        .then(response => response.json())
        .then(res => {
            const allStudents = res.students;
            if (!allStudents || allStudents.length === 0) {
                Swal.fire("Error", "No student data found.", "error");
                throw new Error("No student data");
            }

            // সকল শিক্ষার্থীর ডাটা থেকে ইউনিক সাবজেক্ট কোডগুলো বের করা
            const uniqueSubjectCodes = new Set();
            allStudents.forEach(s => {
                if (s.subcodes) {s.subcodes.toString().split(',').forEach(c => uniqueSubjectCodes.add(c.trim())); }
            });

            // এইবার বিষয় কোড গুলো Sort করা যাতে pdf এ subject code গুলো ascending order এ আসে
            const sortedCodes = Array.from(uniqueSubjectCodes).sort();

            const summaryRows = [];
            let sl = 1;

            sortedCodes.forEach(targetCode => {
                let totalExaminees = 0;
                let subjectName = "Not Found";

                allStudents.forEach(s => {
                    const studentSubList = s.subcodes ? s.subcodes.toString().split(',').map(c => c.trim()) : [];

                    if (studentSubList.includes(targetCode)) {
                        totalExaminees++;
                        if (subjectName === "Not Found") {
                            const techCode = s.dept.toString().trim().match(/\d+/);
                            const foundSub = allSubjectsData.find(sub => sub.code === targetCode && sub.deptCode === techCode);
                            if (foundSub) { subjectName = foundSub.name;
                            } else {
                                const fallbackSub = allSubjectsData.find(sub => sub.code === targetCode);
                                if (fallbackSub) subjectName = fallbackSub.name;
                            }
                        }
                    }
                });

                if (totalExaminees > 0) {
                    summaryRows.push([sl++, targetCode, subjectName, totalExaminees]);
                }
            });

            // PDF জেনারেশন
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.setFontSize(12);
            doc.text("Question Count", doc.internal.pageSize.getWidth()/2, 15, {align:"center"});
            doc.text("Center: Pirganj Govt. Technical School & College, Thakurgaon", doc.internal.pageSize.getWidth()/2, 22, {align:"center"});

            doc.autoTable({
                startY: 25,
                head: [['SL', 'Subject Code', 'Subject Name', 'Total Examinees']],
                headStyles: { fillColor: [30, 58, 95] },
                body: summaryRows,
                styles: {
                    fontSize: 8,        // font ছোট
                    cellPadding: 1.5,     // padding কম
                    minCellHeight: 6    // row height কম
                },
                theme: 'grid',
                columnStyles: {
                    0: { cellWidth: 15 },
                    1: { cellWidth: 35 },
                    2: { cellWidth: 100 },
                    3: { cellWidth: 35, halign: 'center', fontStyle: 'bold' }
                }
            });

            Swal.close();
            doc.save(`Global_Question_Count.pdf`);
        })
        .catch(error => {
            console.error(error);
            Swal.fire("Error", "ডাটা প্রসেস করতে সমস্যা হয়েছে।", "error");
        });
}

function showPracticalExamineesTable() {
    const practicalExaminees = getPracticalExaminees(currentStudents)

    if (practicalExaminees.length > 0) {
        renderTable(practicalExaminees);
        document.getElementById("subDisplayCode").innerText = "Practical List";

        Swal.fire("সফল!", `মোট ${practicalExaminees.length} জন ব্যবহারিক পরীক্ষার্থী পাওয়া গেছে।`, "success");

    } else {Swal.fire("দুঃখিত", "কোনো ব্যবহারিক পরীক্ষার্থী পাওয়া যায়নি।", "info");}
}

function getPracticalExaminees(studentsList) {
    const pracSemesters = new Set([1, 2, 4, 6]); 
    const practicalExaminees = studentsList.filter(stu => {

        const currentSemi = (stu.semi || "").toString().trim();
        const semiNumber = parseInt(currentSemi);
        if (!pracSemesters.has(semiNumber)) return false;

        const techCode = stu.dept?.toString().trim().match(/\d+/)?.[0] || "";
        const studentSubList = stu.subcodes ? stu.subcodes.toString().split(',').map(c => c.trim()) : [];

        let semiSubNos = 0;
        const currentSemiSubCount = studentSubList.filter(code => {
            const subInfo = allSubjectsData.find(sub => sub.code === code &&   sub.deptCode === techCode &&  sub.semi === currentSemi);     
            if (subInfo && semiSubNos < 1) { semiSubNos = parseInt(subInfo.nos);}
            return subInfo;
        });
        return currentSemiSubCount.length >= semiSubNos && semiSubNos > 0;
    });
    return practicalExaminees.length? practicalExaminees : [];
}


function downloadAttendanceSheet() {
    const driveLink = "https://docs.google.com/spreadsheets/d/1Nf2NTlg5BGwWfzRiNz1jmPn88vRzd-1Jgcz8z2euDMI/edit?usp=sharing";
    Swal.fire({
        title: '<strong>Attendance Sheet Template</strong>',
        icon: 'info',
        html: `গুগল ড্রাইভ থেকে ফাইলটি .xlsm ফরম্যাটে ডাউনলোড করে ম্যাক্রো এনাবল করুন।`,
        showCancelButton: true,
        confirmButtonText: 'Open Drive File',
        confirmButtonColor: '#1e3a5f'
    }).then((result) => {
        if (result.isConfirmed) { window.open(driveLink, '_blank'); }
    });
}
