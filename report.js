 const API_URL = "https://script.google.com/macros/s/AKfycbxnmUcuFVLLK7pg9NsP8YVtC9LFjvhVMOV7vt08MWX09MIKl9LuNgZX4LXmR7jvHoZZ/exec"; 
    let allSubjectsData = {}; 
    let routineData = {};
    let currentStudents = [];
    let selectedDate = ""; 
    let examDates = [];
    let currentCalendarDate = new Date();

    let currentPage = 1;
    const rowsPerPage = 200;

    const uID = sessionStorage.getItem("userId"); 
    if(!uID){location.href="index.html";}

    window.onload = function() {initDropdowns(); fetchAllData();};
    document.body.classList.add('loading');

    function initDropdowns() {
        fill("selectInst", ["Pirgonj Polytechnic Institute", "Ranisonkoil Polytechnic Institute", "Ranisankail Ideal Non-Govt. Polytechnic Institute"]);
        fill("selectTech", ["(64) Civil", "(66) Computer", "(67) Electrical", "(70) Mechanical", "(85) Computer"]);
        fill("selectSemi", ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"]);
        fill("selectSyllabus", ["2022", "2016"]);
    }

    function fill(id, list){
        const s = document.getElementById(id); 
        if(!s) return;
        list.forEach(i => { const o = document.createElement("option"); o.value = i; o.innerText = i; s.appendChild(o); }); 
    }

    function fetchAllData() {
        const cachedSubjects = localStorage.getItem('allSubjectsData');
        const cachedRoutine = localStorage.getItem('routineData');
        const lastFetchTime = localStorage.getItem('lastFetchTime');

        const oneHour = 60 * 60 * 1000; 
        const isCacheValid = lastFetchTime && (Date.now() - lastFetchTime < oneHour);

        if (cachedSubjects && cachedRoutine && isCacheValid) {
            console.log("Loading from Cache...");
            allSubjectsData = JSON.parse(cachedSubjects);
            routineData = JSON.parse(cachedRoutine);
            
            generateDateButtons();
            hideLoader();
            return;
        }

        console.log("Fetching from Server...");
        fetch(API_URL + "?action=getBGData")
            .then(r => r.json())
            .then(res => {
                allSubjectsData = res.subjects;
                routineData = res.routine || {};

                localStorage.setItem('allSubjectsData', JSON.stringify(allSubjectsData));
                localStorage.setItem('routineData', JSON.stringify(routineData));
                localStorage.setItem('lastFetchTime', Date.now());

                generateDateButtons();
                hideLoader();
            })
            .catch(err => {
                console.error("Data fetch error:", err);
                hideLoader();
                Swal.fire("Error", "সার্ভার থেকে ডাটা লোড করা সম্ভব হয়নি।", "error");
            });
    }

    function generateDateButtons() {
        examDates = Object.keys(routineData).filter(k => k.match(/^\d{4}-\d{2}-\d{2}$/)).sort();
        currentCalendarDate = new Date(examDates[0]);
        renderCalendar();
    }

    function renderCalendar() {
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        document.getElementById("currentMonthYear").innerText = `${monthNames[month]} ${year}`;

        const lastDayOfMonth = new Date(year, month + 1, 0);
        let htmlContent = "";

        for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
            const mmStr = String(month + 1).padStart(2, '0');
            const ddStr = String(d).padStart(2, '0');
            const dateKey = `${year}-${mmStr}-${ddStr}`;

            const hasExam = routineData[dateKey] && routineData[dateKey].length > 0;
            const statusClass = hasExam ? "has-exam" : "no-exam";
            
            htmlContent += `<div class="dateBtn ${statusClass}" onclick="showDailySummary('${dateKey}')">${ddStr}</div>`;
        }

        document.getElementById("dateContainer").innerHTML = htmlContent;
    }

    function navigateMonth(direction, event) {
        if (event) {
            event.stopPropagation(); 
            event.preventDefault();
        }
        if(currentCalendarDate.getMonth() < 1 || currentCalendarDate.getMonth() > 10){
            currentCalendarDate = new Date(examDates[0]);
        } else{
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
        }
        renderCalendar();
    }

    function searchBySubjectCode() {
        const code = document.getElementById("searchInput").value.trim();
        const subInfo = allSubjectsData.find(s => s.code === code);
        
        if (!subInfo) { Swal.fire("Invalid Subject Code", "এই subject code টি ডাটাবেসে পাওয়া যায়নি।", "error");   return;}
        
        updateSubjectDisplay(code, subInfo);
        
        Swal.fire({ title: 'Loading...', didOpen: () => Swal.showLoading() });
        fetch(API_URL + "?action=searchByCode&code=" + code)
            .then(r => r.json())
            .then(res => {
                Swal.close();
                currentStudents = res.students;
                currentPage = 1; 
                renderTablePage(); 
                genSummary(currentStudents);
            });
    }

    function searchByRoll() {
        const roll = document.getElementById("searchInput").value.trim();
        if (!roll) return;
        Swal.fire({ title: 'Finding Roll...', didOpen: () => Swal.showLoading() });
        fetch(API_URL + "?action=searchByRoll&roll=" + roll).then(r => r.json()).then(res => {
            Swal.close();
            if (res.success) {
                const s = res.data;
                Swal.fire({ title: 'Examinee Profile', 
                html: `<div class="text-start p-2"><strong>Name:</strong> ${s.name}<br><strong>Roll:</strong> ${s.roll}<br><strong>Subjects:</strong> ${s.subcodeDetails}</div>` });
            } else { Swal.fire(res.error); }
        });
    }

    function renderTablePage() {
        const tbody = document.getElementById("mytbody");
        tbody.innerHTML = "";

        const totalStudents = currentStudents.length;
        const totalPages = Math.ceil(totalStudents / rowsPerPage) || 1;

        //Data Table এর যে পেজ দেখানো হবে সেই পেজ এর start & end index নির্ণয়
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, totalStudents);
        const pageData = currentStudents.slice(startIndex, endIndex);

        tbody.innerHTML = pageData.map(s => `
            <tr>
                <td>${s.sl}</td>
                <td class="fw-bold">${s.roll}</td>
                <td>${s.semi}</td>
                <td>${s.dept}</td>                                
                <td class="text-start">${s.name}</td>
                <td>${s.subcodeDetails}</td>
                <td><button class="btn btn-sm btn-info text-white" onclick="showDetails('${s.roll}')">Details</button></td>
            </tr>
        `).join('');

        document.getElementById("count").innerText = "Total Student: " + totalStudents;
        document.getElementById("pageInfo").innerText = `Page ${currentPage} of ${totalPages} (Rows: ${startIndex + 1}-${endIndex})`;
        document.getElementById("prevBtn").disabled = (currentPage === 1);
        document.getElementById("nextBtn").disabled = (currentPage === totalPages);
    }

    function changePage(direction) {
        const totalPages = Math.ceil(currentStudents.length / rowsPerPage) || 1;
        currentPage += direction;

        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;

        renderTablePage();
        document.getElementById("mainTable").scrollIntoView({ behavior: 'smooth' }); 
    }


    function showDailySummary(dateKey) {
        selectedDate = formatDateBangla(dateKey); 
        const exams = routineData[dateKey];

        if (!exams || exams.length === 0) { 
            Swal.fire({ icon: 'info', title: `Date: ${selectedDate}`, text: "No exam scheduled." }); 
            return; 
        }

        let morningHtml = "";
        let eveningHtml = "";

        exams.forEach(ex => {
            const row = `
                <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                    <div class="text-start">
                        <span class="badge bg-primary me-2">${ex.subjectCode}</span>
                        <small class="text-secondary">Students: ${ex.examineeNos}</small>
                    </div>
                    <button class="btn btn-sm btn-success px-3" onclick="loadFullList('${ex.subjectCode}')">Load</button>
                </div>`;
            if (ex.time === "Morning") morningHtml += row;
            else eveningHtml += row;
        });

        let modalHtml = `
            <div class="text-start">
                <h6 class="bg-light p-2 border-start border-primary border-4">☀️ Morning Shift</h6>
                <div class="mb-3 px-2">${morningHtml || '<small class="text-muted">No exams</small>'}</div>
                <h6 class="bg-light p-2 border-start border-warning border-4">🌙 Evening Shift</h6>
                <div class="px-2">${eveningHtml || '<small class="text-muted">No exams</small>'}</div>
            </div>`;

        Swal.fire({ title: `Exams on ${selectedDate}`, html: modalHtml, showConfirmButton: false, showCloseButton: true });
    }

    function formatDateBangla(dateStr) {
        const parts = dateStr.split('-');
        if(parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateStr;
    }

    function loadFullList(code) { 
        Swal.close(); 
        document.getElementById("searchInput").value = code; 
        searchBySubjectCode(); 
    }

    function goToShironamPage() {
        if (currentStudents.length === 0) {
            Swal.fire("ডেটা নেই", "প্রথমে সার্চ করে স্টুডেন্ট লিস্ট আনুন।", "warning");
            return;
        }
        const examData = {
            examName: "Diploma in Engineering Final Exam - 2026",
            subName: document.getElementById("subDisplayName").innerText,
            subCode: document.getElementById("subDisplayCode").innerText,
            examDate: selectedDate || "Not Selected"
        };
        sessionStorage.setItem('currentStudents', JSON.stringify(currentStudents));
        sessionStorage.setItem('currentExamInfo', JSON.stringify(examData));
        window.location.href = 'shironam.html'; 
    }

    function sortTable(type) {
        if (type === 'roll') currentStudents.sort((a, b) => a.roll - b.roll);
        else currentStudents.sort((a, b) => a.sl - b.sl);
        currentPage = 1;     // সর্ট করার পর প্রথম পেজ থেকে ভিউ দেখাবে
        renderTablePage();
    }

    function validateSubCode(val) {
        if (!val || !allSubjectsData || !Array.isArray(allSubjectsData)) return;

        const subInfo = allSubjectsData.find(s => s.code.toString().trim() === val.trim());
        
        if (subInfo) {  updateSubjectDisplay(val.trim(), subInfo);
        } else {
            document.getElementById("subDisplayCode").innerText = "---";
            document.getElementById("subDisplayName").innerText = "---";
        }
    }

    // প্রতিষ্ঠান ভিত্তিক পরীক্ষার্থী সংখ্যা নির্ণয় করে institute summary তে দেখানো 
    function genSummary(data) {
        let counts = {};
        data.forEach(s => counts[s.inst] = (counts[s.inst] || 0) + 1);

        document.getElementById("instituteList").innerHTML = Object.entries(counts).map(([n, c]) => `
            <div class="d-flex justify-content-between border-bottom py-1"><span>${n}</span><strong>${c}</strong></div>
        `).join('');
    }
    
    function toggleSearch(s) { 
        document.getElementById("standardSearch").style.display = s ? "none" : "block"; 
        document.getElementById("specificSearch").style.display = s ? "block" : "none"; 
    }



    function showDetails(roll) {
        const student = currentStudents.find(s => s.roll.toString() === roll.toString());
        const techCode = student.dept.toString().trim().match(/\d+/)[0];
        
        const currentSemi = (student.semi || "").toString().trim(); 
        const studentSubList = (student.subcodes || "").toString().split(',').map(s => s.trim());

        let currentSemesterRows = "";
        let referredRows = "";

        studentSubList.forEach(code => {
            const sub = allSubjectsData.find(s => s.code.toString().trim() === code && s.deptCode.toString().trim() === techCode);

            if (sub) {
                const subSemi = sub.semi.toString().trim();
                const isReferred = (subSemi !== currentSemi);

                const rowHtml = `
                    <tr style="font-size: 13px;">
                        <td class="fw-bold">${code}</td>
                        <td class="text-start">${sub.name || 'Unknown'}</td>
                        <td><span class="badge ${isReferred ? 'bg-danger' : 'bg-primary'}">${subSemi}</span></td>
                        <td>${sub.tf || 0} + ${sub.pf || 0}</td>
                    </tr>`;

                if (isReferred) referredRows += rowHtml;
                else currentSemesterRows += rowHtml;
            } else {
                referredRows += `<tr class="table-light"><td class="fw-bold">${code}</td><td class="text-muted text-start">Not matched with Dept: ${techCode}</td><td>-</td><td>-</td></tr>`;
            }
        });

        Swal.fire({
            title: `Examinee Profile`,  width: '750px',
            html: `
                <div class="text-start mb-3" style="font-size: 14px; background: #f8f9fa; padding: 12px; border-radius: 8px; border-left: 5px solid #1e3a5f;">
                    <div class="row">
                        <div class="col-md-6"><strong>Name:</strong> ${student.name}</div>
                        <div class="col-md-6"><strong>Roll:</strong> ${student.roll}</div>
                        <div class="col-md-6"><strong>Technology:</strong> ${student.dept}</div>
                        <div class="col-md-6"><strong>Current Semi:</strong> <span class="badge bg-dark">${student.semi}</span></div>
                        <div class="col-md-6"><strong>Institute:</strong> ${student.inst}</div>
                        <div class="col-md-6"><strong>Type:</strong> ${student.type}</div>
                    </div>
                </div>
                <div class="table-responsive">
                    <h6 class="text-primary text-start border-bottom pb-1">Current Semi Subjects</h6>
                    <table class="table table-sm table-bordered mb-3">
                        <thead class="table-light"><tr><th>Code</th><th>Subject Name</th><th>Semi</th><th>T+P</th></tr></thead>
                        <tbody>${currentSemesterRows || '<tr><td colspan="4">No current semester subjects</td></tr>'}</tbody>
                    </table>
                    ${referredRows ? `
                        <h6 class="text-danger text-start border-bottom pb-1 mt-3">Referred Subjects</h6>
                        <table class="table table-sm table-hover table-bordered">
                            <thead class="table-light"><tr><th>Code</th><th>Subject Name</th><th>Semi</th><th>T+P</th></tr></thead>
                            <tbody class="table-warning">${referredRows}</tbody>
                        </table>
                    ` : ''}
                </div>
            `,
            confirmButtonText: 'Close',
            confirmButtonColor: '#1e3a5f'
        });
    }

    function filterSearch() {
        const inst = document.getElementById("selectInst").value;
        const tech = document.getElementById("selectTech").value;
        const semi = document.getElementById("selectSemi").value;
        const syllabus = document.getElementById("selectSyllabus").value;

        Swal.fire({ title: 'ফিল্টার করা হচ্ছে...', didOpen: () => Swal.showLoading() });

        const params = new URLSearchParams({
            action: "specificSearch", inst: inst, tech: tech, semi: semi, syllabus: syllabus
        });

        fetch(`${API_URL}?${params.toString()}`)
            .then(r => r.json())
            .then(res => {
                Swal.close();
                if (res.students && res.students.length > 0) {
                    currentStudents = res.students;
                    currentPage = 1;      // নতুন ফিল্টারে ১ম পেজে সেট হবে
                    renderTablePage();
                    genSummary(currentStudents);
                    
                    document.getElementById("subDisplayCode").innerText = "Multiple/Filtered";
                    document.getElementById("subDisplayName").innerText = "Filtered Results";
                } else {
                    currentStudents = [];
                    currentPage = 1;
                    renderTablePage();
                    document.getElementById("instituteList").innerHTML = "No students found.";
                    Swal.fire("দুঃখিত", "এই ফিল্টারে কোনো পরীক্ষার্থী পাওয়া যায়নি!", "info");
                }
            })
            .catch(err => {
                console.error(err);
                Swal.fire("Error", "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।", "error");
            });
    }

    function toggleMoreButtons(btn) {
        const extraButtons = document.querySelectorAll('.extra-btn');
        const isHidden = extraButtons[0].classList.contains('d-none');

        if (isHidden) {
            extraButtons.forEach(el => el.classList.remove('d-none'));
            btn.innerHTML = "Less Buttons (-)";
            btn.classList.add('text-secondary'); 
        } else {
            extraButtons.forEach(el => el.classList.add('d-none'));
            btn.innerHTML = "More Buttons (+)";
            btn.classList.remove('text-secondary');
        }
    }

    function updateSubjectDisplay(code, info) {
        document.getElementById("subDisplayCode").innerText = code;
        document.getElementById("subDisplayName").innerText = info.name;
        document.getElementById("subTF").innerText = info.tf;
        document.getElementById("subPF").innerText = info.pf;
    }

    function hideLoader() {
        const loader = document.getElementById("pageLoader");
        if (loader) {
            loader.style.transition = "opacity 0.5s";
            loader.style.opacity = "0";
            setTimeout(() => {loader.remove();  document.body.classList.remove('loading'); }, 500);
        }
    }
