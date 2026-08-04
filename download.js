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
            { header: 'Code', key: 'code', width: 15 }, 
            { header: 'Nos', key: 'nos', width: 10 }, 
            { header: 'SL No', key: 'sl', width: 12 },
            { header: 'Roll Number', key: 'roll', width: 20 }, 
            { header: 'Type', key: 'type', width: 12 },
            { header: 'Semi', key: 'semi', width: 12 }
        ];

        // Header Design
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
        headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } };
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

        const subCode = document.getElementById("subDisplayCode").innerText || "N/A";
        const totalExaminees = currentStudents.length;

        // --- প্রথমে Type এবং পরে Semi দিয়ে সর্ট করার লজিক ---
        const sortedStudents = [...currentStudents].sort((a, b) => {
            const typeA = String(a.type || '').trim();
            const typeB = String(b.type || '').trim();

            // ১. টাইপ অনুযায়ী তুলনা (Regular আগে, Irregular পরে)
            const typeComparison = typeA.localeCompare(typeB);

            // টাইপ যদি ভিন্ন হয়, তবে টাইপের ক্রমানুসারেই রিটার্ন হবে
            if (typeComparison !== 0) {
                return typeComparison; 
            }

            // ২. টাইপ যদি একই হয়, তবে semi অনুযায়ী সর্ট হবে
            if (typeof a.semi === 'number' && typeof b.semi === 'number') {
                return a.semi - b.semi;
            }
            return String(a.semi || '').localeCompare(String(b.semi || ''), undefined, { numeric: true });
        });

        // Data Insert (সর্ট করা sortedStudents ব্যবহার করা হয়েছে)
        sortedStudents.forEach((student, index) => {
            const rowData = { sl: student.sl || (index + 1), roll: student.roll, type: student.type, semi: student.semi };
            
            // rowData (Object) এর code & nos key তে কেবল মাত্র শুরুতে value যুক্ত হবে
            if (index === 0) { 
                rowData.code = subCode; 
                rowData.nos = totalExaminees; 
            }
            
            const row = worksheet.addRow(rowData);
            
            // Alignment & Border Set
            row.eachCell((cell, colNumber) => {
                cell.alignment = { horizontal: 'center' };
                cell.border = { 
                    top: { style: 'thin' }, 
                    left: { style: 'thin' }, 
                    bottom: { style: 'thin' }, 
                    right: { style: 'thin' } 
                };
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
                Swal.fire("সফল!", "রোলগুলো Download হয়েছে।", "success");
            })
            .catch(function (error) {
                console.error(error);
                Swal.fire("Error", "ফাইল তৈরি করতে সমস্যা হয়েছে।", "error");
            });
    } catch (error) {
        console.error(error); 
        Swal.fire("Error", "সিস্টেম এরর!", "error");
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

        const centerName = "Pirganj Govt. Technical School & College";
        const examTitle = "Diploma in Engineering Examination 2025";

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
                cellTitle.font = { size: 9, bold: true };
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

async function downloadQuestionCountExcel() {
    Swal.fire({
        title: 'Excel ফাইল তৈরি হচ্ছে...',
        html: 'ডাটা প্রসেস করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন।',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        // Local ডাটা আগে চেক করবে, না পেলে Fetch করবে
        const allStudents = await getStudentDataSafely();

        if (!allStudents || allStudents.length === 0) {
            Swal.fire("Error", "কোনো স্টুডেন্ট ডাটা পাওয়া যায়নি।", "error");
            return;
        }

        const subjectsList = Array.isArray(allSubjectsData) ? allSubjectsData : (allSubjectsData.subjects || []);

        const uniqueSubjectCodes = new Set();
        allStudents.forEach(s => {
            if (s.subcodes) {
                s.subcodes.toString().split(',').forEach(c => uniqueSubjectCodes.add(c.trim()));
            }
        });

        const sortedCodes = Array.from(uniqueSubjectCodes).sort();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Question Count');

        worksheet.columns = [
            { header: 'SL', key: 'sl', width: 10 },
            { header: 'Sub Code', key: 'subCode', width: 15 },
            { header: 'Subject Name', key: 'subName', width: 40 },
            { header: 'Total Examinees', key: 'examinees', width: 18 },
            { header: 'TF', key: 'tf', width: 12 },
            { header: 'PF', key: 'pf', width: 12 }
        ];

        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
        headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A5F' } };
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
                        const techMatch = s.dept ? s.dept.toString().trim().match(/\d+/) : null;
                        const techCode = techMatch ? techMatch[0] : null;

                        const foundSub = subjectsList.find(sub => sub.code === targetCode && sub.deptCode == techCode);
                        
                        if (foundSub) {
                            subjectName = foundSub.name;
                            tfMark = (foundSub.tf !== undefined && foundSub.tf !== null) ? foundSub.tf : "-";
                            pfMark = (foundSub.pf !== undefined && foundSub.pf !== null) ? foundSub.pf : "-";
                        } else {
                            const fallbackSub = subjectsList.find(sub => sub.code === targetCode);
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

                row.eachCell((cell, colNumber) => {
                    cell.alignment = { 
                        horizontal: colNumber === 3 ? 'left' : 'center', 
                        vertical: 'middle' 
                    };
                    cell.border = {
                        top: { style: 'thin' }, left: { style: 'thin' },
                        bottom: { style: 'thin' }, right: { style: 'thin' }
                    };
                });
            }
        });

        const buffer = await workbook.xlsx.writeBuffer();
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
        Swal.fire("সফল!", "এক্সেল ফাইলটি তাৎক্ষণিকভাবে তৈরি হয়েছে।", "success");

    } catch (error) {
        console.error("Excel Generation Error:", error);
        Swal.fire("Error", "ডাটা প্রসেস করতে সমস্যা হয়েছে।", "error");
    }
}

async function downloadQuestionCountPDF() {
    Swal.fire({
        title: 'PDF জেনারেট হচ্ছে...',
        html: 'ডাটা প্রসেস করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন।',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        // Local ডাটা আগে চেক করবে, না পেলে Fetch করবে
        const allStudents = await getStudentDataSafely();

        if (!allStudents || allStudents.length === 0) {
            Swal.fire("Error", "কোনো স্টুডেন্ট ডাটা পাওয়া যায়নি।", "error");
            return;
        }

        const subjectsList = Array.isArray(allSubjectsData) ? allSubjectsData : (allSubjectsData.subjects || []);

        const uniqueSubjectCodes = new Set();
        allStudents.forEach(s => {
            if (s.subcodes) {
                s.subcodes.toString().split(',').forEach(c => uniqueSubjectCodes.add(c.trim()));
            }
        });

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
                        const techMatch = s.dept ? s.dept.toString().trim().match(/\d+/) : null;
                        const techCode = techMatch ? techMatch[0] : null;

                        const foundSub = subjectsList.find(sub => sub.code === targetCode && sub.deptCode == techCode);
                        
                        if (foundSub) {
                            subjectName = foundSub.name;
                            tfMark = (foundSub.tf !== undefined && foundSub.tf !== null) ? foundSub.tf : "-";
                            pfMark = (foundSub.pf !== undefined && foundSub.pf !== null) ? foundSub.pf : "-";
                        } else {
                            const fallbackSub = subjectsList.find(sub => sub.code === targetCode);
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

        const { jsPDF } = window.jspdf || {};
        if (!jsPDF) {
            Swal.fire("Error", "jsPDF library লোড হয়নি!", "error");
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text("Question Count", doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });
        doc.text("Center: Pirganj Govt. Technical School & College, Pirganj", doc.internal.pageSize.getWidth() / 2, 22, { align: "center" });

        if (typeof doc.autoTable !== 'function') {
            Swal.fire("Error", "jspdf-autotable plugin যুক্ত করা নেই!", "error");
            return;
        }

        doc.autoTable({
            startY: 25,
            head: [['SL', 'Sub Code', 'Subject Name', 'Total Examinees', 'TF', 'PF']],
            headStyles: { fillColor: [30, 58, 95] },
            body: summaryRows,
            styles: { fontSize: 8, cellPadding: 1.5, minCellHeight: 6 },
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

    } catch (error) {
        console.error("PDF Generation Error:", error);
        Swal.fire("Error", "ডাটা প্রসেস করতে সমস্যা হয়েছে।", "error");
    }
}

async function getStudentDataSafely() {
    // ১. প্রথমে Global Variable বা LocalStorage চেক
    let students = Array.isArray(allStudentsData) ? allStudentsData : (allStudentsData.students || []);
    
    if (!students || students.length === 0) {
        const cached = localStorage.getItem('allStudentsData');
        if (cached) {
            const parsed = JSON.parse(cached);
            students = Array.isArray(parsed) ? parsed : (parsed.students || []);
        }
    }

    // ২. Local-এ ডাটা পাওয়া গেলে সরাসরি ফেরত পাঠাবে (সার্ভারে কল করবে না)
    if (students && students.length > 0) {
        console.log("Loaded student data from Local Cache!");
        return students;
    }

    // ৩. Local-এ না থাকলে তবেই সার্ভার থেকে Fetch করবে
    console.log("Fetching student data from Server...");
    const response = await fetch(API_URL + "?action=specificSearch");
    const res = await response.json();
    return Array.isArray(res) ? res : (res.students || []);
}


function showPracticalExamineesTable() {
    if (!currentStudents || currentStudents.length === 0) {
        if (window.Swal) Swal.fire("তথ্য নেই", "খুঁজে পাওয়ার মতো কোনো শিক্ষার্থী নেই।", "warning");
        return;
    }

    const practicalExaminees = getPracticalExaminees(currentStudents);
    const nonPracticalCount = currentStudents.length - practicalExaminees.length;
    showPracticalExaminess = true;

    renderTablePage();
    if (window.Swal) {
        Swal.fire(
            "ব্যবহারিক চেক সম্পন্ন!", 
            `মোট ${currentStudents.length} জনের মধ্যে ${practicalExaminees.length} জনের ব্যবহারিক আছে।<br>যাদের ব্যবহারিক নেই (${nonPracticalCount} জন) তাদের রো লাল রঙে হাইলাইট করা হয়েছে।`, 
            "info"
        );
    }
}

function getPracticalExaminees(studentsList) {
    const pracSemesters = new Set([2, 3, 5, 7]); 
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

async function downloadAttendanceSheet() {
    const { value: formValues } = await Swal.fire({
        title: 'হাজিরা শিট রেঞ্জ নির্ধারণ করুন',
        html:
            '<div class="text-start mb-2"><label class="fw-bold">শুরুর SL (Start):</label>' +
            '<input id="swal-input1" type="number" class="swal2-input" placeholder="যেমন: 1"></div>' +
            '<div class="text-start"><label class="fw-bold">শেষের SL (End):</label>' +
            '<input id="swal-input2" type="number" class="swal2-input" placeholder="যেমন: 50"></div>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'হাজিরা শিট দেখুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#1e3a5f',
        preConfirm: () => {
            const startSL = parseInt(document.getElementById('swal-input1').value);
            const endSL = parseInt(document.getElementById('swal-input2').value);
            if (isNaN(startSL) || isNaN(endSL)) {  Swal.showValidationMessage('অনুগ্রহ করে সঠিক SL নম্বর ইনপুট দিন'); return false; }
            if (startSL > endSL) { Swal.showValidationMessage('শুরুর SL অবশ্যই শেষের SL এর থেকে ছোট বা সমান হতে হবে');  return false; }
            if ((endSL - startSL) > 50) { Swal.showValidationMessage('পার্থক্য ৫০ এর বেশি হতে পারবে না (সর্বোচ্চ ৫০টি SL নেওয়া যাবে)');  return false; }
            return { startSL, endSL };
        }
    });

    if (!formValues) return;
    const { startSL, endSL } = formValues;

    Swal.fire({
        title: 'Your request is being processed. Please wait a bit',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const response = await fetch(`${API_URL}?action=specialSearch`);
        const res = await response.json();
        const studentList = Array.isArray(res) ? res : (res.students || []);
        if (res.subjects) {localStorage.setItem('allSubjectsData', JSON.stringify(res.subjects));}

        if (!studentList || studentList.length === 0) {
            Swal.fire("ত্রুটি", "সার্ভার থেকে কোনো ডাটা পাওয়া যায়নি।", "error");
            return;
        }

        const filteredAttendanceData = studentList.filter(student => {
            const slRaw = student.sl || '0';
            const sl = parseInt(slRaw.toString().replace(/\D/g, ''));
            return sl >= startSL && sl <= endSL;
        });

        if (filteredAttendanceData.length === 0) {
            Swal.fire("ডাটা পাওয়া যায়নি", `SL ${startSL} থেকে ${endSL} এর মধ্যে কোনো ডাটা পাওয়া যায়নি।`, "warning");
            return;
        }

        sessionStorage.setItem('attendanceStudents', JSON.stringify(filteredAttendanceData));
        sessionStorage.setItem('attendanceRange', JSON.stringify({ startSL, endSL }));

        Swal.close();
        window.open('atn_sheet.html', '_blank');

    } catch (error) {
        console.error("Fetch Error:", error);
        Swal.fire("Error", "ডাটা প্রসেস করতে সমস্যা হয়েছে!", "error");
    }
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
