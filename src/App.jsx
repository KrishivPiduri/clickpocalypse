import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import VerbDrill from "./VerbDrill";
import SentenceBuilder from "./SentenceBuilder.jsx";
import ParseSentence from "./ParseSentence.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/drill" element={<VerbDrill />} />
          <Route path="/sentence" element={<SentenceBuilder />} />
          <Route path="/Parse" element={<ParseSentence />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

