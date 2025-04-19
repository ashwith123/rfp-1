const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser"); // Add body-parser for form data handling
const path = require("path");
const { PythonShell } = require("python-shell");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/predict", (req, res) => {
  res.render("predict", { prediction: null });
});

// POST route to handle prediction request
app.post("/predict", (req, res) => {
  var symptoms = req.body.symptoms || [];

  if (typeof symptoms === "string") {
    symptoms = symptoms.split(",").map((s) => s.trim());
  }

  console.log("Symptoms:", symptoms);

  const options = {
    args: [symptoms.join(",")],
  };

  PythonShell.run("RFP2.py", options, (err, results) => {
    if (err) {
      console.error("Python Error:", err);
      return res
        .status(500)
        .render("predict", { prediction: "Error predicting disease." });
    }

    let prediction = "No prediction";
    try {
      prediction = JSON.parse(results[0]);
    } catch (e) {
      console.error("JSON Parse Error:", e);
    }

    // Render the same predictor page with prediction result
    res.render("predictor", { prediction });
  });
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.listen(8080, () => {
  console.log("Server is listening at port 8080");
});
