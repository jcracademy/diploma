function downloadRolls() {
    if (currentStudents.length === 0) {
        Swal.fire("ডেটা নেই", "প্রথমে সার্চ করে স্টুডেন্ট লিস্ট লোড করুন।", "warning");
        return;
    }
    Swal.fire({ title: 'Excel ফাইল তৈরি হচ্ছে...', didOpen: () => { Swal.showLoading(); } });

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Roll List');

        // Column Header Set
        worksheet.columns = [
            { header: 'Code', key: 'code', width: 15 }, { header: 'Nos', key: 'nos', width: 10 },
            { header: 'SL No', key: 'sl', width: 12 }, { header: 'Roll Number', key: 'roll', width: 20 }
        ];

        // Header Design
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
        headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } };
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

        const subCode = document.getElementById("subDisplayCode").innerText || "N/A";
        const totalExaminees = currentStudents.length;

        // Data Insert
        currentStudents.forEach((student, index) => {
            const rowData = { sl: student.sl || (index + 1), roll: student.roll };
            // rowData (Object) এর code & nos key তে কেবলমাত্র শুরুতে value যুক্ত হবে, পরে আর নয়... 
            if (index === 0) { rowData.code = subCode; rowData.nos = totalExaminees; }
            const row = worksheet.addRow(rowData);
            // Alignment & Border Set
            row.eachCell((cell, colNumber) => {
                cell.alignment = { horizontal: 'center' };
                cell.border = {  top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }  };
            });
        });

        workbook.xlsx.writeBuffer()
            .then(function (buffer) {
                const blob = new Blob([buffer], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Roll_List_${subCode}.xlsx`;
                a.click();

                window.URL.revokeObjectURL(url);
                Swal.close();
                Swal.fire("সফল!", "এক্সেল ফাইলটি তৈরি হয়েছে।", "success");
            })
            .catch(function (error) {
                console.error(error);
                Swal.fire("Error", "ফাইল তৈরি করতে সমস্যা হয়েছে।", "error");
            });
    } catch (error) {
        console.error(error); Swal.fire("Error", "সিস্টেম এরর!", "error");
    }
}


function downloadSeatLabels() {
    if (currentStudents.length === 0) {
        Swal.fire("ডেটা নেই", "প্রথমে সার্চ করে স্টুডেন্ট লিস্ট লোড করুন।", "warning");
        return;
    }
    Swal.fire({ title: 'Excel ফাইল তৈরি হচ্ছে...',  didOpen: () => { Swal.showLoading(); } });

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Seat Labels');

        const centerName = "Pirgonj Govt. Technical School & College";
        const examTitle = "Diploma in Engineering Examination 2026";

        // কলামের প্রশস্ততা সেট করা
        worksheet.columns = [ { width: 18 }, { width: 20 }, { width: 3 },  { width: 18 }, 
            { width: 20 }, { width: 3 },  { width: 18 }, { width: 20 }
        ];

        let currentRow = 1;

        for (let i = 0; i < currentStudents.length; i += 3) {
            const students = [currentStudents[i], currentStudents[i + 1], currentStudents[i + 2]];

            students.forEach((student, index) => {
                if (!student) return;

                const startCol = index * 3 + 1; // ১ম কার্ড ১ থেকে, ২য় কার্ড ৪ থেকে...

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
                // আপনার মূল কোডের লজিক অনুযায়ী (ডিপার্টমেন্ট নাম ডাইনামিক করা ভালো, তবে আমি আপনার কোডটিই রাখলাম)
                cellDept.value = student.dept || "N/A"; 
                cellDept.font = { size: 10 };
                cellDept.alignment = { vertical: 'middle', horizontal: 'center' };

                // ঘ. রেগুলার স্ট্যাটাস (Bottom Left Box)
                const cellStatus = worksheet.getCell(currentRow + 3, startCol);
                cellStatus.value = student.type || "Regular";
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

        // --- Buffer প্রসেস (fetch...then format) ---
        workbook.xlsx.writeBuffer()
            .then(function (buffer) {
                const blob = new Blob([buffer], { 
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                });
                
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                
                const subCode = document.getElementById("subDisplayCode")?.innerText || "Export";
                
                anchor.href = url;
                anchor.download = `${subCode}_Seat_Labels.xlsx`;
                anchor.click();
                
                window.URL.revokeObjectURL(url);

                Swal.close();
                Swal.fire("সফল!", "Seat Labels এক্সেল ফাইলটি তৈরি হয়েছে।", "success");
            })
            .catch(function (error) {
                console.error(error);
                Swal.close();
                Swal.fire("Error", "ফাইলটি তৈরি করতে ইন্টারনাল সমস্যা হয়েছে।", "error");
            });

    } catch (error) {
        console.error(error);
        Swal.fire("Error", "কোড এক্সিকিউশনে সমস্যা হয়েছে!", "error");
    }
}

function downloadRoutine() {
    if (!routineData || Object.keys(routineData).length === 0) {
        Swal.fire("ডেটা নেই", "রুটিন ডাটা লোড হয়নি!", "info");
        return;
    }

    Swal.fire({ title: 'Routine এক্সেল তৈরি হচ্ছে...', didOpen: () => { Swal.showLoading(); } });

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Exam Routine');

        // Column definitions
        worksheet.columns = [
            { header: 'SL', key: 'sl', width: 8 },
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Shift/Time', key: 'time', width: 15 },
            { header: 'Subject Code', key: 'subjectCode', width: 15 },
            { header: 'Examinee Nos', key: 'examineeNos', width: 15 }
        ];

        // Header Design
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
        headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A5F' } }; // Navy Blue
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
        headerRow.height = 25;

        // Flatten data from routineData object and sort by Date then Time (Morning first)
        const flatRoutine = [];
        Object.keys(routineData).sort().forEach(dateKey => {
            const exams = [...routineData[dateKey]];
            // Sort: Morning will come before Evening (M comes before E alphabetically if reversed)
            exams.sort((a, b) => b.time.localeCompare(a.time)); 
            
            exams.forEach(ex => {
                flatRoutine.push({
                    date: dateKey,
                    time: ex.time,
                    subjectCode: ex.subjectCode,
                    examineeNos: ex.examineeNos
                });
            });
        });

        // Insert rows & basic styling
        let slCounter = 1;
        let lastDate = "";
        
        flatRoutine.forEach((item, index) => {
            // SL শুধুমাত্র নতুন তারিখের শুরুতে বাড়বে, মার্জড সেলের জন্য একটাই SL থাকবে
            let currentSL = "";
            if (item.date !== lastDate) {
                currentSL = slCounter++;
                lastDate = item.date;
            }

            const row = worksheet.addRow({
                sl: currentSL,
                date: item.date,
                time: item.time,
                subjectCode: item.subjectCode,
                examineeNos: item.examineeNos
            });

            row.height = 20;
            row.eachCell((cell) => {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' }, left: { style: 'thin' },
                    bottom: { style: 'thin' }, right: { style: 'thin' }
                };
            });
        });

        // --- 🚀 NEW SAFE CELL MERGING LOGIC ---
        const totalRows = flatRoutine.length;
        
        // ১. প্রথমে Date এবং SL কলাম মার্জ করার লজিক
        let i = 0;
        while (i < totalRows) {
            let j = i + 1;
            while (j < totalRows && flatRoutine[i].date === flatRoutine[j].date) {
                j++;
            }
            let matchCount = j - i;
            if (matchCount > 1) {
                let startExcelRow = i + 2; // Data starts from row 2 in Excel
                let endExcelRow = j + 1;
                worksheet.mergeCells(startExcelRow, 1, endExcelRow, 1); // Merge SL
                worksheet.mergeCells(startExcelRow, 2, endExcelRow, 2); // Merge Date
            }
            i = j; // পরের ডেটে জাম্প করবে
        }

        // ২. এবার Time/Shift কলাম মার্জ করার লজিক (একই ডেটের ভেতরের শিফট)
        i = 0;
        while (i < totalRows) {
            let j = i + 1;
            while (j < totalRows && 
                   flatRoutine[i].date === flatRoutine[j].date && 
                   flatRoutine[i].time === flatRoutine[j].time) {
                j++;
            }
            let matchCount = j - i;
            if (matchCount > 1) {
                let startExcelRow = i + 2;
                let endExcelRow = j + 1;
                worksheet.mergeCells(startExcelRow, 3, endExcelRow, 3); // Merge Shift
            }
            i = j; // পরের শিফটে জাম্প করবে
        }

        // Export Buffer to File
        workbook.xlsx.writeBuffer()
            .then(function (buffer) {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = `Diploma_Exam_Routine_2026.xlsx`;
                anchor.click();
                
                window.URL.revokeObjectURL(url);
                Swal.close();
                Swal.fire("সফল!", "রুটিন এক্সেল ফাইলটি সুন্দরভাবে মার্জ হয়ে তৈরি হয়েছে।", "success");
            })
            .catch(function (error) {
                console.error(error);
                Swal.close();
                Swal.fire("Error", "ফাইল তৈরি করতে সমস্যা হয়েছে।", "error");
            });

    } catch (error) {
        console.error(error);
        Swal.close();
        Swal.fire("Error", "সিস্টেম এরর!", "error");
    }
}



function downloadQuestionCountPDF() {
    Swal.fire({
        title: 'Excel ফাইল তৈরি হচ্ছে...',
        html: 'সার্ভার থেকে সকল ডাটা সংগ্রহ করা হচ্ছে।',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
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
                if (s.subcodes) {
                    s.subcodes.toString().split(',').forEach(c => uniqueSubjectCodes.add(c.trim()));
                }
            });

            // বিষয় কোড গুলো Ascending Order-এ Sort করা
            const sortedCodes = Array.from(uniqueSubjectCodes).sort();

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Question Count');

            // Column Header Set (TF ও PF সহ)
            worksheet.columns = [
                { header: 'SL', key: 'sl', width: 10 },
                { header: 'Sub Code', key: 'subCode', width: 15 },
                { header: 'Subject Name', key: 'subName', width: 40 },
                { header: 'Total Examinees', key: 'examinees', width: 18 },
                { header: 'TF', key: 'tf', width: 12 },
                { header: 'PF', key: 'pf', width: 12 }
            ];

            // Header Design (PDF-এর মতো গাঢ় নীল রঙ)
            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
            headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A5F' } }; // #1E3A5F
            headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

            let sl = 1;

            sortedCodes.forEach(targetCode => {
                let totalExaminees = 0;
                let subjectName = "Not Found";
                let tfMark = "-";
                let pfMark = "-";

                allStudents.forEach(s => {
                    const studentSubList = s.subcodes ? s.subcodes.toString().split(',').map(c => c.trim()) : [];

                    if (studentSubList.includes(targetCode)) {
                        totalExaminees++;

                        if (subjectName === "Not Found") {
                            // dept থেকে সংখ্যা এক্সট্রাক্ট করা (যেমন: techCode match)
                            const techMatch = s.dept ? s.dept.toString().trim().match(/\d+/) : null;
                            const techCode = techMatch ? techMatch[0] : null;

                            // ডিপার্টমেন্ট এবং সাবজেক্ট কোড মিলিয়ে ডাটা খোঁজা
                            const foundSub = allSubjectsData.find(sub => sub.code === targetCode && sub.deptCode == techCode);
                            
                            if (foundSub) {
                                subjectName = foundSub.name;
                                tfMark = (foundSub.tf !== undefined && foundSub.tf !== null) ? foundSub.tf : "-";
                                pfMark = (foundSub.pf !== undefined && foundSub.pf !== null) ? foundSub.pf : "-";
                            } else {
                                // ফলব্যাক হিসেবে শুধু বিষয় কোড দিয়ে খোঁজা
                                const fallbackSub = allSubjectsData.find(sub => sub.code === targetCode);
                                if (fallbackSub) {
                                    subjectName = fallbackSub.name;
                                    tfMark = (fallbackSub.tf !== undefined && fallbackSub.tf !== null) ? fallbackSub.tf : "-";
                                    pfMark = (fallbackSub.pf !== undefined && fallbackSub.pf !== null) ? fallbackSub.pf : "-";
                                }
                            }
                        }
                    }
                });

                if (totalExaminees > 0) {
                    const row = worksheet.addRow({
                        sl: sl++,
                        subCode: targetCode,
                        subName: subjectName,
                        examinees: totalExaminees,
                        tf: tfMark,
                        pf: pfMark
                    });

                    // Alignment & Border Set
                    row.eachCell((cell, colNumber) => {
                        cell.alignment = { 
                            horizontal: colNumber === 3 ? 'left' : 'center', 
                            vertical: 'middle' 
                        };
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    });
                }
            });

            // Excel File Generation
            return workbook.xlsx.writeBuffer();
        })
        .then(buffer => {
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Question_Count.xlsx`;
            a.click();

            window.URL.revokeObjectURL(url);
            Swal.close();
            Swal.fire("সফল!", "এক্সেল ফাইলটি তৈরি হয়েছে।", "success");
        })
        .catch(error => {
            console.error(error);
            if (error.message !== "No student data") {
                Swal.fire("Error", "ডাটা প্রসেস করতে সমস্যা হয়েছে।", "error");
            }
        });
}


