var ipinfo;
var city;
var aqiData;
var aqi;
var conc;
var ciggs;

async function getIpInfo() {
  await fetch("https://ipinfo.io/json?token=a38819ed3126d7")
    .then((res) => res.json())
    .then((data) => {
      ipinfo = data;
      city = ipinfo.city;
    })
    .then(() => {
      populateLocationNav();
      getAQI();
    });
}
async function getAQI() {
  const url = `https://api.waqi.info/feed/${city}?token=0aad6101e2cee1b141964b71dd78ec8b05345cb8`;
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      aqiData = data;
      aqi = aqiData.data.aqi;
      populateAQI();
      updateAQIStyle(aqi);
      aqi2ciggs(aqi);
    });
}

function aqi2ciggs(aqi) {
  aqi = aqi;
  // units = ug/m3
  conc = Math.floor(10 * ConcPM25(aqi)) / 10;
  console.log(conc);

  // 1 cigg = 22 ug/m3
  // 1 ug/m3 = 1/22 cigg
  // conc ug/m3 = (1/22)* conc cigg

  ciggs = (1 / 22) * conc;
  ciggs = Math.round(ciggs);
  populateCiggs();
  populateFormula();
  populateShowCalculation();
}

function handleAqiChange(element) {
  const maxAllowedValue = parseInt(element.getAttribute("data-maxvalue"));
  const minAllowedValue = 0;
  // Get the current content as a number (if it's not a number, it will be set to 0)
  let currentValue = parseInt(element.textContent) || 0;
  updateAQIStyle(currentValue);
  populateFormula();
  // Ensure the input is not greater than the maximum allowed value
  // if (currentValue > maxAllowedValue) {
  //   currentValue = maxAllowedValue;
  //   element.textContent = currentValue;
  //   showWarningMessage("Value must be 500 or lower");
  // } else if (currentValue < 0) {
  //   currentValue = 0;
  //   element.textContent = currentValue;
  //   showWarningMessage("Value must be 0 or greater");
  // } else {
  //   hideWarningMessage();
  // }
  aqi = currentValue;
  aqi2ciggs(currentValue);
}

function showWarningMessage(message) {
  const warningElement = document.getElementById("aqi-warning");
  warningElement.textContent = message;
  warningElement.style.display = "block";
}

function hideWarningMessage() {
  const warningElement = document.getElementById("aqi-warning");
  warningElement.style.display = "none";
}
function populateLocationNav() {
  document.getElementById("location").textContent = city;
}

function populateAQI() {
  document.querySelectorAll(".aqi").forEach((e) => (e.textContent = aqi));
}
function populateCiggs() {
  document.getElementById("ciggs").textContent = ciggs;
}

function populateFormula() {
  document.getElementById("conc-aqi").textContent = conc;
  var cigarettesSmokedElement = document.getElementById("cigarettes-smoked");
  cigarettesSmokedElement.textContent = ciggs;
}

// taken from https://www.airnow.gov/aqi/aqi-calculator/
function InvLinear(AQIhigh, AQIlow, Conchigh, Conclow, a) {
  var AQIhigh;
  var AQIlow;
  var Conchigh;
  var Conclow;
  var a;
  var c;
  c = ((a - AQIlow) / (AQIhigh - AQIlow)) * (Conchigh - Conclow) + Conclow;
  return c;
}
function ConcPM25(a) {
  if (a >= 0 && a <= 50) {
    ConcCalc = InvLinear(50, 0, 12, 0, a);
  } else if (a > 50 && a <= 100) {
    ConcCalc = InvLinear(100, 51, 35.4, 12.1, a);
  } else if (a > 100 && a <= 150) {
    ConcCalc = InvLinear(150, 101, 55.4, 35.5, a);
  } else if (a > 150 && a <= 200) {
    ConcCalc = InvLinear(200, 151, 150.4, 55.5, a);
  } else if (a > 200 && a <= 300) {
    ConcCalc = InvLinear(300, 201, 250.4, 150.5, a);
  } else if (a > 300 && a <= 400) {
    ConcCalc = InvLinear(400, 301, 350.4, 250.5, a);
  } else if (a > 400 && a <= 500) {
    ConcCalc = InvLinear(500, 401, 500.4, 350.5, a);
  } else {
    ConcCalc = InvLinear(1500, 501, 1500, 500.5, a);
    // ConcCalc = "PM25message";
  }
  return ConcCalc;
}

function updateAQIStyle(AQIValue) {
  document.querySelectorAll(".aqi").forEach((e) => {
    e.textContent = AQIValue;
  });
  var aqiElement = document.querySelectorAll(".aqi")[0];
  var newClass = "aqi-" + getAQIStyle(AQIValue);

  // Remove any existing class starting with 'aqi-'
  aqiElement.className = aqiElement.className.replace(/\baqi-\S+/g, "");

  // Add the new class
  aqiElement.className += " " + newClass;
}
function getAQIStyle(AQIndex) {
  var AQI = parseFloat(AQIndex);
  var AQICategory;

  if (AQI <= 50) {
    AQICategory = "Good";
  } else if (AQI > 50 && AQI <= 100) {
    AQICategory = "Moderate";
  } else if (AQI > 100 && AQI <= 150) {
    AQICategory = "UnhealthyForSensitiveGroups";
  } else if (AQI > 150 && AQI <= 200) {
    AQICategory = "Unhealthy";
  } else if (AQI > 200 && AQI <= 300) {
    AQICategory = "VeryUnhealthy";
  } else if (AQI > 300 && AQI <= 400) {
    AQICategory = "Hazardous";
  } else if (AQI > 400) {
    AQICategory = "Hazardous";
  }

  return AQICategory;
}
//316

function ClearColorA() {
  document.form1.outputbox2.style.backgroundColor = "white";
}
getIpInfo();
// JavaScript to show/hide the Calculation section and change button text

function populateShowCalculation() {
  // JavaScript to show/hide the Calculation section and change button text
  const showCalculationButton = document.getElementById(
    "show-calculation-button"
  );

  let isCalculationVisible = false;

  showCalculationButton.addEventListener("click", () => {
    if (!isCalculationVisible) {
      showCalculationButton.textContent = "Hide Calculation";
    } else {
      showCalculationButton.textContent = "Show Calculation";
    }
    isCalculationVisible = !isCalculationVisible;
    expandContract();
  });
}
function expandContract() {
  const el = document.getElementById("calculation");
  el.classList.toggle("expanded");
  el.classList.toggle("collapsed");
}
