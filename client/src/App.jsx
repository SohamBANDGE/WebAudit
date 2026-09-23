import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Landing from "./pages/Landing.jsx";
import Report from "./pages/Report.jsx";
import { scanUrl } from "./lib/api.js";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

  async function handleScan(url) {
    setLoading(true);
    setError(null);
    try {
      const data = await scanUrl(url);
      setReport(data);
      navigate(`/report/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function resetScan() {
    setReport(null);
    setError(null);
    navigate("/");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Landing onScan={handleScan} loading={loading} error={error} />
            }
          />
          <Route
            path="/report/:id"
            element={<Report report={report} onScanAnother={resetScan} />}
          />
        </Routes>
      </main>
    </div>
  );
}
