
function downloadRolls() {
    if (currentStudents.length === 0) {
        Swal.fire("ডেটা নেই", "প্রথমে সার্চ করে লিস্ট লোড করুন।", "warning");
        return;
    }

    // শুধুমাত্র SL এবং Roll কলাম আলাদা করা
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
    // ১. ডেটা চেক
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

    // ২. ৩টি কলামে ডেটা সাজানোর লজিক
    for (let i = 0; i < currentStudents.length; i += 3) {
        // প্রতি ৩ জন স্টুডেন্টের জন্য এক সেট রো তৈরি করা
        const s1 = currentStudents[i] || { inst: "", dept: "", roll: "" };
        const s2 = currentStudents[i + 1] || { inst: "", dept: "", roll: "" };
        const s3 = currentStudents[i + 2] || { inst: "", dept: "" , roll: "" };

        // রো ১: কেন্দ্র নাম
        rows.push({ "Col 1": centerName, "Col 2": centerName, "Col 3": centerName });
        // রো ২: পরীক্ষার নাম
        rows.push({ "Col 1": examTitle, "Col 2": examTitle, "Col 3": examTitle });
        // রো ৩: ডিপার্টমেন্ট
        rows.push({ 
            "Col 1": s1.dept ? "(" + s1.dept + ")" : "", 
            "Col 2": s2.dept ? "(" + s2.dept + ")" : "", 
            "Col 3": s3.dept ? "(" + s3.dept + ")" : "" 
        });
        // রো ৪: টাইপ এবং রোল (একসাথে বা আলাদা রো-তে)
        rows.push({ 
            "Col 1": "Regular  -  " + s1.roll, 
            "Col 2": "Regular  -  " + s2.roll, 
            "Col 3": "Regular  -  " + s3.roll 
        });
        
        // প্রতিটি লেবেলের মাঝে একটি খালি রো (গ্যাপের জন্য)
        rows.push({ "Col 1": "", "Col 2": "", "Col 3": "" });
    }

    // ৩. এক্সেল শিট তৈরি
    const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true });

    // কলামের উইডথ সেট করা (যাতে প্রিন্টের সময় সুবিধা হয়)
    ws['!cols'] = [{ wch: 35 }, { wch: 35 }, { wch: 35 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Seat_Labels");

    // ৪. ডাউনলোড
    const subCode = document.getElementById("subDisplayCode").innerText || "Export";
    XLSX.writeFile(wb, subCode + "_Seat_Labels.xlsx");

    Swal.close();
    Swal.fire("সফল!", "Excel ফাইলটি ডাউনলোড হয়েছে। এখন রো হাইট অ্যাডজাস্ট করে প্রিন্ট করুন।", "success");
}

function downloadRoutine() {
    if (Object.keys(routineData).length === 0) {
        Swal.fire("ডেটা নেই", "রুটিন ডাটা লোড হয়নি!", "info");
        return;
    }

    const reportData = [];
    
    // তারিখ অনুযায়ী লুপ চালানো
    Object.keys(routineData).sort().forEach(date => {
        const exams = routineData[date]; // ঐ তারিখের সব পরীক্ষার লিস্ট
        
        exams.forEach(ex => {
            reportData.push({
                "Date": date + "-03-2026", // আপনার মাস অনুযায়ী পরিবর্তন করতে পারেন
                "Shift": ex.time,
                "Subject Code": ex.subjectCode,
                "Examinee Count": ex.examineeNos,
                "Status": "Confirmed"
            });
        });
    });

    // এক্সেল তৈরি
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Exam_Routine");

    // স্টাইলিশ কলাম উইডথ
    ws['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 12 }];

    XLSX.writeFile(wb, "Diploma_Exam_Routine_2026.xlsx");
    
    Swal.fire({
        icon: 'success',
        title: 'ডাউনলোড সফল',
        text: 'আপনার পরীক্ষার রুটিনটি এক্সেল ফাইলে সেভ হয়েছে।'
    });
}


function downloadStudentSummary() {
    if (currentStudents.length === 0) return Swal.fire("আগে ডেটা লোড করুন");
    
    let counts = {};
    currentStudents.forEach(function(s) {
        counts[s.inst] = (counts[s.inst] || 0) + 1;
    });

    const data = Object.entries(counts).map(function(entry) {
        return { "Institute Name": entry[0], "Total Students": entry[1] };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Summary");
    XLSX.writeFile(wb, "Examinee_Summary.xlsx");
}

function generateAttendance() {
    Swal.fire("শিরোনাম পত্র", "এই ফিচারের টেমপ্লেট ডিজাইন অনুযায়ী শীঘ্রই যুক্ত করা হবে।", "info");
}

/**
 * ATTENDANCE SHEET GENERATOR (USING EXCELJS)
 * এটি গিটহাবে থাকা attendance.xlsx ফাইলটিকে টেমপ্লেট হিসেবে ব্যবহার করবে।
 */

async function downloadAttendanceSheet() {
    const { value: range } = await Swal.fire({
        title: 'হাজিরা শিট ডাউনলোড',
        html: `
            <div class="text-start mb-2"><label>SL From:</label><input type="number" id="slStart" class="form-control" value="1"></div>
            <div class="text-start"><label>SL To:</label><input type="number" id="slEnd" class="form-control" value="10"></div>
        `,
        confirmButtonText: 'Generate Excel',
        showCancelButton: true,
        preConfirm: () => ({
            start: parseInt(document.getElementById('slStart').value),
            end: parseInt(document.getElementById('slEnd').value)
        })
    });

    if (!range) return;
    Swal.fire({ title: 'প্রসেসিং হচ্ছে...', didOpen: () => Swal.showLoading() });

    try {
        // ১. গিটহাব থেকে টেমপ্লেট রিড করা
        const response = await fetch("attendance.xlsx");
        const arrayBuffer = await response.arrayBuffer();

        const templateWorkbook = new ExcelJS.Workbook();
        await templateWorkbook.xlsx.load(arrayBuffer);
        const templateSheet = templateWorkbook.getWorksheet("AttendanceSheet");

        // ২. ডাটাবেজ থেকে পরীক্ষার্থী ফিল্টার
        const res = await fetch(API_URL + "?action=filterSearch");
        const data = await res.json();
        const selectedStudents = data.students.filter(s => parseInt(s.sl) >= range.start && parseInt(s.sl) <= range.end);

        const outWorkbook = new ExcelJS.Workbook();

        for (const student of selectedStudents) {
            const newSheet = outWorkbook.addWorksheet(`SL-${student.sl}`);
            
            // টেমপ্লেট কপি (Formatting & Logo)
            copyWorksheet(templateSheet, newSheet);

            // ৩. আপনার ছবির সেল অ্যাড্রেস অনুযায়ী ডাটা ইনসার্ট (image_bd2d9c অনুযায়ী)
            newSheet.getCell('E1').value = "SL - " + student.sl;
            newSheet.getCell('G1').value = student.name;
            newSheet.getCell('B5').value = student.roll; 
            newSheet.getCell('D5').value = "1502238315"; // Registration
            newSheet.getCell('G5').value = "2223";       // Session
            newSheet.getCell('B7').value = student.inst;
            newSheet.getCell('A4').value = "(" + student.dept + ") Regular";

            // ৪. সাবজেক্ট লিস্ট (Row 10 থেকে শুরু)
            const subjectCodes = student.allSubjects ? student.allSubjects.toString().split(',') : [];
            let rowIdx = 10;
            subjectCodes.forEach(code => {
                const cleanCode = code.trim();
                const subInfo = allSubjectsData[cleanCode] || { name: "" };
                newSheet.getCell(`C${rowIdx}`).value = cleanCode;
                newSheet.getCell(`D${rowIdx}`).value = subInfo.name;
                rowIdx++;
            });
        }

        // ৫. ডাউনলোড প্রসেস
        const buffer = await outWorkbook.xlsx.writeBuffer();
        saveAsExcel(buffer, `Attendance_${range.start}_to_${range.end}.xlsx`);
        Swal.close();

    } catch (err) {
        console.error(err);
        Swal.fire("Error", "ফাইল জেনারেশনে সমস্যা হয়েছে!", "error");
    }
}

// ফাইল সেভ করার হেল্পার
function saveAsExcel(buffer, filename) {
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// টেমপ্লেট স্টাইল ও লোগো কপি করার ফাংশন
function copyWorksheet(source, target) {
    source.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        const targetRow = target.getRow(rowNumber);
        targetRow.height = row.height;
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const targetCell = targetRow.getCell(colNumber);
            targetCell.value = cell.value;
            targetCell.style = JSON.parse(JSON.stringify(cell.style));
        });
    });
    source.columns.forEach((col, i) => { target.getColumn(i + 1).width = col.width; });
    
    // মার্জড সেল হ্যান্ডলিং
    if (source._merges) {
        Object.values(source._merges).forEach(m => {
            target.mergeCells(m.tl, m.br);
        });
    }

    // ইমেজ/লোগো কপি (Template এ থাকলে এটি নিয়ে আসবে)
    if (source.model.media) {
        source.model.media.forEach((image) => {
            const imgId = target.workbook.addImage({
                buffer: source.workbook.model.media[image.index].buffer,
                extension: source.workbook.model.media[image.index].extension,
            });
            target.addImage(imgId, image.range);
        });
    }
}




function downloadQuestionCount() {
    // ১. চেক করা যে সব ডাটা লোড হয়েছে কি না
    if (Object.keys(allSubjectsData).length === 0) {
        Swal.fire("ডেটা নেই", "সাবজেক্ট ডাটা এখনো লোড হয়নি।", "warning");
        return;
    }

    Swal.fire({
        title: 'Question Count তৈরি হচ্ছে...',
        text: 'অনুগ্রহ করে অপেক্ষা করুন, এটি বড় ডাটাবেজ প্রসেস করছে।',
        didOpen: () => { Swal.showLoading(); }
    });

    // ২. বর্তমান ডাটাবেজ থেকে পরীক্ষার্থীদের ডাটা সংগ্রহ (অফলাইন প্রসেসিং এর জন্য)
    // আমরা একবার fetch করে সব স্টুডেন্ট নিয়ে আসব যাতে বারবার সার্ভারে হিট করতে না হয়
    fetch(API_URL + "?action=filterSearch") // প্যারামিটার ছাড়া পাঠালে সব স্টুডেন্ট আসবে
    .then(r => r.json())
    .then(res => {
        const allStudents = res.students;
        const finalReport = [];

        // ৩. প্রতিটি সাবজেক্ট ধরে লুপ চালানো
        Object.keys(allSubjectsData).forEach((code, index) => {
            const subjectInfo = allSubjectsData[code];

            // এই সাবজেক্ট কোডটি কতজন স্টুডেন্টের 'allSubjects' এর ভেতর আছে তা ফিল্টার করা
            const count = allStudents.filter(s => {
                if (!s.allSubjects) return false;
                // কমা দিয়ে আলাদা করা সাবজেক্টগুলোর সাথে ম্যাচ করা
                const subjectsArray = s.allSubjects.toString().split(',').map(item => item.trim());
                return subjectsArray.includes(code.toString().trim());
            }).length;

            // ৪. ছবির ফরম্যাট অনুযায়ী ডাটা সাজানো
            if (count > 0) { // শুধুমাত্র যে বিষয়ে পরীক্ষার্থী আছে সেগুলোই রিপোর্টে আসবে
                finalReport.push({
                    "SL": finalReport.length + 1,
                    "Syllabus": "2022", // এটি ডাইনামিক করতে চাইলে subjectInfo থেকে নিতে পারেন
                    "TF": subjectInfo.tf || "",
                    "PF": subjectInfo.pf || "",
                    "Sub_Code": code,
                    "Sub_Name": subjectInfo.name,
                    "Stu_Nos": count,
                    "Remarks": ""
                });
            }
        });

        // ৫. এক্সেল ফাইল জেনারেশন
        const ws = XLSX.utils.json_to_sheet(finalReport);
        
        // হেডার ডিজাইন (মার্জ সেল এবং টাইটেল যোগ করা)
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Question_Count");

        // কলাম উইডথ সেট করা
        ws['!cols'] = [
            { wch: 5 }, { wch: 10 }, { wch: 8 }, { wch: 8 }, 
            { wch: 12 }, { wch: 35 }, { wch: 10 }, { wch: 15 }
        ];

        XLSX.writeFile(wb, "Question_Count_Report_2026.xlsx");
        Swal.close();
        Swal.fire("সফল!", "Question Count রিপোর্টটি ডাউনলোড হয়েছে।", "success");
    })
    .catch(err => {
        Swal.fire("Error", "ডাটা প্রসেস করতে সমস্যা হয়েছে: " + err.message, "error");
    });

}
