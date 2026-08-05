function findSubjectByCode(code, targetDept = "") {
  const searchCode = code.toString().trim();
  const searchDept = targetDept ? targetDept.toString().trim() : "";

  for (const reg in SUBJECTS_DATA) {               
      for (const dept in SUBJECTS_DATA[reg]) {
          if (searchDept && dept != searchDept) {continue;}
          for (const semi in SUBJECTS_DATA[reg][dept]) {
              const subjectList = SUBJECTS_DATA[reg][dept][semi];
              if (Array.isArray(subjectList)) {
                  const matched = subjectList.find(s => s.code.toString().trim() === searchCode);
                  if (matched) { return { ...matched, semi: matched.semi || semi, dept: dept };
                }
              }
          }
      }
  }

  for (const reg in SUBJECTS_DATA) {
      for (const dept in SUBJECTS_DATA[reg]) {
          for (const semi in SUBJECTS_DATA[reg][dept]) {
              const subjectList = SUBJECTS_DATA[reg][dept][semi];
              if (Array.isArray(subjectList)) {
                  const matched = subjectList.find(s => s.code.toString().trim() === searchCode);
                  if (matched) {
                      return { ...matched, semi: matched.semi || semi, dept: dept };
                  }
              }
          }
      }
  }
  return null;
}