function downloadQuestionCountPDF2() {
    Swal.fire({
        title: 'প্রসেসিং হচ্ছে...',
        html: 'সার্ভার থেকে সকল ডাটা সংগ্রহ করা হচ্ছে।',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
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
                if (s.subcodes) {
                    s.subcodes.toString().split(',').forEach(c => uniqueSubjectCodes.add(c.trim()));
                }
            });

            // বিষয় কোডগুলো Ascending Order-এ Sort করা
            const sortedCodes = Array.from(uniqueSubjectCodes).sort();

            const summaryRows = [];
            let sl = 1;

            sortedCodes.forEach(targetCode => {
                let totalExaminees = 0;
                let subjectName = "Not Found";
                let tfMark = "-";
                let pfMark = "-";

                allStudents.forEach(s => {
                    const studentSubList = s.subcodes ? s.subcodes.toString().split(',').map(c => c.trim()) : [];

                    if (studentSubList.includes(targetCode)) {
                        totalExaminees++;
                        
                        if (subjectName === "Not Found") {
                            // dept থেকে টেকনিক্যাল কোড বের করা
                            const techMatch = s.dept ? s.dept.toString().trim().match(/\d+/) : null;
                            const techCode = techMatch ? techMatch[0] : null;

                            const foundSub = allSubjectsData.find(sub => sub.code === targetCode && sub.deptCode == techCode);
                            
                            if (foundSub) {
                                subjectName = foundSub.name;
                                tfMark = (foundSub.tf !== undefined && foundSub.tf !== null) ? foundSub.tf : "-";
                                pfMark = (foundSub.pf !== undefined && foundSub.pf !== null) ? foundSub.pf : "-";
                            } else {
                                const fallbackSub = allSubjectsData.find(sub => sub.code === targetCode);
                                if (fallbackSub) {
                                    subjectName = fallbackSub.name;
                                    tfMark = (fallbackSub.tf !== undefined && fallbackSub.tf !== null) ? fallbackSub.tf : "-";
                                    pfMark = (fallbackSub.pf !== undefined && fallbackSub.pf !== null) ? fallbackSub.pf : "-";
                                }
                            }
                        }
                    }
                });

                if (totalExaminees > 0) {
                    summaryRows.push([sl++, targetCode, subjectName, totalExaminees, tfMark, pfMark]);
                }
            });

            // PDF জেনারেট করা
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.setFontSize(12);
            doc.text("Question Count", doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });
            doc.text("Center: Pirganj Govt. TSC, Pirganj, Thakurgaon", doc.internal.pageSize.getWidth() / 2, 22, { align: "center" });

            doc.autoTable({
                startY: 25,
                head: [['SL', 'Sub Code', 'Subject Name', 'Total Examinees', 'TF', 'PF']],
                headStyles: { fillColor: [30, 58, 95] },
                body: summaryRows,
                styles: {
                    fontSize: 8,
                    cellPadding: 1.5,
                    minCellHeight: 6
                },
                theme: 'grid',
                columnStyles: { 
                    0: { cellWidth: 12, halign: 'center' }, 
                    1: { cellWidth: 28, halign: 'center' }, 
                    2: { cellWidth: 80 }, 
                    3: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
                    4: { cellWidth: 20, halign: 'center' },
                    5: { cellWidth: 20, halign: 'center' }
                }
            });

            Swal.close();
            doc.save(`Question_Count.pdf`);
        })
        .catch(error => {
            console.error(error);
            if (error.message !== "No student data") {
                Swal.fire("Error", "ডাটা প্রসেস করতে সমস্যা হয়েছে।", "error");
            }
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
function calculateCenterFee() {
    const selectedInst = document.getElementById("specInst").value;
    if (!selectedInst) { Swal.fire("Warning", "দয়া করে আগে একটি Institute সিলেক্ট করুন।", "warning"); return;}

    const instStudents = currentStudents.filter(s => s.inst === selectedInst);
    if (instStudents.length === 0) { Swal.fire("Error", "এই প্রতিষ্ঠানের কোনো পরীক্ষার্থী খুঁজে পাওয়া যায়নি।", "error"); return;}

    let grandTotal = 0;

    const reportRows = instStudents.map(student => {
        let pFee = 0;
        let qFee = 0;
        let referredFee = 0;
        let basicFee = 0;

        const stuSemi = student.semi;
        const techCode = student.dept?.toString().trim().match(/\d+/)?.[0] || "";
        const subCodes = student.subcodes ? student.subcodes.toString().split(',').map(c => c.trim()) : [];
        let semiAndPracInfo = analyzeSemesterAndPractical(stuSemi, techCode, subCodes);
        let semiNos = semiAndPracInfo.semiNos;
        let hasPractical = semiAndPracInfo.hasPractical;
        
        if(parseInt(stuSemi) < 8){            
            basicFee = 500; qFee = 50; pFee = 0; referredFee = (semiNos - 1) * 250; 
            if(hasPractical){ pFee = (hasPractical.pracSubs)*40;}
        }else{basicFee = 300; qFee = semiNos > 1 ? 50 : 0;  pFee = 0;}

        let rowTotal = (basicFee + referredFee + pFee + qFee);
        grandTotal += rowTotal;

        return {
            roll: student.roll, semi:student.semi, technology: student.dept, name: student.name, subcodes:student.subcodeDetails,
            basic: basicFee + referredFee, practical: pFee, question: qFee, total: basicFee + referredFee +pFee +qFee
        };
    });
    showFeeSummaryModal(selectedInst, reportRows, grandTotal);
}

function analyzeSemesterAndPractical(semi, techCode, subCodes) {
    const pracSemesters = new Set([1,2,4,6]);
    const uniqueSemesters = new Set();

    const subjects= subCodes.map(code => {
        return allSubjectsData.find( s => s.code === code && s.deptCode === techCode);
    }).filter(Boolean);
    
    subjects.forEach(sub => uniqueSemesters.add(sub.semi.toString().trim()));

    if (!pracSemesters.has(parseInt(semi))) {return {semiNos: uniqueSemesters.size, hasPractical: false}}

    const currentSemiSubs = subjects.filter(sub => sub.semi.toString() === semi);

    if (currentSemiSubs.length > 0 && currentSemiSubs.length >= parseInt(currentSemiSubs[0].nos)) {
        const pracSubsCount = currentSemiSubs.filter(sub => sub.pf).length;
        return {semiNos: uniqueSemesters.size, hasPractical: { pracSubs: pracSubsCount }}
    }

    return {semiNos: uniqueSemesters.size, hasPractical: false}
}

function showFeeSummaryModal(instName, rows, grandTotal) {
    let tableRows = rows.map(r => `
        <tr style="font-size: 12px;">
            <td>${r.roll}</td>
            <td class="text-start">${r.name.substring(0, 15)}..</td>
            <td>${r.basic}</td>
            <td>${r.practical}</td>
            <td>${r.question}</td>
            <td class="fw-bold">${r.total}</td>
        </tr>
    `).join('');

    Swal.fire({
        title: `Center Fee: ${instName}`,  width: '850px',
        html: `
            <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                <table class="table table-sm table-bordered">
                    <thead class="table-dark">
                        <tr> <th>Roll</th> <th>Name</th> <th>Center+Ref</th> <th>Prac</th> <th>Ques</th> <th>Total</th> </tr>
                    </thead>
                    <tbody> ${tableRows} </tbody>
                    <tfoot class="table-light">
                        <tr> <th colspan="5" class="text-end">Grand Total:</th> <th class="text-danger">${grandTotal} TK</th> </tr>
                    </tfoot>
                </table>
            </div>
        `,
        showCancelButton: true, confirmButtonText: 'Download Excel', cancelButtonText: 'Close',  confirmButtonColor: '#198754'
    }).then((result) => {
        if (result.isConfirmed) {  exportFeeToExcel(instName, rows);}
    });
}

async function exportFeeToExcel(instName, rows) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Center_Fee');

    worksheet.columns = [
        { header: "Roll No", key: "roll", width: 12 },
        { header: "Semi", key: "semi", width: 8 },
        { header: "Technology", key: "technology", width: 20 },
        { header: "Student Name", key: "name", width: 30 },
        { header: "Sub Codes", key: "subcodes", width: 45 },
        { header: "Theo. Fee", key: "basic", width: 12 },
        { header: "Prac. Fee", key: "practical", width: 12 },
        { header: "Qu. Fee", key: "question", width: 10 },
        { header: "Total Fee", key: "total", width: 15 }
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = {  type: 'pattern', pattern: 'solid', fgColor: { argb: '2c3e50' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

    rows.forEach(r => {
        const row = worksheet.addRow(r);
        row.eachCell((cell, colNumber) => {
            cell.border = {  top: { style: 'thin' },  left: { style: 'thin' },  bottom: { style: 'thin' },  right: { style: 'thin' }  };
            if ([1, 2, 6, 7, 8, 9].includes(colNumber)) {
                cell.alignment = { horizontal: 'center' };
            }
        });
    });

    const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);
    const footerRow = worksheet.addRow({ 
        subcodes: "Grand Total:", 
        total: grandTotal 
    });
    
    footerRow.getCell('subcodes').font = { bold: true };
    footerRow.getCell('total').font = { bold: true, color: { argb: 'FF0000' } };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `Center_Fee_${instName.substring(0, 15).replace(/\s/g, '_')}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
}
