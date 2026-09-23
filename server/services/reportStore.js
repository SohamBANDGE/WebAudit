const fs = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "..", "data", "reports.json");
const cache = new Map();

function loadFromDisk() {
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const arr = JSON.parse(raw);
    arr.forEach((r) => cache.set(r.id, r));
  } catch (_) {
    // no file yet — that's fine
  }
}

function persist() {
  const arr = Array.from(cache.values());
  fs.writeFileSync(STORE_PATH, JSON.stringify(arr, null, 2));
}

function save(id, report) {
  cache.set(id, { id, ...report });
  persist();
}

function get(id) {
  return cache.get(id) || null;
}

loadFromDisk();

module.exports = { save, get };
