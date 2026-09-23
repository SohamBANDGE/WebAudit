import GoogleAdsSimulator from "./pages/GoogleAdsSimulator.jsx";
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Header from "./components/Header.jsx";
import Landing from "./pages/Landing.jsx";
import Report from "./pages/Report.jsx";
import KeywordResearch from "./pages/KeywordResearch.jsx";
import ContentOptimizer from "./pages/ContentOptimizer.jsx";

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

          {/* HOME / ASSIGNMENT 1 */}
          <Route
            path="/"
            element={
              <Landing
                onScan={handleScan}
                loading={loading}
                error={error}
              />
            }
          />

          {/* ASSIGNMENT 2 - KEYWORD RESEARCH */}
          <Route
            path="/keywords"
            element={<KeywordResearch />}
          />

          {/* ASSIGNMENT 2 - CONTENT OPTIMIZATION */}
          <Route
            path="/content-optimizer"
            element={<ContentOptimizer />}
          />
          <Route
              path="/google-ads"
              element={<GoogleAdsSimulator />}
          />

          {/* SEO AUDIT REPORT */}
          <Route
            path="/report/:id"
            element={
              <Report
                report={report}
                onScanAnother={resetScan}
              />
            }
          />

        </Routes>
      </main>
    </div>
  );
}