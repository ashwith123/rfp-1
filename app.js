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

app.get("/predict", (req, res) => {
  res.render("predict", { prediction: null });
});

// POST route to handle prediction request
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
    try {
      prediction = JSON.parse(data.toString());
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      prediction = { prediction: "Error parsing Python output." };
    }

    res.render("predict", { prediction: JSON.stringify(prediction) });
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("PYTHON STDERR:", data.toString());
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python script exited with code ${code}`);
  });
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.listen(8080, () => {
  console.log("Server is listening at port 8080");
});
