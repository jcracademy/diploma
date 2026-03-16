
function downloadRolls() {
    if (currentStudents.length === 0) {
        Swal.fire("ডেটা নেই", "প্রথমে সার্চ করে লিস্ট লোড করুন।", "warning");
        return;
    }

    const data = currentStudents.map(function(s) {
        return { "SL No": s.sl, "Roll No": s.roll };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Roll_List");

    const subCode = document.getElementById("subDisplayCode").innerText || "Export";
    XLSX.writeFile(wb, subCode + "_Rolls.xlsx");
}

function downloadSeatLabels() {
    if (currentStudents.length === 0) {
        Swal.fire("ডেটা নেই", "প্রথমে সার্চ করে লিস্ট লোড করুন।", "warning");
        return;
    }

    Swal.fire({
        title: 'Excel ফাইল তৈরি হচ্ছে...',
        didOpen: function() { Swal.showLoading(); }
    });

    const rows = [];
    const centerName = "Pirgonj Govt. Technical School And College";
    const examTitle = "Diploma in Engineering Examination 2026";

    for (let i = 0; i < currentStudents.length; i += 3) {
        const s1 = currentStudents[i] || { dept: "", roll: "" };
        const s2 = currentStudents[i + 1] || { dept: "", roll: "" };
        const s3 = currentStudents[i + 2] || { dept: "", roll: "" };

        rows.push({ "Col 1": centerName, "Col 2": centerName, "Col 3": centerName });
        rows.push({ "Col 1": examTitle, "Col 2": examTitle, "Col 3": examTitle });
        rows.push({ 
            "Col 1": s1.dept ? "(" + s1.dept + ")" : "", 
            "Col 2": s2.dept ? "(" + s2.dept + ")" : "", 
            "Col 3": s3.dept ? "(" + s3.dept + ")" : "" 
        });
        rows.push({ 
            "Col 1": "Regular - " + s1.roll, 
            "Col 2": "Regular - " + s2.roll, 
            "Col 3": "Regular - " + s3.roll 
        });
        rows.push({ "Col 1": "", "Col 2": "", "Col 3": "" });
    }

    const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true });
    ws['!cols'] = [{ wch: 35 }, { wch: 35 }, { wch: 35 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Seat_Labels");

    const subCode = document.getElementById("subDisplayCode").innerText || "Export";
    XLSX.writeFile(wb, subCode + "_Seat_Labels.xlsx");

    Swal.close();
    Swal.fire("সফল!", "Excel ফাইলটি ডাউনলোড হয়েছে।", "success");
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
    const pracSemesters = new Set([1, 2, 4, 6]); 

    const practicalExaminees = currentStudents.filter(stu => {
        const currentSemi = (stu.semi || "").toString().trim();
        const semiNumber = parseInt(currentSemi);
        if (!pracSemesters.has(semiNumber)) return false;

        const syllabus = (stu.syllabus || "").toString().trim();
        const techCode = stu.dept?.toString().trim().match(/\d+/)?.[0] || "";
        const studentSubList = stu.subcodes ? stu.subcodes.toString().split(',').map(c => c.trim()) : [];

        let requiredCount = 0;
        const currentSemiSubsOnly = studentSubList.filter(code => {
            const subInfo = allSubjectsData.find(sub => 
                sub.code === code && 
                sub.deptCode === techCode && 
                sub.semi === currentSemi &&
                sub.syllabus.toString().trim() === syllabus
            );
            
            if (subInfo && requiredCount < 1) { requiredCount = parseInt(subInfo.nos);}
            return subInfo;
        });
        return currentSemiSubsOnly.length >= requiredCount && requiredCount > 0;
    });

    if (practicalExaminees.length > 0) {
        currentStudents = practicalExaminees;
        renderTable(practicalExaminees);
        document.getElementById("subDisplayCode").innerText = "Practical List";
        Swal.fire("সফল!", `মোট ${currentStudents.length} জন ব্যবহারিক পরীক্ষার্থী পাওয়া গেছে।`, "success");
    } else {
        Swal.fire("দুঃখিত", "কোনো ব্যবহারিক পরীক্ষার্থী পাওয়া যায়নি।", "info");
    }
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
