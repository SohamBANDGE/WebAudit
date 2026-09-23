const express = require("express");
const reportStore = require("../services/reportStore");

const router = express.Router();

router.get("/:id", (req, res) => {
  const report = reportStore.get(req.params.id);
  if (!report) {
    return res.status(404).json({ error: "Report not found." });
  }
  return res.json(report);
});

module.exports = router;