const SUBJECTS_DATA = {
  "2022": {
    "(61) Architecture": {
      "1st": [
        { "code": "21011", "name": "Engineering Drawing", "tf": 0, "pf": 50 },
        { "code": "25711", "name": "Bangla-I", "tf": 60, "pf": 0 },
        { "code": "25712", "name": "English-I", "tf": 60, "pf": 0 },
        { "code": "25812", "name": "Physical Education & Life Skills Development", "tf": 0, "pf": 25 },
        { "code": "25911", "name": "Mathematics -I", "tf": 90, "pf": 25 },
        { "code": "25913", "name": "Chemistry", "tf": 90, "pf": 25 },
        { "code": "26111", "name": "Creativity and Concept Development", "tf": 30, "pf": 25 },
        { "code": "26711", "name": "Basic Electricity", "tf": 90, "pf": 25 }
      ],
      "2nd": [
        { "code": "25721", "name": "Bangla -II", "tf": 60, "pf": 0 },
        { "code": "25722", "name": "English-II", "tf": 60, "pf": 0 },
        { "code": "25912", "name": "Physics -I", "tf": 90, "pf": 25 },
        { "code": "25921", "name": "Mathematics-II", "tf": 90, "pf": 25 },
        { "code": "26121", "name": "Architectural Design-I", "tf": 60, "pf": 50 },
        { "code": "26411", "name": "Civil Engineering Metarials", "tf": 60, "pf": 25 },
        { "code": "28511", "name": "Computer Office Application", "tf": 0, "pf": 50 }
      ],
      "3rd": [
        { "code": "25922", "name": "Physics-II", "tf": 90, "pf": 25 },
        { "code": "25931", "name": "Mathematics-III", "tf": 90, "pf": 25 },
        { "code": "26131", "name": "Architectural Design-II", "tf": 90, "pf": 25 },
        { "code": "26132", "name": "Architectural Graphics", "tf": 60, "pf": 25 },
        { "code": "26133", "name": "Working Drawing-I", "tf": 30, "pf": 25 },
        { "code": "26134", "name": "Climatology", "tf": 60, "pf": 0 },
        { "code": "26135", "name": "Computer Aided Drawing -I", "tf": 0, "pf": 50 }
      ],
      "4th": [
        { "code": "25811", "name": "Social Science", "tf": 60, "pf": 0 },
        { "code": "25841", "name": "Accounting", "tf": 60, "pf": 0 },
        { "code": "26141", "name": "Architectural Design-III", "tf": 60, "pf": 50 },
        { "code": "26142", "name": "History of Architecture-I", "tf": 60, "pf": 0 },
        { "code": "26143", "name": "Working Drawing -II", "tf": 60, "pf": 25 },
        { "code": "26144", "name": "Computer Aided Drawing -II", "tf": 0, "pf": 50 },
        { "code": "26434", "name": "Basic Construction Process", "tf": 60, "pf": 25 },
        { "code": "26447", "name": "Basic Estimating & Costing", "tf": 60, "pf": 25 }
      ],
      "5th": [
        { "code": "25831", "name": "Business Communication", "tf": 60, "pf": 0 },
        { "code": "26151", "name": "Architectural Design-IV", "tf": 60, "pf": 50 },
        { "code": "26152", "name": "History of Architecture-II", "tf": 60, "pf": 0 },
        { "code": "26153", "name": "Model Making", "tf": 0, "pf": 50 },
        { "code": "26154", "name": "Presentation and Visual Technique", "tf": 0, "pf": 50 },
        { "code": "26431", "name": "Structural Mechanics", "tf": 60, "pf": 25 },
        { "code": "26457", "name": "Water Supply and Sanitary Engineering", "tf": 90, "pf": 25 }
      ],
      "6th": [
        { "code": "25852", "name": "Industrial Management", "tf": 60, "pf": 0 },
        { "code": "26161", "name": "Architectural Design-V", "tf": 30, "pf": 50 },
        { "code": "26162", "name": "Computer Rendering and Animation-I", "tf": 0, "pf": 50 },
        { "code": "26163", "name": "Landscape Design", "tf": 30, "pf": 25 },
        { "code": "26164", "name": "Modern Architecture", "tf": 60, "pf": 0 },
        { "code": "26165", "name": "Interior Design -I", "tf": 30, "pf": 25 },
        { "code": "26464", "name": "Design of Structure-I", "tf": 60, "pf": 25 },
        { "code": "29041", "name": "Environmental Studies", "tf": 60, "pf": 25 }
      ],
      "7th": [
        { "code": "25851", "name": "Principles of Marketing", "tf": 60, "pf": 0 },
        { "code": "25853", "name": "Innovation & Entrepreneurship", "tf": 60, "pf": 0 },
        { "code": "26171", "name": "Architectural Project", "tf": 30, "pf": 50 },
        { "code": "26172", "name": "Computer Rendering and Animation-II", "tf": 0, "pf": 50 },
        { "code": "26173", "name": "Urban Planning", "tf": 60, "pf": 25 },
        { "code": "26174", "name": "Professional Practice", "tf": 90, "pf": 0 },
        { "code": "26175", "name": "Interior Design -II", "tf": 60, "pf": 25 },
        { "code": "27821", "name": "Basic Surveying", "tf": 60, "pf": 25 }
      ],
      "8th": [{ "code": "26181", "name": "Industrial Attachement", "tf": 0, "pf": 200 }]
    },

    "(62) Automobile": {
      "1st": [
        { "code": "21011", "name": "Engineering Drawing", "tf": 0, "pf": 50 },
        { "code": "25711", "name": "Bangla-I", "tf": 60, "pf": 0 },
        { "code": "25712", "name": "English-I", "tf": 60, "pf": 0 },
        { "code": "25911", "name": "Mathematics -I", "tf": 90, "pf": 25 },
        { "code": "25912", "name": "Physics -I", "tf": 90, "pf": 25 },
        { "code": "26211", "name": "Automobile Fundamentals", "tf": 60, "pf": 25 },
        { "code": "26711", "name": "Basic Electricity", "tf": 90, "pf": 25 }
      ],
      "2nd": [
        { "code": "25721", "name": "Bangla -II", "tf": 60, "pf": 0 },
        { "code": "25722", "name": "English-II", "tf": 60, "pf": 0 },
        { "code": "25812", "name": "Physical Education & Life Skills Development", "tf": 0, "pf": 25 },
        { "code": "25913", "name": "Chemistry", "tf": 90, "pf": 25 },
        { "code": "25921", "name": "Mathematics-II", "tf": 90, "pf": 25 },
        { "code": "25922", "name": "Physics-II", "tf": 90, "pf": 25 },
        { "code": "26221", "name": "Automotive Engine System-I", "tf": 60, "pf": 25 },
        { "code": "27011", "name": "Basic Workshop Practice", "tf": 0, "pf": 25 }
      ],
      "3rd": [
        { "code": "25811", "name": "Social Science", "tf": 60, "pf": 0 },
        { "code": "25931", "name": "Mathematics-III", "tf": 90, "pf": 25 },
        { "code": "26231", "name": "Automotive Engine System-II", "tf": 60, "pf": 25 },
        { "code": "26811", "name": "Basic Electronics", "tf": 60, "pf": 25 },
        { "code": "27012", "name": "Machine Shop Practice I", "tf": 30, "pf": 50 },
        { "code": "27031", "name": "Mechanical Engineering Materials", "tf": 60, "pf": 0 },
        { "code": "28511", "name": "Computer Office Application", "tf": 0, "pf": 50 }
      ],
      "4th": [
        { "code": "25841", "name": "Accounting", "tf": 60, "pf": 0 },
        { "code": "26241", "name": "Automotive Body Building", "tf": 60, "pf": 25 },
        { "code": "27041", "name": "Engineering Mechanics", "tf": 60, "pf": 25 },
        { "code": "27043", "name": "Metallurgy", "tf": 60, "pf": 25 },
        { "code": "27131", "name": "Engineering Thermodynamics", "tf": 90, "pf": 25 },
        { "code": "27142", "name": "Fuels & Lubricants", "tf": 60, "pf": 25 },
        { "code": "29041", "name": "Environmental Studies", "tf": 60, "pf": 25 }
      ],
      "5th": [
        { "code": "25852", "name": "Industrial Management", "tf": 60, "pf": 0 },
        { "code": "26251", "name": "Automobile Air- Conditioning", "tf": 60, "pf": 25 },
        { "code": "26252", "name": "Advance Automotive Mechanisms & Vehicle driving", "tf": 60, "pf": 25 },
        { "code": "27051", "name": "Fluid Mechanics & Machineries", "tf": 90, "pf": 25 },
        { "code": "27052", "name": "Mechanical Estimating & Costing", "tf": 60, "pf": 25 },
        { "code": "27053", "name": "Advanced Welding-I", "tf": 60, "pf": 50 },
        { "code": "27055", "name": "Manufacturing Process", "tf": 90, "pf": 0 }
      ],
      "6th": [
        { "code": "25831", "name": "Business Communication", "tf": 60, "pf": 0 },
        { "code": "25851", "name": "Principles of Marketing", "tf": 60, "pf": 0 },
        { "code": "26261", "name": "Engine Overhauling & Inspection", "tf": 60, "pf": 25 },
        { "code": "26262", "name": "Suspension, Brake, Steering & Transmission System of Vehicle", "tf": 60, "pf": 25 },
        { "code": "26263", "name": "Specialized Vehicles, Two & Three Wheelers", "tf": 60, "pf": 25 },
        { "code": "27054", "name": "Foundry & Pattern Making", "tf": 60, "pf": 25 },
        { "code": "27061", "name": "Strength of Materials", "tf": 90, "pf": 25 },
        { "code": "27062", "name": "Mechanical Measurement & Metrology", "tf": 60, "pf": 25 }
      ],
      "7th": [
        { "code": "25853", "name": "Innovation & Entrepreneurship", "tf": 60, "pf": 0 },
        { "code": "26271", "name": "Automotive Electrical, Electronics & Automation", "tf": 60, "pf": 25 },
        { "code": "26272", "name": "Automotive Testing & Emission Control", "tf": 60, "pf": 25 },
        { "code": "26273", "name": "Shop Equipment, Service Station Operation & Workshop Practice", "tf": 60, "pf": 25 },
        { "code": "26274", "name": "Automobile Engineering Project", "tf": 0, "pf": 50 },
        { "code": "27071", "name": "Design of Machine Elements", "tf": 90, "pf": 25 },
        { "code": "29231", "name": "Mechatronics & PLC", "tf": 90, "pf": 25 }
      ],
      "8th": [
        { "code": "26281", "name": "Industrial Attachement", "tf": 0, "pf": 200 }
      ]
    },

    "(64) Civil": {
      "1st": [
        { "code": "21011", "name": "Engineering Drawing", "tf": 0, "pf": 50 },
        { "code": "25711", "name": "Bangla-I", "tf": 60, "pf": 0 },
        { "code": "25712", "name": "English-I", "tf": 60, "pf": 0 },
        { "code": "25811", "name": "Social Science", "tf": 60, "pf": 0 },
        { "code": "25911", "name": "Mathematics -I", "tf": 90, "pf": 25 },
        { "code": "25913", "name": "Chemistry", "tf": 90, "pf": 25 },
        { "code": "26411", "name": "Civil Engineering Metarials", "tf": 60, "pf": 25 },
        { "code": "26711", "name": "Basic Electricity", "tf": 90, "pf": 25 }
      ],
      "2nd": [
        { "code": "25721", "name": "Bangla -II", "tf": 60, "pf": 0 },
        { "code": "25722", "name": "English-II", "tf": 60, "pf": 0 },
        { "code": "25812", "name": "Physical Education & Life Skills Development", "tf": 0, "pf": 25 },
        { "code": "25912", "name": "Physics -I", "tf": 90, "pf": 25 },
        { "code": "25921", "name": "Mathematics-II", "tf": 90, "pf": 25 },
        { "code": "26421", "name": "Civil Engineering Drawing", "tf": 30, "pf": 50 },
        { "code": "26811", "name": "Basic Electronics", "tf": 60, "pf": 25 },
        { "code": "27011", "name": "Basic Workshop Practice", "tf": 0, "pf": 25 }
      ],
      "3rd": [
        { "code": "25831", "name": "Business Communication", "tf": 60, "pf": 0 },
        { "code": "25922", "name": "Physics-II", "tf": 90, "pf": 25 },
        { "code": "25931", "name": "Mathematics-III", "tf": 90, "pf": 25 },
        { "code": "26431", "name": "Structural Mechanics", "tf": 60, "pf": 25 },
        { "code": "26432", "name": "Surveying-I", "tf": 60, "pf": 25 },
        { "code": "26433", "name": "Construction Process-I", "tf": 60, "pf": 25 },
        { "code": "28511", "name": "Computer Office Application", "tf": 0, "pf": 50 }
      ],
     "4th": [
        { "code": "25841", "name": "Accounting", "tf": 60, "pf": 0 },
        { "code": "26441", "name": "Construction Process-II", "tf": 60, "pf": 25 },
        { "code": "26442", "name": "Estimating & Costing-I", "tf": 60, "pf": 25 },
        { "code": "26443", "name": "Civil CAD-I", "tf": 30, "pf": 25 },
        { "code": "26444", "name": "Surveying-II", "tf": 60, "pf": 25 },
        { "code": "26445", "name": "Geotechnical Engineering", "tf": 60, "pf": 25 },
        { "code": "26446", "name": "Hydrology", "tf": 60, "pf": 25 },
        { "code": "26521", "name": "Wood Workshop Practice", "tf": 30, "pf": 25 }
      ],
      "5th": [
        { "code": "25852", "name": "Industrial Management", "tf": 60, "pf": 0 },
        { "code": "26451", "name": "Foundation Engineering", "tf": 60, "pf": 25 },
        { "code": "26452", "name": "Civil CAD-II", "tf": 30, "pf": 50 },
        { "code": "26453", "name": "Surveying-III", "tf": 60, "pf": 25 },
        { "code": "26454", "name": "Theory of Structure", "tf": 60, "pf": 25 },
        { "code": "26455", "name": "Water Supply Engineering", "tf": 60, "pf": 25 },
        { "code": "26456", "name": "Hydraulics", "tf": 60, "pf": 25 }
      ],
      "6th": [
        { "code": "26461", "name": "Water Resources Engineering", "tf": 60, "pf": 25 },
        { "code": "26462", "name": "Advance Surveying", "tf": 60, "pf": 25 },
        { "code": "26463", "name": "Transportation Engineering-I", "tf": 60, "pf": 25 },
        { "code": "26464", "name": "Design of Structure-I", "tf": 60, "pf": 25 },
        { "code": "28861", "name": "Advanced Construction", "tf": 60, "pf": 25 },
        { "code": "28863", "name": "Steel Structures", "tf": 60, "pf": 25 },
        { "code": "29041", "name": "Environmental Studies", "tf": 60, "pf": 25 }
      ],
      "7th": [
        { "code": "25851", "name": "Principle of Marketing", "tf": 60, "pf": 0 },
        { "code": "25853", "name": "Innovation & Entrepreneurship", "tf": 60, "pf": 0 },
        { "code": "26471", "name": "Civil Engineering Project", "tf": 0, "pf": 50 },
        { "code": "26472", "name": "Sanitary Engineering", "tf": 60, "pf": 25 },
        { "code": "26473", "name": "Transportation Engineering-II", "tf": 60, "pf": 25 },
        { "code": "26474", "name": "Design of Structure-II", "tf": 60, "pf": 25 },
        { "code": "26475", "name": "Estimating & Costing-II", "tf": 60, "pf": 25 },
        { "code": "28871", "name": "Construction Management & Documentation", "tf": 60, "pf": 25 }
      ],
      "8th": [
        { "code": "26481", "name": "Industrial Attachement", "tf": 0, "pf": 300 }
      ]
    },

    "(67) Electrical": {
      "1st": [
        { "code": "21011", "name": "Engineering Drawing", "tf": 0, "pf": 50 },
        { "code": "25711", "name": "Bangla-I", "tf": 60, "pf": 0 },
        { "code": "25712", "name": "English-I", "tf": 60, "pf": 0 },
        { "code": "25812", "name": "Physical Education & Life skill Development", "tf": 0, "pf": 25 },
        { "code": "25911", "name": "Mathematics -I", "tf": 90, "pf": 25 },
        { "code": "25912", "name": "Physics-I", "tf": 90, "pf": 25 },
        { "code": "26711", "name": "Basic Electricity", "tf": 90, "pf": 25 },
        { "code": "26712", "name": "Electrical Engineering Materials", "tf": 60, "pf": 0 }
      ],
      "2nd": [
        { "code": "25721", "name": "Bangla -II", "tf": 60, "pf": 0 },
        { "code": "25722", "name": "English-II", "tf": 60, "pf": 0 },
        { "code": "25921", "name": "Mathematics-II", "tf": 90, "pf": 25 },
        { "code": "25922", "name": "Physics -II", "tf": 90, "pf": 25 },
        { "code": "26721", "name": "Electrical Circuits-I", "tf": 90, "pf": 25 },
        { "code": "26722", "name": "Electrical Engineering Drawing", "tf": 30, "pf": 50 },
        { "code": "26811", "name": "Basic Electronics", "tf": 60, "pf": 25 }
      ],
      "3rd": [
        { "code": "25913", "name": "Chemistry", "tf": 90, "pf": 25 },
        { "code": "25931", "name": "Mathematics-III", "tf": 90, "pf": 25 },
        { "code": "26731", "name": "Electrical Circuits-II", "tf": 90, "pf": 25 },
        { "code": "26732", "name": "Electrical Appliances", "tf": 60, "pf": 25 },
        { "code": "26833", "name": "Industrial Electronics", "tf": 90, "pf": 25 },
        { "code": "28511", "name": "Computer Office Applications", "tf": 0, "pf": 50 }
      ],
      "4th": [
        { "code": "25811", "name": "Social Science", "tf": 60, "pf": 0 },
        { "code": "25841", "name": "Accounting", "tf": 60, "pf": 0 },
        { "code": "26741", "name": "Electrical Installation, Planning and Estimating", "tf": 90, "pf": 25 },
        { "code": "26742", "name": "DC Machine", "tf": 90, "pf": 25 },
        { "code": "26743", "name": "Electrical Engineering Project-I", "tf": 0, "pf": 50 },
        { "code": "26845", "name": "Digital Electronics", "tf": 90, "pf": 25 },
        { "code": "27044", "name": "Applied Mechanics", "tf": 60, "pf": 25 }
      ],
      "5th": [
        { "code": "25851", "name": "Principle of Marketing", "tf": 60, "pf": 0 },
        { "code": "25852", "name": "Industrial Management", "tf": 60, "pf": 0 },
        { "code": "26751", "name": "Generation of Electrical Power", "tf": 90, "pf": 25 },
        { "code": "26752", "name": "Electrical & Electronic Measurements-I", "tf": 60, "pf": 25 },
        { "code": "26753", "name": "Testing and Maintannance of Electrical Equipments", "tf": 60, "pf": 25 },
        { "code": "26754", "name": "Electrical Engineering Project-II", "tf": 0, "pf": 50 },
        { "code": "26853", "name": "Microprocessor & Microcontroller", "tf": 90, "pf": 25 }
      ],
      "6th": [
        { "code": "26761", "name": "AC Machine-I", "tf": 90, "pf": 25 },
        { "code": "26762", "name": "Transmission and Distribution of Electrical Power-I", "tf": 90, "pf": 25 },
        { "code": "26763", "name": "Electrical & Electronic Measurements-II", "tf": 60, "pf": 25 },
        { "code": "26842", "name": "Communication Engineering", "tf": 90, "pf": 25 },
        { "code": "28567", "name": "Progamming in C", "tf": 60, "pf": 25 },
        { "code": "29041", "name": "Environmental Studies", "tf": 60, "pf": 25 }
      ],
      "7th": [
        { "code": "25831", "name": "Business  Communication", "tf": 60, "pf": 0 },
        { "code": "25853", "name": "Innovation & Entrepreneurship", "tf": 60, "pf": 0 },
        { "code": "26771", "name": "AC Machine-II", "tf": 90, "pf": 25 },
        { "code": "26772", "name": "Transmission and Distribution of Electrical Power-II", "tf": 90, "pf": 25 },
        { "code": "26773", "name": "Switch Gear and Protection", "tf": 90, "pf": 25 },
        { "code": "26774", "name": "Electrical Engineering Project-III", "tf": 0, "pf": 50 },
        { "code": "26875", "name": "Automation Engineering & PLC", "tf": 90, "pf": 25 }
      ],
      "8th": [
        { "code": "26781", "name": "Industrial Attachement", "tf": 0, "pf": 300 }
      ]
    },

    "(69) Food": {
      "1st": [
        { "code": "21011", "name": "Engineering Drawing", "tf": 0, "pf": 50 },
        { "code": "25711", "name": "Bangla-I", "tf": 60, "pf": 0 },
        { "code": "25712", "name": "English-I", "tf": 60, "pf": 0 },
        { "code": "25812", "name": "Physical Education & Life skills Development", "tf": 0, "pf": 25 },
        { "code": "25911", "name": "Mathematics -I", "tf": 90, "pf": 25 },
        { "code": "25913", "name": "Chemistry", "tf": 90, "pf": 25 },
        { "code": "26911", "name": "Food Engineering Fundamentals", "tf": 60, "pf": 25 },
        { "code": "26912", "name": "Food Safety & Hygiene Management", "tf": 60, "pf": 25 }
      ],
      "2nd": [
        { "code": "25721", "name": "Bangla -II", "tf": 60, "pf": 0 },
        { "code": "25722", "name": "English-II", "tf": 60, "pf": 0 },
        { "code": "25912", "name": "Physics -I", "tf": 90, "pf": 25 },
        { "code": "25921", "name": "Mathematics-II", "tf": 90, "pf": 25 },
        { "code": "26711", "name": "Basic Electricity", "tf": 90, "pf": 25 },
        { "code": "26921", "name": "Food Science & Nutrition", "tf": 60, "pf": 25 },
        { "code": "26922", "name": "Food Plant Layout & Design", "tf": 30, "pf": 25 },
        { "code": "27011", "name": "Basic Workshop Practice", "tf": 0, "pf": 25 }
      ],
      "3rd": [
        { "code": "25811", "name": "Social Science", "tf": 60, "pf": 0 },
        { "code": "25922", "name": "Physics-II", "tf": 90, "pf": 25 },
        { "code": "25931", "name": "Mathematics-III", "tf": 90, "pf": 25 },
        { "code": "28511", "name": "Computer office Application", "tf": 0, "pf": 50 },
        { "code": "26811", "name": "Basic Electronics", "tf": 60, "pf": 25 },
        { "code": "26931", "name": "Catering Management", "tf": 60, "pf": 25 },
        { "code": "26932", "name": "Food Industrial Chemistry", "tf": 60, "pf": 25 }
      ],
      "4th": [
        { "code": "25831", "name": "Business Communication", "tf": 60, "pf": 0 },
        { "code": "25841", "name": "Accounting", "tf": 60, "pf": 0 },
        { "code": "26941", "name": "Food Microbiology-I", "tf": 60, "pf": 25 },
        { "code": "26942", "name": "Food Preservation-I", "tf": 60, "pf": 25 },
        { "code": "26943", "name": "Food Chemistry", "tf": 60, "pf": 25 },
        { "code": "26944", "name": "Food Packaging", "tf": 60, "pf": 25 },
        { "code": "26945", "name": "Dairy Products", "tf": 60, "pf": 25 },
        { "code": "27041", "name": "Engineering Mechanics", "tf": 60, "pf": 25 }
      ],
      "5th": [
        { "code": "25852", "name": "Industrial Management", "tf": 60, "pf": 0 },
        { "code": "26355", "name": "Refrigeration & Cold Storage", "tf": 60, "pf": 25 },
        { "code": "26951", "name": "Food Microbiology-II", "tf": 60, "pf": 25 },
        { "code": "26952", "name": "Food Preservation-II", "tf": 60, "pf": 25 },
        { "code": "26953", "name": "Food Biotechnology", "tf": 60, "pf": 25 },
        { "code": "26954", "name": "Food & Beverage Products", "tf": 60, "pf": 25 },
        { "code": "26955", "name": "Food Industrial Instrumentation & Process Control", "tf": 60, "pf": 25 }
      ],
      "6th": [
        { "code": "26364", "name": "Industrial Stoichiometry & Thermodynamics", "tf": 60, "pf": 25 },
        { "code": "26365", "name": "Instrumental Methods of Analysis", "tf": 60, "pf": 25 },
        { "code": "26961", "name": "Food Engineering Operation-I", "tf": 60, "pf": 25 },
        { "code": "26962", "name": "Food Process Industries-I", "tf": 60, "pf": 25 },
        { "code": "26963", "name": "Bakery Products", "tf": 60, "pf": 25 },
        { "code": "26964", "name": "Food Adulteration & Toxicology", "tf": 60, "pf": 25 },
        { "code": "29041", "name": "Environmental Studies", "tf": 60, "pf": 25 }
      ],
      "7th": [
        { "code": "25851", "name": "Principles of Marketing", "tf": 60, "pf": 0 },
        { "code": "25853", "name": "Innovation & Entrepreneurship", "tf": 60, "pf": 0 },
        { "code": "26971", "name": "Food Engineering Operation-II", "tf": 60, "pf": 25 },
        { "code": "26972", "name": "Food Process Industries-II", "tf": 60, "pf": 25 },
        { "code": "26973", "name": "Food Quality Control & Assurance", "tf": 60, "pf": 25 },
        { "code": "26974", "name": "Confectionery Products", "tf": 60, "pf": 25 },
        { "code": "26975", "name": "Food Analysis", "tf": 60, "pf": 25 },
        { "code": "26976", "name": "Food Engineering Project", "tf": 0, "pf": 50 }
      ],
      "8th": [
        { "code": "26981", "name": "Industrial Attachment", "tf": 0, "pf": 200 }
      ]
    },

    "(70) Mechanical": {
      "1st": [
        { "code": "21011", "name": "Engineering Drawing", "tf": 0, "pf": 50 },
        { "code": "25711", "name": "Bangla-I", "tf": 60, "pf": 0 },
        { "code": "25712", "name": "English-I", "tf": 60, "pf": 0 },
        { "code": "25812", "name": "Physical Education & Life Skills Development", "tf": 0, "pf": 25 },
        { "code": "25911", "name": "Mathematics -I", "tf": 90, "pf": 25 },
        { "code": "25912", "name": "Physics -I", "tf": 90, "pf": 25 },
        { "code": "27011", "name": "Basic Workshop Practice", "tf": 0, "pf": 25 },
        { "code": "27012", "name": "Machine Shop Practice I", "tf": 30, "pf": 50 }
      ],
      "2nd": [
        { "code": "25721", "name": "Bangla -II", "tf": 60, "pf": 0 },
        { "code": "25722", "name": "English-II", "tf": 60, "pf": 0 },
        { "code": "25913", "name": "Chemistry", "tf": 90, "pf": 25 },
        { "code": "25921", "name": "Mathematics-II", "tf": 90, "pf": 25 },
        { "code": "25922", "name": "Physics -II", "tf": 90, "pf": 25 },
        { "code": "26711", "name": "Basic Electricity", "tf": 90, "pf": 25 },
        { "code": "27021", "name": "Mechanical Engineering Drawing", "tf": 30, "pf": 50 }
      ],
      "3rd": [
        { "code": "25811", "name": "Social Science", "tf": 60, "pf": 0 },
        { "code": "25831", "name": "Business Communication", "tf": 60, "pf": 0 },
        { "code": "25931", "name": "Mathematics-III", "tf": 90, "pf": 25 },
        { "code": "27031", "name": "Mechanical Engineering Materials", "tf": 60, "pf": 0 },
        { "code": "27032", "name": "Machine Shop Practice-II", "tf": 30, "pf": 50 },
        { "code": "27231", "name": "RAC Cycles and Components", "tf": 60, "pf": 25 },
        { "code": "28511", "name": "Computer Office Application", "tf": 0, "pf": 50 }
      ],
      "4th": [
        { "code": "25841", "name": "Accounting", "tf": 60, "pf": 0 },
        { "code": "26811", "name": "Basic Electronics", "tf": 60, "pf": 25 },
        { "code": "27041", "name": "Engineering Mechanics", "tf": 60, "pf": 25 },
        { "code": "27042", "name": "Machine Shop Practice III", "tf": 30, "pf": 50 },
        { "code": "27043", "name": "Metallurgy", "tf": 60, "pf": 25 },
        { "code": "27131", "name": "Engineering Thermodynamics", "tf": 90, "pf": 25 },
        { "code": "29041", "name": "Environmental Studies", "tf": 60, "pf": 25 }
      ],
      "5th": [
        { "code": "25852", "name": "Industrial Management", "tf": 60, "pf": 0 },
        { "code": "27051", "name": "Fluid Mechanics & Machineries", "tf": 90, "pf": 25 },
        { "code": "27052", "name": "Mechanical Estimating & Costing", "tf": 60, "pf": 25 },
        { "code": "27053", "name": "Advanced Welding-I", "tf": 60, "pf": 50 },
        { "code": "27054", "name": "Foundry & Pattern Making", "tf": 60, "pf": 25 },
        { "code": "27055", "name": "Manufacturing Process", "tf": 90, "pf": 0 },
        { "code": "28567", "name": "Progamming in C", "tf": 60, "pf": 25 }
      ],
      "6th": [
        { "code": "25851", "name": "Principles of Marketing", "tf": 60, "pf": 0 },
        { "code": "26211", "name": "Automobile Fundamentals", "tf": 60, "pf": 25 },
        { "code": "27061", "name": "Strength of Materials", "tf": 90, "pf": 25 },
        { "code": "27062", "name": "Mechanical Measurement & Metrology", "tf": 60, "pf": 25 },
        { "code": "27063", "name": "CAD & CAM", "tf": 30, "pf": 50 },
        { "code": "27064", "name": "Advanced Welding-II", "tf": 60, "pf": 25 },
        { "code": "27065", "name": "Plant Engineering & Maintainance", "tf": 60, "pf": 25 }
      ],
      "7th": [
        { "code": "25853", "name": "Innovation & Entrepreneurship", "tf": 60, "pf": 0 },
        { "code": "27071", "name": "Design of Machine Elements", "tf": 90, "pf": 25 },
        { "code": "27072", "name": "Tool Design", "tf": 90, "pf": 25 },
        { "code": "27073", "name": "Heat Treatment of Metal", "tf": 60, "pf": 25 },
        { "code": "27074", "name": "Mechanical Engineering Project", "tf": 0, "pf": 50 },
        { "code": "27075", "name": "Production Planning & Control", "tf": 90, "pf": 0 },
        { "code": "29231", "name": "Mechatronics & PLC", "tf": 90, "pf": 25 }
      ],
      "8th": [
        { "code": "27081", "name": "Industrial Attachement", "tf": 0, "pf": 300 }
      ]
    },

    "(78) Surveying": {
      "1st": [
        { "code": "21011", "name": "Engineering Drawing", "tf": 0, "pf": 50 },
        { "code": "25711", "name": "Bangla-I", "tf": 60, "pf": 0 },
        { "code": "25712", "name": "English-I", "tf": 60, "pf": 0 },
        { "code": "25811", "name": "Social Science", "tf": 60, "pf": 0 },
        { "code": "25911", "name": "Mathematics -I", "tf": 90, "pf": 25 },
        { "code": "25912", "name": "Physics -I", "tf": 90, "pf": 25 },
        { "code": "26411", "name": "Civil Engineering Materials", "tf": 60, "pf": 25 },
        { "code": "26711", "name": "Basic Electricity", "tf": 90, "pf": 25 }
      ],
      "2nd": [
        { "code": "25721", "name": "Bangla -II", "tf": 60, "pf": 0 },
        { "code": "25722", "name": "English -II", "tf": 60, "pf": 0 },
        { "code": "25812", "name": "Physical Education & Life skills Development", "tf": 0, "pf": 25 },
        { "code": "25921", "name": "Mathematics-II", "tf": 90, "pf": 25 },
        { "code": "25922", "name": "Physics -II", "tf": 90, "pf": 25 },
        { "code": "28511", "name": "Computer Office Application", "tf": 0, "pf": 50 },
        { "code": "26811", "name": "Basic Electronics", "tf": 60, "pf": 25 },
        { "code": "27821", "name": "Basic Surveying", "tf": 60, "pf": 25 }
      ],
      "3rd": [
        { "code": "25913", "name": "Chemistry", "tf": 90, "pf": 25 },
        { "code": "25931", "name": "Mathematics-III", "tf": 90, "pf": 25 },
        { "code": "25916", "name": "Statistics", "tf": 60, "pf": 0 },
        { "code": "26434", "name": "Basic Construction Process", "tf": 60, "pf": 25 },
        { "code": "27831", "name": "Leveling", "tf": 60, "pf": 25 },
        { "code": "27832", "name": "Survey CAD", "tf": 30, "pf": 25 },
        { "code": "27833", "name": "Geography of Bangladesh", "tf": 60, "pf": 0 },
        { "code": "27834", "name": "Geodetic Surveying", "tf": 60, "pf": 25 }
      ],
      "4th": [
        { "code": "25831", "name": "Business Communication", "tf": 60, "pf": 0 },
        { "code": "26431", "name": "Structural Mechanics", "tf": 60, "pf": 25 },
        { "code": "26447", "name": "Basic Estimating & Costing", "tf": 60, "pf": 25 },
        { "code": "27841", "name": "Aerial Photography and Photogrammetry", "tf": 30, "pf": 25 },
        { "code": "27842", "name": "Fundamentals of GIS", "tf": 60, "pf": 25 },
        { "code": "27843", "name": "Advanced Surveying-I", "tf": 60, "pf": 50 },
        { "code": "27844", "name": "Digital Cartography", "tf": 60, "pf": 25 }
      ],
      "5th": [
        { "code": "25841", "name": "Accounting", "tf": 60, "pf": 0 },
        { "code": "26454", "name": "Theory of Structure", "tf": 60, "pf": 25 },
        { "code": "28521", "name": "Python Programming", "tf": 60, "pf": 25 },
        { "code": "27851", "name": "Advanced GIS", "tf": 60, "pf": 25 },
        { "code": "27852", "name": "Hydraulics & Hydrology", "tf": 60, "pf": 25 },
        { "code": "27853", "name": "Advanced Surveying-II", "tf": 60, "pf": 25 },
        { "code": "27854", "name": "Land Laws of Bangladesh", "tf": 60, "pf": 0 },
        { "code": "29041", "name": "Environmental Studies", "tf": 60, "pf": 25 }
      ],
      "6th": [
        { "code": "25852", "name": "Industrial Management", "tf": 60, "pf": 0 },
        { "code": "26463", "name": "Transportation Engineering-I", "tf": 60, "pf": 25 },
        { "code": "26464", "name": "Design of Structure-I", "tf": 60, "pf": 25 },
        { "code": "27861", "name": "Principles of Topographic Survey", "tf": 60, "pf": 0 },
        { "code": "27862", "name": "Application of Python Programming", "tf": 0, "pf": 50 },
        { "code": "27863", "name": "Hydrographic Surveying", "tf": 60, "pf": 25 },
        { "code": "27864", "name": "Survey Project-I", "tf": 0, "pf": 50 },
        { "code": "27865", "name": "Preapartion and Maintainces of Land Records", "tf": 60, "pf": 0 }
      ],
      "7th": [
        { "code": "25851", "name": "Principles of Marketing", "tf": 60, "pf": 0 },
        { "code": "25853", "name": "Innovation & Entrepreneurship", "tf": 60, "pf": 0 },
        { "code": "26473", "name": "Transportation Enggineering-II", "tf": 60, "pf": 25 },
        { "code": "26474", "name": "Design of Structure -II", "tf": 60, "pf": 25 },
        { "code": "27871", "name": "Mine Surveying", "tf": 60, "pf": 25 },
        { "code": "27872", "name": "Survey Project-II", "tf": 0, "pf": 50 },
        { "code": "27873", "name": "Remote Sensing", "tf": 60, "pf": 25 },
        { "code": "28871", "name": "Construction Mangement & Documentaion", "tf": 60, "pf": 25 }
      ],
      "8th": [
        { "code": "67881", "name": "Industrial Attachement", "tf": 0, "pf": 200 }
      ]
    },

    "(85) Computer": {
      "1st": [
        { "code": "21011", "name": "Engineering Drawing", "tf": 0, "pf": 50 },
        { "code": "25711", "name": "Bangla-I", "tf": 60, "pf": 0 },
        { "code": "25712", "name": "English-I", "tf": 60, "pf": 0 },
        { "code": "25911", "name": "Mathematics -I", "tf": 90, "pf": 25 },
        { "code": "25912", "name": "Physics -I", "tf": 90, "pf": 25 },
        { "code": "26711", "name": "Basic Electricity", "tf": 90, "pf": 25 },
        { "code": "28511", "name": "Computer Office Application", "tf": 0, "pf": 50 }
      ],
      "2nd": [
        { "code": "25721", "name": "Bangla -II", "tf": 60, "pf": 0 },
        { "code": "25722", "name": "English-II", "tf": 60, "pf": 0 },
        { "code": "25812", "name": "Physical Education & Life skills Development", "tf": 0, "pf": 25 },
        { "code": "25913", "name": "Chemistry", "tf": 90, "pf": 25 },
        { "code": "25921", "name": "Mathematics-II", "tf": 90, "pf": 25 },
        { "code": "26811", "name": "Basic Electronics", "tf": 60, "pf": 25 },
        { "code": "28521", "name": "Python Programming", "tf": 60, "pf": 25 },
        { "code": "28522", "name": "Computer Graphics Design-I", "tf": 0, "pf": 50 }
      ],
      "3rd": [
        { "code": "25811", "name": "Social Science", "tf": 60, "pf": 0 },
        { "code": "25922", "name": "Physics -II", "tf": 90, "pf": 25 },
        { "code": "25931", "name": "Mathematics-III", "tf": 90, "pf": 25 },
        { "code": "26831", "name": "Digital Electronics-I", "tf": 60, "pf": 25 },
        { "code": "28531", "name": "Application Development Using Python", "tf": 60, "pf": 25 },
        { "code": "28532", "name": "Computer Graphics Design-II", "tf": 0, "pf": 25 },
        { "code": "28533", "name": "IT Support Services", "tf": 60, "pf": 50 }
      ],
      "4th": [
        { "code": "25831", "name": "Business Communication", "tf": 60, "pf": 0 },
        { "code": "26841", "name": "Digital Electronics-II", "tf": 60, "pf": 25 },
        { "code": "28541", "name": "Java Programming", "tf": 60, "pf": 25 },
        { "code": "28542", "name": "Data Structure & Algorithm", "tf": 60, "pf": 25 },
        { "code": "28543", "name": "Computer Peripherals & Interfacing", "tf": 90, "pf": 25 },
        { "code": "28544", "name": "Web Design & Development-I", "tf": 30, "pf": 50 },
        { "code": "29041", "name": "Environmental Studies", "tf": 60, "pf": 25 }
      ],
      "5th": [
        { "code": "25841", "name": "Accounting", "tf": 60, "pf": 0 },
        { "code": "28551", "name": "Application Development Using Java", "tf": 60, "pf": 25 },
        { "code": "28552", "name": "Web Design & Development-II", "tf": 30, "pf": 50 },
        { "code": "28553", "name": "Computer Architecture & Microprocessor", "tf": 90, "pf": 25 },
        { "code": "28554", "name": "Data Communication", "tf": 90, "pf": 25 },
        { "code": "28555", "name": "Operating System", "tf": 60, "pf": 25 },
        { "code": "28556", "name": "Project Work-I", "tf": 0, "pf": 25 }
      ],
      "6th": [
        { "code": "25851", "name": "Principles of Marketing", "tf": 60, "pf": 0 },
        { "code": "25852", "name": "Industrial Management", "tf": 60, "pf": 0 },
        { "code": "28561", "name": "Database Management System", "tf": 60, "pf": 25 },
        { "code": "28562", "name": "Computer Networking", "tf": 60, "pf": 25 },
        { "code": "28563", "name": "Sensor & IoT System", "tf": 60, "pf": 25 },
        { "code": "28564", "name": "Microcontroller Based System Design & Development", "tf": 60, "pf": 50 },
        { "code": "28565", "name": "Surveillance Security System", "tf": 30, "pf": 25 },
        { "code": "28566", "name": "Web Development Project", "tf": 0, "pf": 25 }
      ],
      "7th": [
        { "code": "25853", "name": "Innovation & Entrepreneurship", "tf": 60, "pf": 0 },
        { "code": "28571", "name": "Digital Marketing Technique", "tf": 60, "pf": 25 },
        { "code": "28572", "name": "Network Administration & Services", "tf": 90, "pf": 25 },
        { "code": "28573", "name": "Cyber Security & Ethics", "tf": 60, "pf": 25 },
        { "code": "28574", "name": "Apps Development Project", "tf": 30, "pf": 25 },
        { "code": "28575", "name": "Multimedia & Animation", "tf": 60, "pf": 25 },
        { "code": "28576", "name": "Project Work-II", "tf": 0, "pf": 50 }
      ],
      "8th": [
        { "code": "28581", "name": "Industrial Attachement", "tf": 0, "pf": 300 }
      ]
    }
  },
  "2016": {
    "(64) Civil": {
      "1st": [
        { "code": "61011", "name": "Engineering Drawing", "tf": 0, "pf": 50 },
        { "code": "65711", "name": "Bangla", "tf": 90, "pf": 0 },
        { "code": "65712", "name": "English", "tf": 60, "pf": 0 },
        { "code": "65911", "name": "Mathematics‐1", "tf": 90, "pf": 0 },
        { "code": "65912", "name": "Physics‐1", "tf": 90, "pf": 25 },
        { "code": "66712", "name": "Electrical Engineering Fundamentals", "tf": 90, "pf": 25 },
        { "code": "67012", "name": "Workshop Practice", "tf": 0, "pf": 25 }
      ],
      "2nd": [
        { "code": "65722", "name": "Communicative English", "tf": 30, "pf": 0 },
        { "code": "65812", "name": "Physical Education and life Skill Development", "tf": 0, "pf": 25 },
        { "code": "65921", "name": "Mathematics‐2", "tf": 90, "pf": 0 },
        { "code": "65922", "name": "Physics‐2", "tf": 90, "pf": 25 },
        { "code": "66421", "name": "Civil Engineering Materials", "tf": 60, "pf": 25 },
        { "code": "66611", "name": "Computer Application", "tf": 0, "pf": 50 },
        { "code": "66822", "name": "Electronic Engineering Fundamentals", "tf": 60, "pf": 25 }
      ],
      "3rd": [
        { "code": "65811", "name": "Social Science", "tf": 90, "pf": 0 },
        { "code": "65913", "name": "Chemistry", "tf": 90, "pf": 25 },
        { "code": "65931", "name": "Mathematics‐3", "tf": 90, "pf": 0 },
        { "code": "66431", "name": "Civil Engineering Drawing‐1", "tf": 30, "pf": 50 },
        { "code": "66432", "name": "Surveying‐1", "tf": 60, "pf": 25 },
        { "code": "66433", "name": "Construction Process‐1", "tf": 60, "pf": 25 },
        { "code": "66434", "name": "Civil Workshop Practice", "tf": 0, "pf": 25 }
      ],
      "4th": [
        { "code": "65841", "name": "Business Organization & Communication", "tf": 60, "pf": 0 },
        { "code": "66441", "name": "Structural Mechanics", "tf": 60, "pf": 25 },
        { "code": "66442", "name": "Estimating & Costing-1", "tf": 60, "pf": 25 },
        { "code": "66443", "name": "Civil Engineering Drawing-2 (CAD)", "tf": 30, "pf": 50 },
        { "code": "66444", "name": "Surveying-2", "tf": 60, "pf": 25 },
        { "code": "66445", "name": "Geotechnical Engineering", "tf": 60, "pf": 25 },
        { "code": "69054", "name": "Environmental Studies", "tf": 60, "pf": 0 }
      ],
      "5th": [
        { "code": "65851", "name": "Accounting Theory & Practice", "tf": 60, "pf": 0 },
        { "code": "66451", "name": "Construction Process-II", "tf": 60, "pf": 25 },
        { "code": "66452", "name": "Surveying-III", "tf": 60, "pf": 25 },
        { "code": "66453", "name": "Water Supply Engineering", "tf": 60, "pf": 25 },
        { "code": "66454", "name": "Theory of Structure", "tf": 60, "pf": 25 },
        { "code": "66455", "name": "Estimating & Costing-II", "tf": 60, "pf": 25 },
        { "code": "66456", "name": "Hydraulics", "tf": 60, "pf": 25 }
      ],
      "6th": [
        { "code": "65852", "name": "Industrial Management", "tf": 60, "pf": 0 },
        { "code": "66461", "name": "Advance Surveying", "tf": 60, "pf": 50 },
        { "code": "66462", "name": "Transportation Engineering- 1", "tf": 60, "pf": 25 },
        { "code": "66463", "name": "Design of Structure-1", "tf": 60, "pf": 25 },
        { "code": "66464", "name": "Civil Engineering Drawing -3 (CAD)", "tf": 30, "pf": 50 },
        { "code": "66465", "name": "Foundation Engineering", "tf": 60, "pf": 25 },
        { "code": "66466", "name": "Civil Engineering Software", "tf": 0, "pf": 25 }
      ],
      "7th": [
        { "code": "65853", "name": "Innovation & Entrepreneurship", "tf": 60, "pf": 0 },
        { "code": "66471", "name": "Civil Engineering Project", "tf": 0, "pf": 50 },
        { "code": "66472", "name": "Sanitary Engineering", "tf": 60, "pf": 25 },
        { "code": "66473", "name": "Transportation Engineering-2", "tf": 60, "pf": 25 },
        { "code": "66474", "name": "Design Of Structure -2", "tf": 60, "pf": 25 },
        { "code": "66475", "name": "Water Resources Engineering", "tf": 60, "pf": 25 },
        { "code": "68873", "name": "Construction Management & Documentation", "tf": 60, "pf": 25 }
      ],
      "8th": [
        { "code": "66481", "name": "Civil Technology Industrial Training", "tf": 0, "pf": 150 }
      ]
    },

    "(66) Computer": {
      "1st": [
        { "code": "65711", "name": "Bangla", "tf": 90, "pf": 0 },
        { "code": "65712", "name": "English", "tf": 60, "pf": 0 },
        { "code": "65812", "name": "Physical Education & Life Skill Development", "tf": 0, "pf": 25 },
        { "code": "65911", "name": "Mathematics-I", "tf": 90, "pf": 0 },
        { "code": "65912", "name": "Physics-I", "tf": 90, "pf": 25 },
        { "code": "66611", "name": "Computer Application", "tf": 0, "pf": 50 },
        { "code": "66712", "name": "Electrical Engineering Fundamentals", "tf": 90, "pf": 25 }
      ],
      "2nd": [
        { "code": "65722", "name": "Communicative English", "tf": 30, "pf": 0 },
        { "code": "65921", "name": "Mathematics -2", "tf": 90, "pf": 0 },
        { "code": "65922", "name": "Physics -2", "tf": 90, "pf": 25 },
        { "code": "66621", "name": "Database Application", "tf": 0, "pf": 50 },
        { "code": "66622", "name": "IT support System-I", "tf": 0, "pf": 50 },
        { "code": "66623", "name": "Graphics Design -1", "tf": 0, "pf": 50 },
        { "code": "66823", "name": "Analog Electronics", "tf": 90, "pf": 25 }
      ],
      "3rd": [
        { "code": "65811", "name": "Social Science", "tf": 90, "pf": 0 },
        { "code": "65913", "name": "Chemistry", "tf": 90, "pf": 25 },
        { "code": "65931", "name": "Mathematics-3", "tf": 90, "pf": 0 },
        { "code": "66631", "name": "Programming Essentials", "tf": 60, "pf": 25 },
        { "code": "66632", "name": "Web Design", "tf": 0, "pf": 50 },
        { "code": "66633", "name": "Graphics design II", "tf": 0, "pf": 50 },
        { "code": "66634", "name": "IT support II", "tf": 0, "pf": 50 }
      ],
      "4th": [
        { "code": "65841", "name": "BusinessOrganization&Communication", "tf": 60, "pf": 0 },
        { "code": "66641", "name": "Object Oriented Programming", "tf": 60, "pf": 25 },
        { "code": "66642", "name": "Data Structure & Algorithm", "tf": 60, "pf": 25 },
        { "code": "66643", "name": "Web Development", "tf": 0, "pf": 50 },
        { "code": "66644", "name": "Data Communication System", "tf": 60, "pf": 50 },
        { "code": "66645", "name": "Computer Peripherals", "tf": 30, "pf": 50 },
        { "code": "66842", "name": "Principle of Digital Electronics", "tf": 90, "pf": 25 }
      ],
      "5th": [
        { "code": "65851", "name": "Accounting Theory & Practice", "tf": 60, "pf": 0 },
        { "code": "66651", "name": "Programming in Java", "tf": 60, "pf": 25 },
        { "code": "66652", "name": "Surveillance Security System", "tf": 30, "pf": 50 },
        { "code": "66653", "name": "Sequential Logic System", "tf": 90, "pf": 25 },
        { "code": "66654", "name": "Web Development Project", "tf": 0, "pf": 50 },
        { "code": "66655", "name": "PCB Design & Circuit Making", "tf": 0, "pf": 50 },
        { "code": "68546", "name": "Operating System application", "tf": 60, "pf": 25 }
      ],
      "6th": [
        { "code": "65852", "name": "Industrial Management", "tf": 60, "pf": 0 },
        { "code": "66661", "name": "Principals of Software Engineering", "tf": 60, "pf": 50 },
        { "code": "66662", "name": "Microprocessor & Interfacing", "tf": 60, "pf": 25 },
        { "code": "66663", "name": "Microcontroller Application", "tf": 0, "pf": 50 },
        { "code": "66664", "name": "Database Management System", "tf": 60, "pf": 25 },
        { "code": "66665", "name": "Network & Data Center Operation", "tf": 60, "pf": 25 },
        { "code": "66666", "name": "PLC Automation System", "tf": 60, "pf": 25 },
        { "code": "66667", "name": "Web Mastering", "tf": 60, "pf": 25 },
        { "code": "66668", "name": "Multimedia & Animation", "tf": 60, "pf": 25 },
        { "code": "69054", "name": "Environmental Studies", "tf": 60, "pf": 0 }
      ],
      "7th": [
        { "code": "65853", "name": "Innovation & Entrepreneurship", "tf": 60, "pf": 0 },
        { "code": "66671", "name": "System Analysis & Design", "tf": 60, "pf": 25 },
        { "code": "66672", "name": "Network Administration & Services", "tf": 60, "pf": 50 },
        { "code": "66673", "name": "Apps Development Project", "tf": 0, "pf": 50 },
        { "code": "66674", "name": "E-Commerce & CMS", "tf": 60, "pf": 50 },
        { "code": "66675", "name": "Cyber Security & Ethics", "tf": 60, "pf": 25 },
        { "code": "66676", "name": "Network Security System", "tf": 60, "pf": 25 },
        { "code": "66677", "name": "Embedded System Design", "tf": 60, "pf": 25 },
        { "code": "66678", "name": "Advanced Database Management System", "tf": 60, "pf": 25 },
        { "code": "66679", "name": "Game Development", "tf": 60, "pf": 25 }
      ],
      "8th": [
        { "code": "66681", "name": "Industrial Attachment", "tf": 0, "pf": 150 }
      ]
    },

    "(67) Electrical": {
      "1st": [
        { "code": "61011", "name": "Engineering Drawing", "tf": 0, "pf": 50 },
        { "code": "65812", "name": "Physical & Life Skill Education", "tf": 0, "pf": 25 },
        { "code": "65911", "name": "Mathematics-1", "tf": 90, "pf": 0 },
        { "code": "65913", "name": "Chemistry", "tf": 90, "pf": 25 },
        { "code": "66711", "name": "Basic Electricity", "tf": 90, "pf": 25 },
        { "code": "66713", "name": "Electrical Engineering Materials", "tf": 60, "pf": 0 },
        { "code": "66811", "name": "Basic Electronics", "tf": 60, "pf": 25 }
      ],
      "2nd": [
        { "code": "65711", "name": "Bangla", "tf": 90, "pf": 0 },
        { "code": "65712", "name": "English", "tf": 60, "pf": 0 },
        { "code": "65912", "name": "Physics-1", "tf": 90, "pf": 25 },
        { "code": "65921", "name": "Mathematics-2", "tf": 90, "pf": 0 },
        { "code": "66611", "name": "Computer Application", "tf": 0, "pf": 50 },
        { "code": "66721", "name": "Electrical Circuits-1", "tf": 90, "pf": 25 },
        { "code": "66722", "name": "Electrical Appliances", "tf": 60, "pf": 25 }
      ],
      "3rd": [
        { "code": "65722", "name": "Communicative English", "tf": 30, "pf": 0 },
        { "code": "65811", "name": "Social Science", "tf": 90, "pf": 0 },
        { "code": "65922", "name": "Physics‐2", "tf": 90, "pf": 25 },
        { "code": "65931", "name": "Mathematics‐3", "tf": 90, "pf": 0 },
        { "code": "66731", "name": "Electrical Circuits‐2", "tf": 90, "pf": 25 },
        { "code": "66732", "name": "Advance Electricity", "tf": 60, "pf": 25 },
        { "code": "66733", "name": "Electrical Engineering Drawing", "tf": 0, "pf": 25 }
      ],
      "4th": [
        { "code": "65841", "name": "Business organization & Communication", "tf": 60, "pf": 0 },
        { "code": "66631", "name": "Programming Essentials", "tf": 60, "pf": 25 },
        { "code": "66741", "name": "Electrical Installation Planning & Estimating", "tf": 90, "pf": 25 },
        { "code": "66742", "name": "DC Machines", "tf": 90, "pf": 25 },
        { "code": "66845", "name": "Industrial Electronics", "tf": 60, "pf": 25 },
        { "code": "67045", "name": "Applied Mechanics", "tf": 60, "pf": 25 }
      ],
      "5th": [
        { "code": "65851", "name": "Accounting Theory & Practice", "tf": 60, "pf": 0 },
        { "code": "66751", "name": "Electrical & Electronic Measurement -I", "tf": 90, "pf": 25 },
        { "code": "66752", "name": "Generation of Electrical Power", "tf": 90, "pf": 25 },
        { "code": "66753", "name": "Renewable Energy", "tf": 60, "pf": 25 },
        { "code": "66856", "name": "Digital Electronics & Microprocessor", "tf": 60, "pf": 25 },
        { "code": "69054", "name": "Environmental Studies", "tf": 60, "pf": 0 }
      ],
      "6th": [
        { "code": "65852", "name": "Industrial Management", "tf": 60, "pf": 0 },
        { "code": "66761", "name": "Alternating Current Machines-1", "tf": 90, "pf": 25 },
        { "code": "66762", "name": "Electrical & Electronic Measurement-2", "tf": 60, "pf": 25 },
        { "code": "66763", "name": "Transmission and Distribution of Electrical Power-1", "tf": 90, "pf": 25 },
        { "code": "66867", "name": "Communication Engineering", "tf": 60, "pf": 25 },
        { "code": "66868", "name": "Micro Controller & PLC", "tf": 60, "pf": 25 }
      ],
      "7th": [
        { "code": "65853", "name": "Innovation & Entrepreneurship", "tf": 60, "pf": 0 },
        { "code": "66771", "name": "Alternating Current Machines-2", "tf": 90, "pf": 25 },
        { "code": "66772", "name": "Electrical Engineering project", "tf": 0, "pf": 50 },
        { "code": "66773", "name": "Switch Gear & Protection", "tf": 90, "pf": 25 },
        { "code": "66774", "name": "Transmission and Distribution of Electrical Power-2", "tf": 90, "pf": 25 },
        { "code": "66775", "name": "Testing and Maintenance of Electrical Equipment", "tf": 30, "pf": 25 },
        { "code": "66863", "name": "Instrumentation and Process Control", "tf": 60, "pf": 25 }
      ],
      "8th": [
        { "code": "66781", "name": "Electrical Technology Industrial Training", "tf": 0, "pf": 150 }
      ]
    },

    "(70) Mechanical": {
      "1st": [
        { "code": "61011", "name": "Engineering Drawing", "tf": 0, "pf": 50 },
        { "code": "65711", "name": "Bangla", "tf": 90, "pf": 0 },
        { "code": "65812", "name": "Physical Education & Life Skill Development", "tf": 0, "pf": 25 },
        { "code": "65911", "name": "Mathematics‐1", "tf": 90, "pf": 0 },
        { "code": "65913", "name": "Chemistry", "tf": 90, "pf": 25 },
        { "code": "66712", "name": "Electrical Engineering Fundamentals", "tf": 90, "pf": 25 },
        { "code": "67013", "name": "Mechanical Engineering Materials", "tf": 60, "pf": 0 }
      ],
      "2nd": [
        { "code": "65712", "name": "English", "tf": 60, "pf": 0 },
        { "code": "65811", "name": "Social Science", "tf": 90, "pf": 0 },
        { "code": "65912", "name": "Physics‐1", "tf": 90, "pf": 25 },
        { "code": "65921", "name": "Mathematics‐2", "tf": 90, "pf": 0 },
        { "code": "67021", "name": "Advanced Mechanical Engineering Drawing", "tf": 0, "pf": 50 },
        { "code": "67022", "name": "Machine Shop Practice‐1", "tf": 30, "pf": 50 },
        { "code": "67023", "name": "Mechanical Workshop Practice", "tf": 0, "pf": 50 }
      ],
      "3rd": [
        { "code": "65722", "name": "Communicative English", "tf": 30, "pf": 0 },
        { "code": "65922", "name": "Physics ‐2", "tf": 90, "pf": 25 },
        { "code": "65931", "name": "Mathematics ‐3", "tf": 90, "pf": 0 },
        { "code": "66611", "name": "Computer Application", "tf": 0, "pf": 50 },
        { "code": "66822", "name": "Electronic Engineering Fundamentals", "tf": 60, "pf": 25 },
        { "code": "67031", "name": "Machine Shop Practice‐2", "tf": 30, "pf": 50 },
        { "code": "67032", "name": "Foundry & Pattern Making", "tf": 60, "pf": 25 }
      ],
      "4th": [
        { "code": "65841", "name": "Business Organization & Communication", "tf": 60, "pf": 0 },
        { "code": "66631", "name": "Programming Essentials", "tf": 60, "pf": 25 },
        { "code": "66743", "name": "Electrical Circuits & Machines", "tf": 90, "pf": 25 },
        { "code": "67041", "name": "Engineering Mechanics", "tf": 90, "pf": 25 },
        { "code": "67042", "name": "Metallurgy", "tf": 60, "pf": 25 },
        { "code": "67043", "name": "Machine Shop Practice -3", "tf": 30, "pf": 50 },
        { "code": "69054", "name": "Environmental Studies", "tf": 60, "pf": 0 }
      ],
      "5th": [
        { "code": "65851", "name": "Accounting Theory & Practice", "tf": 60, "pf": 0 },
        { "code": "67051", "name": "Hydraulics & Hydraulic Machineries", "tf": 90, "pf": 25 },
        { "code": "67052", "name": "Mechanical Estimating& Costing", "tf": 60, "pf": 25 },
        { "code": "67053", "name": "Advance Welding -1", "tf": 60, "pf": 50 },
        { "code": "67054", "name": "CAD & CAM", "tf": 30, "pf": 50 },
        { "code": "67055", "name": "Manufacturing Process", "tf": 90, "pf": 0 }
      ],
      "6th": [
        { "code": "65852", "name": "Industrial Management", "tf": 60, "pf": 0 },
        { "code": "67061", "name": "Thermodynamics & Heat Engine", "tf": 90, "pf": 25 },
        { "code": "67062", "name": "Mechanical Measurement & Metrology", "tf": 60, "pf": 25 },
        { "code": "67063", "name": "Plant Engineering", "tf": 60, "pf": 25 },
        { "code": "67064", "name": "Strength of Materials", "tf": 90, "pf": 25 },
        { "code": "67065", "name": "Advance Welding -2", "tf": 60, "pf": 25 }
      ],
      "7th": [
        { "code": "65853", "name": "Innovation & Entrepreneurship", "tf": 60, "pf": 0 },
        { "code": "67071", "name": "Design of Machine Elements", "tf": 90, "pf": 25 },
        { "code": "67072", "name": "Tool Design", "tf": 60, "pf": 25 },
        { "code": "67073", "name": "Heat Treatment of Metal", "tf": 60, "pf": 25 },
        { "code": "67074", "name": "Mechanical Engineering Project", "tf": 0, "pf": 50 },
        { "code": "67075", "name": "Production Planning & Control", "tf": 90, "pf": 0 },
        { "code": "67076", "name": "Mechatronics & PLC", "tf": 90, "pf": 25 }
      ],
      "8th": [
        { "code": "67081", "name": "Mechanical Technology Industrial Training", "tf": 0, "pf": 150 }
      ]
    }
  }
};
