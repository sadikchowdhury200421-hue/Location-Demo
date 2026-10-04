
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DASHBOARD_KEY = process.env.DASHBOARD_KEY;

let latestLocation = null;

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/location", (req, res) => {
  const { latitude, longitude } = req.body;

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    latitude < -90 || latitude > 90 ||
    longitude < -180 || longitude > 180
  ) {
    return res.status(400).json({
      error: "Invalid coordinates"
    });
  }

  latestLocation = {
    latitude,
    longitude,
    sharedAt: new Date().toISOString()
  };

  res.json({ success: true });
});

app.get("/api/location", (req, res) => {
  if (
    !DASHBOARD_KEY ||
    req.get("Authorization") !== `Bearer ${DASHBOARD_KEY}`
  ) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  res.json(latestLocation);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
