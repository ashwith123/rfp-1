// List of all possible symptoms
const symptoms = [
  "itching",
  "skin_rash",
  "nodal_skin_eruptions",
  "continuous_sneezing",
  "shivering",
  "chills",
  "joint_pain",
  "stomach_pain",
  "acidity",
  "ulcers_on_tongue",
  "muscle_wasting",
  "vomiting",
  "burning_micturition",
  "spotting_urination",
  "fatigue",
  "weight_gain",
  "anxiety",
  "cold_hands_and_feets",
  "mood_swings",
  "weight_loss",
  "restlessness",
  "lethargy",
  "patches_in_throat",
  "irregular_sugar_level",
  "cough",
  "high_fever",
  "sunken_eyes",
  "breathlessness",
  "sweating",
  "dehydration",
  "indigestion",
  "headache",
  "yellowish_skin",
  "dark_urine",
  "nausea",
  "loss_of_appetite",
  "pain_behind_the_eyes",
  "back_pain",
  "constipation",
  "abdominal_pain",
  "diarrhoea",
  "mild_fever",
  "yellow_urine",
  "yellowing_of_eyes",
  "acute_liver_failure",
  "fluid_overload",
  "swelling_of_stomach",
  "swelled_lymph_nodes",
  "malaise",
  "blurred_and_distorted_vision",
  "phlegm",
  "throat_irritation",
  "redness_of_eyes",
  "sinus_pressure",
  "runny_nose",
  "congestion",
  "chest_pain",
  "weakness_in_limbs",
  "fast_heart_rate",
  "pain_during_bowel_movements",
  "pain_in_anal_region",
  "bloody_stool",
  "irritation_in_anus",
  "neck_pain",
  "dizziness",
  "cramps",
  "bruising",
  "obesity",
  "swollen_legs",
  "swollen_blood_vessels",
  "puffy_face_and_eyes",
  "enlarged_thyroid",
  "brittle_nails",
  "swollen_extremeties",
  "excessive_hunger",
  "extra_marital_contacts",
  "drying_and_tingling_lips",
  "slurred_speech",
  "knee_pain",
  "hip_joint_pain",
  "muscle_weakness",
  "stiff_neck",
  "swelling_joints",
  "movement_stiffness",
  "spinning_movements",
  "loss_of_balance",
  "unsteadiness",
  "weakness_of_one_body_side",
  "loss_of_smell",
  "bladder_discomfort",
  "foul_smell_of_urine",
  "continuous_feel_of_urine",
  "passage_of_gases",
  "internal_itching",
  "toxic_look_(typhos)",
  "depression",
  "irritability",
  "muscle_pain",
  "altered_sensorium",
  "red_spots_over_body",
  "belly_pain",
  "abnormal_menstruation",
  "dischromic_patches",
  "watering_from_eyes",
  "increased_appetite",
  "polyuria",
  "family_history",
  "mucoid_sputum",
  "rusty_sputum",
  "lack_of_concentration",
  "visual_disturbances",
  "receiving_blood_transfusion",
  "receiving_unsterile_injections",
  "coma",
  "stomach_bleeding",
  "distention_of_abdomen",
  "history_of_alcohol_consumption",
  "fluid_overload",
  "blood_in_sputum",
  "prominent_veins_on_calf",
  "palpitations",
  "painful_walking",
  "pus_filled_pimples",
  "blackheads",
  "scurring",
  "skin_peeling",
  "silver_like_dusting",
  "small_dents_in_nails",
  "inflammatory_nails",
  "blister",
  "red_sore_around_nose",
  "yellow_crust_ooze",
  "prognosis",
];

// Format symptom for display
function formatSymptom(symptom) {
  return symptom.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

const selectedSymptoms = new Set();
const symptomsHidden = document.getElementById("symptoms-hidden");
const symptomInput = document.getElementById("symptom-input");
const selectedSymptomsContainer = document.getElementById("selected-symptoms");
const form = document.getElementById("predict-form");

// Update hidden input with selected symptoms
function updateHiddenInput() {
  symptomsHidden.value = Array.from(selectedSymptoms).join(",");
}

// Add selected symptom
function addSymptom(symptom) {
  if (!selectedSymptoms.has(symptom) && symptom) {
    selectedSymptoms.add(symptom);

    const tag = document.createElement("div");
    tag.className = "symptom-tag";

    const symptomName = document.createElement("span");
    symptomName.textContent = formatSymptom(symptom);

    const removeBtn = document.createElement("span");
    removeBtn.className = "remove-symptom";
    removeBtn.textContent = "×";
    removeBtn.onclick = function () {
      selectedSymptoms.delete(symptom);
      tag.remove();
      updateHiddenInput();
    };

    tag.appendChild(symptomName);
    tag.appendChild(removeBtn);
    selectedSymptomsContainer.appendChild(tag);

    updateHiddenInput();
    symptomInput.value = "";
  }
}

// Autocomplete setup
function setupAutocomplete() {
  let currentFocus;

  // Create autocomplete items based on input
  function showAutocompleteItems(val) {
    closeAllLists();
    if (!val) return false;

    currentFocus = -1;
    const autocompleteList = document.createElement("div");
    autocompleteList.setAttribute("id", "autocomplete-list");
    autocompleteList.setAttribute("class", "autocomplete-items");
    symptomInput.parentNode.appendChild(autocompleteList);

    // Filter symptoms based on input
    const filteredSymptoms = symptoms.filter(
      (s) =>
        s.toLowerCase().includes(val.toLowerCase()) && !selectedSymptoms.has(s)
    );

    // Limit to first 10 matches
    const limitedSymptoms = filteredSymptoms.slice(0, 10);

    for (const symptom of limitedSymptoms) {
      const item = document.createElement("div");

      // Create formatted item with matching part highlighted
      const formattedSymptom = formatSymptom(symptom);
      const matchIndex = formattedSymptom
        .toLowerCase()
        .indexOf(val.toLowerCase());

      item.innerHTML = formattedSymptom.substring(0, matchIndex);
      item.innerHTML +=
        "<strong>" +
        formattedSymptom.substring(matchIndex, matchIndex + val.length) +
        "</strong>";
      item.innerHTML += formattedSymptom.substring(matchIndex + val.length);

      // Store the original symptom value
      item.dataset.value = symptom;

      item.addEventListener("click", function () {
        addSymptom(this.dataset.value);
        closeAllLists();
      });

      autocompleteList.appendChild(item);
    }
  }

  // Close all autocomplete lists except the one passed as argument
  function closeAllLists(elmnt) {
    const x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != symptomInput) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  // Input event listener
  symptomInput.addEventListener("input", function () {
    showAutocompleteItems(this.value);
  });

  // Key navigation
  symptomInput.addEventListener("keydown", function (e) {
    let x = document.getElementById("autocomplete-list");
    if (x) x = x.getElementsByTagName("div");

    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentFocus++;
      addActive(x);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      currentFocus--;
      addActive(x);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      } else if (this.value) {
        // Check if input matches any symptom directly
        const exactMatch = symptoms.find(
          (s) => s.toLowerCase() === this.value.toLowerCase()
        );
        if (exactMatch) {
          addSymptom(exactMatch);
        }
      }
    } else if (e.key === "Escape") {
      closeAllLists();
    }
  });

  // Add active class to current focus item
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }

  // Remove active class from all items
  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  // Close lists when clicking elsewhere
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });

  // Form submit handler
  form.addEventListener("submit", function (e) {
    if (selectedSymptoms.size === 0) {
      e.preventDefault();
      alert("Please select at least one symptom before submitting.");
    }
  });
}

// Initialize autocomplete
setupAutocomplete();
