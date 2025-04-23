const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser"); // Add body-parser for form data handling
const path = require("path");
const { PythonShell } = require("python-shell");
const { spawn } = require("child_process"); // ✅ ADD THIS

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

const precautionsMap = {
  "Fungal Infection": [
    "Keep skin clean and dry.",
    "Avoid sharing personal items like towels.",
    "Use prescribed antifungal creams.",
    "Wear breathable cotton clothing.",
    "Avoid walking barefoot in public areas.",
  ],
  Allergy: [
    "Avoid known allergens like pollen or pet dander.",
    "Use antihistamines as prescribed.",
    "Keep windows closed during high pollen seasons.",
    "Wash bedding in hot water weekly.",
    "Use air purifiers to reduce allergens.",
  ],
  GERD: [
    "Avoid spicy, fatty, or acidic foods.",
    "Eat smaller, frequent meals.",
    "Stay upright for 2-3 hours after eating.",
    "Take prescribed antacids or PPIs.",
    "Maintain a healthy body weight.",
  ],
  "Chronic Cholestasis": [
    "Follow a low-fat, balanced diet.",
    "Take prescribed bile acid medications.",
    "Avoid alcohol to protect liver.",
    "Monitor liver function regularly.",
    "Stay hydrated with water.",
  ],
  "Drug Reaction": [
    "Stop suspected medication and consult a doctor.",
    "Avoid known allergens or triggers.",
    "Keep a medication diary for tracking.",
    "Use prescribed antihistamines or steroids.",
    "Monitor for severe allergic reactions.",
  ],
  "Peptic Ulcer Disease": [
    "Avoid spicy and acidic foods.",
    "Take prescribed acid-reducing medications.",
    "Avoid smoking and alcohol.",
    "Eat small, frequent meals.",
    "Manage stress through relaxation techniques.",
  ],
  AIDS: [
    "Take antiretroviral therapy as prescribed.",
    "Practice safe sex with condoms.",
    "Avoid sharing needles or syringes.",
    "Get regular health checkups.",
    "Maintain a nutritious diet.",
  ],
  Diabetes: [
    "Monitor blood sugar levels daily.",
    "Follow a low-sugar, balanced diet.",
    "Exercise regularly to manage weight.",
    "Take prescribed insulin or medications.",
    "Check feet daily for cuts or infections.",
  ],
  Gastroenteritis: [
    "Stay hydrated with oral rehydration solutions.",
    "Avoid solid foods until symptoms ease.",
    "Wash hands frequently to prevent spread.",
    "Disinfect surfaces to avoid contamination.",
    "Seek medical help for persistent symptoms.",
  ],
  "Bronchial Asthma": [
    "Use prescribed inhalers regularly.",
    "Avoid triggers like dust or smoke.",
    "Monitor breathing with a peak flow meter.",
    "Keep a rescue inhaler accessible.",
    "Get regular asthma checkups.",
  ],
  Hypertension: [
    "Reduce salt intake in diet.",
    "Exercise regularly to maintain healthy BP.",
    "Manage stress with meditation or yoga.",
    "Take prescribed antihypertensive drugs.",
    "Avoid smoking and limit alcohol.",
  ],
  Migraine: [
    "Avoid trigger foods like caffeine or chocolate.",
    "Maintain a regular sleep schedule.",
    "Stay hydrated with water.",
    "Use prescribed migraine medications.",
    "Practice stress management techniques.",
  ],
  "Cervical Spondylosis": [
    "Maintain proper posture while sitting.",
    "Do neck exercises as advised by a therapist.",
    "Use ergonomic chairs and pillows.",
    "Avoid heavy lifting or sudden movements.",
    "Take prescribed pain relief medications.",
  ],
  Paralysis: [
    "Follow physiotherapy exercises regularly.",
    "Use assistive devices like wheelchairs.",
    "Maintain a balanced, nutrient-rich diet.",
    "Monitor for pressure sores daily.",
    "Get regular medical evaluations.",
  ],
  Jaundice: [
    "Avoid fatty and oily foods.",
    "Stay hydrated with water or juices.",
    "Take prescribed liver-support medications.",
    "Avoid alcohol to reduce liver strain.",
    "Monitor liver function with regular tests.",
  ],
  Malaria: [
    "Sleep under insecticide-treated bed nets.",
    "Apply mosquito repellent on skin.",
    "Take prescribed antimalarial medications.",
    "Eliminate standing water to prevent breeding.",
    "Wear long-sleeved clothing in evenings.",
  ],
  "Chicken Pox": [
    "Isolate to prevent spreading to others.",
    "Use calamine lotion to relieve itching.",
    "Take prescribed antiviral medications.",
    "Keep nails short to avoid scratching.",
    "Stay hydrated and rest adequately.",
  ],
  Dengue: [
    "Use mosquito repellent and long sleeves.",
    "Stay hydrated with rehydration solutions.",
    "Monitor for severe symptoms like bleeding.",
    "Avoid NSAIDs like ibuprofen or aspirin.",
    "Keep surroundings clean to eliminate mosquitoes.",
  ],
  Typhoid: [
    "Drink only boiled or bottled water.",
    "Avoid raw or undercooked foods.",
    "Wash hands thoroughly before eating.",
    "Get vaccinated before traveling to risky areas.",
    "Complete prescribed antibiotic course.",
  ],
  "Hepatitis A": [
    "Get vaccinated for Hepatitis A.",
    "Practice good handwashing habits.",
    "Avoid contaminated food or water.",
    "Avoid alcohol to protect liver.",
    "Eat a balanced, liver-friendly diet.",
  ],
  "Hepatitis B": [
    "Get vaccinated for Hepatitis B.",
    "Practice safe sex with condoms.",
    "Avoid sharing needles or personal items.",
    "Monitor liver function regularly.",
    "Take prescribed antiviral medications.",
  ],
  "Hepatitis C": [
    "Avoid sharing personal items like razors.",
    "Take prescribed antiviral medications.",
    "Monitor liver health with regular tests.",
    "Avoid alcohol to prevent liver damage.",
    "Practice safe hygiene habits.",
  ],
  "Hepatitis D": [
    "Get vaccinated for Hepatitis B.",
    "Avoid sharing needles or syringes.",
    "Take prescribed medications for HBV.",
    "Monitor liver function regularly.",
    "Practice safe sex to prevent transmission.",
  ],
  "Hepatitis E": [
    "Drink clean, safe water.",
    "Practice good hygiene and handwashing.",
    "Avoid contaminated food or water.",
    "Stay hydrated with clean fluids.",
    "Monitor liver health with tests.",
  ],
  "Alcoholic Hepatitis": [
    "Stop all alcohol consumption.",
    "Follow a low-fat, liver-friendly diet.",
    "Take prescribed liver medications.",
    "Monitor liver function regularly.",
    "Stay hydrated with water.",
  ],
  Tuberculosis: [
    "Complete full anti-TB medication course.",
    "Cover mouth when coughing or sneezing.",
    "Ensure good ventilation in living spaces.",
    "Avoid close contact until non-infectious.",
    "Get regular follow-ups with a doctor.",
  ],
  "Common Cold": [
    "Stay hydrated with water or warm fluids.",
    "Rest adequately to aid recovery.",
    "Use saline nasal sprays for congestion.",
    "Cover mouth to avoid spreading germs.",
    "Take over-the-counter cold remedies.",
  ],
  Pneumonia: [
    "Complete prescribed antibiotic course.",
    "Stay hydrated with water or broths.",
    "Rest to support recovery.",
    "Avoid smoking or secondhand smoke.",
    "Get vaccinated for pneumonia.",
  ],
  "Dimorphic Hemorrhoids (Piles)": [
    "Eat high-fiber foods like fruits and vegetables.",
    "Stay hydrated to soften stools.",
    "Avoid straining during bowel movements.",
    "Use prescribed hemorrhoid creams.",
    "Take warm sitz baths for relief.",
  ],
  "Heart Attack": [
    "Take prescribed heart medications.",
    "Follow a heart-healthy, low-fat diet.",
    "Exercise as advised by a doctor.",
    "Avoid smoking and limit alcohol.",
    "Manage stress with relaxation techniques.",
  ],
  "Varicose Veins": [
    "Wear compression stockings daily.",
    "Elevate legs when resting.",
    "Exercise to improve blood circulation.",
    "Avoid prolonged standing or sitting.",
    "Maintain a healthy body weight.",
  ],
  Hypothyroidism: [
    "Take prescribed thyroid medications.",
    "Eat a balanced diet with iodine.",
    "Monitor thyroid levels regularly.",
    "Avoid goitrogenic foods like cabbage.",
    "Exercise to boost metabolism.",
  ],
  Hyperthyroidism: [
    "Take prescribed antithyroid medications.",
    "Avoid iodine-rich foods like seaweed.",
    "Monitor thyroid function regularly.",
    "Manage stress with relaxation.",
    "Get regular medical checkups.",
  ],
  Hypoglycemia: [
    "Eat regular, balanced meals.",
    "Carry fast-acting sugar like candy.",
    "Monitor blood sugar levels frequently.",
    "Take prescribed medications as directed.",
    "Avoid excessive alcohol consumption.",
  ],
  Osteoarthritis: [
    "Maintain a healthy body weight.",
    "Do low-impact exercises like swimming.",
    "Use prescribed pain relief medications.",
    "Apply heat or cold therapy to joints.",
    "Use assistive devices like braces.",
  ],
  Arthritis: [
    "Exercise to maintain joint mobility.",
    "Take prescribed anti-inflammatory drugs.",
    "Maintain a healthy weight to reduce stress.",
    "Apply heat or cold therapy as needed.",
    "Get regular checkups with a doctor.",
  ],
  "(Vertigo) Paroxysmal Positional Vertigo": [
    "Perform canalith repositioning exercises.",
    "Avoid sudden head movements.",
    "Use prescribed anti-vertigo medications.",
    "Stay hydrated and rest adequately.",
    "Consult a doctor for persistent symptoms.",
  ],
  Acne: [
    "Keep skin clean with gentle cleansers.",
    "Use prescribed topical treatments.",
    "Avoid touching or picking at face.",
    "Eat a balanced, low-sugar diet.",
    "Stay hydrated to support skin health.",
  ],
  "Urinary Tract Infection": [
    "Drink plenty of water daily.",
    "Urinate frequently, don’t hold urine.",
    "Practice good hygiene after toileting.",
    "Avoid irritating soaps or douches.",
    "Complete prescribed antibiotic course.",
  ],
  Psoriasis: [
    "Use prescribed topical corticosteroids.",
    "Keep skin moisturized daily.",
    "Avoid triggers like stress or injury.",
    "Eat a balanced, anti-inflammatory diet.",
    "Get regular dermatology checkups.",
  ],
  Impetigo: [
    "Keep affected areas clean and dry.",
    "Use prescribed antibiotic ointments.",
    "Avoid touching or scratching sores.",
    "Wash hands frequently to prevent spread.",
    "Avoid sharing towels or clothing.",
  ],
  Flu: [
    "Stay hydrated with water and electrolyte drinks.",
    "Rest to support immune recovery.",
    "Avoid contact to prevent spreading.",
    "Use a humidifier for respiratory relief.",
    "Take prescribed antiviral medications.",
  ],
  Dengue: [
    "Use mosquito repellent and long-sleeved clothing.",
    "Stay hydrated with rehydration solutions.",
    "Monitor for severe symptoms like bleeding.",
    "Avoid NSAIDs like ibuprofen.",
    "Eliminate mosquito breeding sites.",
  ],
  Typhoid: [
    "Drink boiled or bottled water.",
    "Avoid raw or undercooked foods.",
    "Wash hands before eating.",
    "Get vaccinated for high-risk areas.",
    "Complete prescribed antibiotics.",
  ],
  Hepatitis: [
    "Avoid sharing personal items.",
    "Practice regular handwashing.",
    "Get vaccinated for Hepatitis A and B.",
    "Avoid alcohol to protect liver.",
    "Eat a balanced diet.",
  ],
  Malaria: [
    "Sleep under insecticide-treated nets.",
    "Apply mosquito repellent.",
    "Take prescribed antimalarial drugs.",
    "Remove standing water.",
    "Wear protective clothing.",
  ],
  Tuberculosis: [
    "Complete anti-TB medication course.",
    "Cover mouth when coughing.",
    "Ensure good ventilation.",
    "Avoid close contact until non-infectious.",
    "Follow up with healthcare provider.",
  ],
  Diabetes: [
    "Monitor blood sugar regularly.",
    "Follow low-sugar diet.",
    "Exercise to maintain weight.",
    "Take prescribed medications.",
    "Check feet for infections.",
  ],
  Hypertension: [
    "Reduce salt intake.",
    "Exercise regularly.",
    "Manage stress with relaxation.",
    "Take antihypertensive medications.",
    "Avoid smoking and limit alcohol.",
  ],
  "Urinary Tract Infection": [
    "Drink plenty of water.",
    "Urinate frequently.",
    "Maintain good hygiene.",
    "Avoid irritating soaps.",
    "Complete antibiotic course.",
  ],
  Gastroenteritis: [
    "Stay hydrated with rehydration solutions.",
    "Avoid solid foods initially.",
    "Wash hands frequently.",
    "Disinfect surfaces.",
    "Seek medical help if persistent.",
  ],
  FungalInfection: [
    "Keep skin clean and dry.",
    "Avoid sharing personal items.",
    "Use antifungal creams as prescribed.",
    "Wear breathable clothing.",
    "Avoid walking barefoot in public areas.",
  ],
  Allergy: [
    "Avoid known allergens.",
    "Use antihistamines as prescribed.",
    "Keep windows closed during pollen season.",
    "Wash bedding regularly.",
    "Use air purifiers.",
  ],
  GERD: [
    "Avoid trigger foods like spicy or fatty meals.",
    "Eat smaller, frequent meals.",
    "Stay upright after eating.",
    "Take prescribed antacids.",
    "Maintain healthy weight.",
  ],
  "Chronic Cholestasis": [
    "Follow low-fat diet.",
    "Take prescribed bile acid medications.",
    "Avoid alcohol.",
    "Monitor liver function regularly.",
    "Stay hydrated.",
  ],
  "Drug Reaction": [
    "Stop suspected medication and consult doctor.",
    "Avoid known allergens.",
    "Keep a medication diary.",
    "Use prescribed antihistamines.",
    "Monitor for severe reactions.",
  ],
  "Peptic Ulcer Disease": [
    "Avoid spicy and acidic foods.",
    "Take prescribed acid-reducing medications.",
    "Avoid smoking and alcohol.",
    "Eat small, frequent meals.",
    "Manage stress.",
  ],
  AIDS: [
    "Take antiretroviral therapy as prescribed.",
    "Practice safe sex.",
    "Avoid sharing needles.",
    "Get regular health checkups.",
    "Maintain a healthy diet.",
  ],
  Gastroenteritis: [
    "Stay hydrated with rehydration solutions.",
    "Avoid solid foods initially.",
    "Wash hands frequently.",
    "Disinfect surfaces.",
    "Seek medical help if persistent.",
  ],
  "Bronchial Asthma": [
    "Use inhalers as prescribed.",
    "Avoid triggers like dust or smoke.",
    "Monitor breathing with peak flow meter.",
    "Keep rescue inhaler accessible.",
    "Get regular checkups.",
  ],
  Hypertension: [
    "Reduce salt intake.",
    "Exercise regularly.",
    "Manage stress with relaxation.",
    "Take antihypertensive medications.",
    "Avoid smoking and limit alcohol.",
  ],
  Migraine: [
    "Identify and avoid trigger foods.",
    "Maintain regular sleep schedule.",
    "Stay hydrated.",
    "Use prescribed medications.",
    "Practice stress management.",
  ],
  "Cervical Spondylosis": [
    "Maintain good posture.",
    "Do neck exercises as advised.",
    "Use ergonomic furniture.",
    "Avoid heavy lifting.",
    "Take prescribed pain relief.",
  ],
  Paralysis: [
    "Follow physiotherapy regimen.",
    "Use assistive devices as needed.",
    "Maintain a balanced diet.",
    "Monitor for pressure sores.",
    "Get regular medical evaluations.",
  ],
  Jaundice: [
    "Avoid fatty foods.",
    "Stay hydrated.",
    "Take prescribed medications.",
    "Avoid alcohol.",
    "Monitor liver function.",
  ],
  Malaria: [
    "Sleep under insecticide-treated nets.",
    "Apply mosquito repellent.",
    "Take prescribed antimalarial drugs.",
    "Remove standing water.",
    "Wear protective clothing.",
  ],
  "Chicken Pox": [
    "Isolate to prevent spread.",
    "Use calamine lotion for itching.",
    "Take prescribed antivirals.",
    "Keep nails short to avoid scratching.",
    "Stay hydrated.",
  ],
  Dengue: [
    "Use mosquito repellent and long-sleeved clothing.",
    "Stay hydrated with rehydration solutions.",
    "Monitor for severe symptoms like bleeding.",
    "Avoid NSAIDs like ibuprofen.",
    "Eliminate mosquito breeding sites.",
  ],
  Typhoid: [
    "Drink boiled or bottled water.",
    "Avoid raw or undercooked foods.",
    "Wash hands before eating.",
    "Get vaccinated for high-risk areas.",
    "Complete prescribed antibiotics.",
  ],
  "Hepatitis A": [
    "Get vaccinated.",
    "Practice good handwashing.",
    "Avoid contaminated food or water.",
    "Avoid alcohol.",
    "Eat a balanced diet.",
  ],
  "Hepatitis B": [
    "Get vaccinated.",
    "Practice safe sex.",
    "Avoid sharing needles.",
    "Monitor liver function.",
    "Take prescribed antivirals.",
  ],
  "Hepatitis C": [
    "Avoid sharing personal items.",
    "Take prescribed antivirals.",
    "Monitor liver health.",
    "Avoid alcohol.",
    "Practice safe hygiene.",
  ],
  "Hepatitis D": [
    "Get vaccinated for Hepatitis B.",
    "Avoid sharing needles.",
    "Take prescribed medications.",
    "Monitor liver function.",
    "Practice safe sex.",
  ],
  "Hepatitis E": [
    "Drink clean water.",
    "Practice good hygiene.",
    "Avoid contaminated food.",
    "Stay hydrated.",
    "Monitor liver health.",
  ],
  "Alcoholic Hepatitis": [
    "Stop alcohol consumption.",
    "Follow a low-fat diet.",
    "Take prescribed medications.",
    "Monitor liver function.",
    "Stay hydrated.",
  ],
  Tuberculosis: [
    "Complete anti-TB medication course.",
    "Cover mouth when coughing.",
    "Ensure good ventilation.",
    "Avoid close contact until non-infectious.",
    "Follow up with healthcare provider.",
  ],
  "Common Cold": [
    "Stay hydrated.",
    "Rest adequately.",
    "Use saline nasal sprays.",
    "Avoid spreading by covering mouth.",
    "Take over-the-counter remedies.",
  ],
  Pneumonia: [
    "Complete prescribed antibiotics.",
    "Stay hydrated.",
    "Rest to aid recovery.",
    "Avoid smoking.",
    "Get vaccinated.",
  ],
  Hemorrhoids: [
    "Eat high-fiber foods.",
    "Stay hydrated.",
    "Avoid straining during bowel movements.",
    "Use prescribed creams.",
    "Take warm sitz baths.",
  ],
  "Heart Attack": [
    "Take prescribed medications.",
    "Follow a heart-healthy diet.",
    "Exercise as advised.",
    "Avoid smoking.",
    "Manage stress.",
  ],
  "Varicose Veins": [
    "Wear compression stockings.",
    "Elevate legs when resting.",
    "Exercise to improve circulation.",
    "Avoid prolonged standing.",
    "Maintain healthy weight.",
  ],
  Hypothyroidism: [
    "Take prescribed thyroid medication.",
    "Eat a balanced diet.",
    "Monitor thyroid levels.",
    "Avoid goitrogenic foods.",
    "Exercise regularly.",
  ],
  Hyperthyroidism: [
    "Take prescribed antithyroid drugs.",
    "Avoid iodine-rich foods.",
    "Monitor thyroid function.",
    "Manage stress.",
    "Get regular checkups.",
  ],
  Hypoglycemia: [
    "Eat regular meals.",
    "Carry fast-acting sugar sources.",
    "Monitor blood sugar levels.",
    "Take prescribed medications.",
    "Avoid excessive alcohol.",
  ],
  Osteoarthritis: [
    "Maintain healthy weight.",
    "Do low-impact exercises.",
    "Use prescribed pain relief.",
    "Apply heat or cold therapy.",
    "Use assistive devices.",
  ],
  Arthritis: [
    "Exercise to maintain joint mobility.",
    "Take prescribed anti-inflammatory drugs.",
    "Maintain healthy weight.",
    "Apply heat or cold therapy.",
    "Get regular checkups.",
  ],
  "(Vertigo) Paroxysmal Positional Vertigo": [
    "Perform prescribed canalith repositioning.",
    "Avoid sudden head movements.",
    "Use prescribed medications.",
    "Stay hydrated.",
    "Get adequate rest.",
  ],
  Acne: [
    "Keep skin clean.",
    "Use prescribed topical treatments.",
    "Avoid touching face.",
    "Eat a balanced diet.",
    "Stay hydrated.",
  ],
  "Urinary Tract Infection": [
    "Drink plenty of water.",
    "Urinate frequently.",
    "Maintain good hygiene.",
    "Avoid irritating soaps.",
    "Complete antibiotic course.",
  ],
  Psoriasis: [
    "Use prescribed topical treatments.",
    "Keep skin moisturized.",
    "Avoid triggers like stress.",
    "Eat a balanced diet.",
    "Get regular checkups.",
  ],
  Impetigo: [
    "Keep affected area clean.",
    "Use prescribed antibiotics.",
    "Avoid touching sores.",
    "Wash hands frequently.",
    "Avoid sharing personal items.",
  ],
};
let defaultPrecaution = ["Consult a doctor for personalized advice."];

app.get("/predict", (req, res) => {
  res.render("predict", { prediction: null, defaultPrecaution });
});

app.post("/predict", (req, res) => {
  let symptoms = req.body.symptoms || [];

  if (typeof symptoms === "string") {
    symptoms = symptoms.split(",").map((s) => s.trim());
  }

  console.log("Symptoms:", symptoms);

  const pythonProcess = spawn("python", ["-u", "RFP2.py", symptoms.join(",")]);

  pythonProcess.stdout.on("data", (data) => {
    console.log("PYTHON STDOUT:", data.toString());

    let prediction;
    let precaution;
    try {
      const parsed = JSON.parse(data.toString());
      prediction = parsed.disease;
      precaution = precautionsMap[prediction] || defaultPrecaution;
      console.log("Type of Precaution:", typeof precaution);
      console.log("Sending to EJS:", { prediction, precaution });
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      prediction = { prediction: "Error parsing Python output." };
      precaution = ["Unable to provide precautions due to an internal error."];
      console.log("Sending to EJS:", { prediction, precaution });
    }

    res.render("predict", { prediction, precaution });
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("PYTHON STDERR:", data.toString());
  });
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.listen(8080, () => {
  console.log("Server is listening at port 8080");
});
