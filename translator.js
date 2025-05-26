const fromText = document.querySelector("#fromText"),
      toText = document.querySelector("#toText"),
      selectOne = document.querySelector("#select_one"),
      selectSec = document.querySelector("#select_sec"),
      translateBtn = document.querySelector("#translate"),
      volumeIcons = document.querySelectorAll(".volume"),
      copyIcons = document.querySelectorAll(".copy");

// 🔔 Alert on page load
document.addEventListener("DOMContentLoaded", () => {
    alert("Select your languages on both sides first");
    populateLanguageOptions();
});

// ✅ Populate dropdowns with language options
function populateLanguageOptions() {
    selectOne.innerHTML = "";
    selectSec.innerHTML = "";

    const placeholderLeft = document.createElement("option");
    placeholderLeft.value = "";
    placeholderLeft.textContent = "Select Language";
    placeholderLeft.disabled = true;
    placeholderLeft.selected = true;
    selectOne.appendChild(placeholderLeft);

    const placeholderRight = document.createElement("option");
    placeholderRight.value = "";
    placeholderRight.textContent = "Select Language";
    placeholderRight.disabled = true;
    placeholderRight.selected = true;
    selectSec.appendChild(placeholderRight);

    for (let code in countries) {
        const option1 = document.createElement("option");
        option1.value = code;
        option1.textContent = countries[code];
        selectOne.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = code;
        option2.textContent = countries[code];
        selectSec.appendChild(option2);
    }
}

// Function to check if both languages are selected and different
function validateLanguageSelection() {
    if (!selectOne.value || !selectSec.value) {
        alert("Please select languages on both sides.");
        return false;
    }
    if (selectOne.value === selectSec.value) {
        alert("Please select different languages on both sides.");
        return false;
    }
    return true;
}

// 🔒 Block typing if language not selected correctly
fromText.addEventListener("focus", (e) => {
    if (!validateLanguageSelection()) {
        e.target.blur();
    }
});

fromText.addEventListener("keydown", (e) => {
    if (!validateLanguageSelection()) {
        e.preventDefault();
    }
});

// Clear translated text if input cleared
fromText.addEventListener("input", () => {
    if (!fromText.value.trim()) {
        toText.value = "";
    }
});

// 🔁 Translation button functionality
translateBtn.addEventListener("click", () => {
    if (!validateLanguageSelection()) return;

    const text = fromText.value.trim();
    if (!text) return;

    toText.setAttribute("placeholder", "Translating...");
    toText.value = "";

    const fromCode = selectOne.value.split("-")[0];
    const toCode = selectSec.value.split("-")[0];

    const encodedText = encodeURIComponent(text);
    const apiUrl = `https://lingva.ml/api/v1/${fromCode}/${toCode}/${encodedText}`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            toText.value = data.translation || "Translation not available";
            toText.setAttribute("placeholder", "Translation");
        })
        .catch(() => {
            toText.setAttribute("placeholder", "Translation failed");
        });
});

// 🔊 Copy & Speak buttons
[...volumeIcons, ...copyIcons].forEach(icon => {
    icon.addEventListener("click", () => {
        const id = icon.id;

        if (icon.classList.contains("fa-copy")) {
            if (id === "from" && fromText.value) {
                navigator.clipboard.writeText(fromText.value);
            } else if (id === "to" && toText.value) {
                navigator.clipboard.writeText(toText.value);
            }
        } else if (icon.classList.contains("fa-volume-high")) {
            let utterance;
            if (id === "from" && fromText.value) {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectOne.value;
            } else if (id === "to" && toText.value) {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectSec.value;
            }
            if (utterance) {
                speechSynthesis.speak(utterance);
            }
        }
    });
});
