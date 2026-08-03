import React from "react";
import ReactDOM from "react-dom/client";
import ViolationAnalyzer from "./app/ViolationAnalyzer?review-layout=20260803";
import "./app/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ViolationAnalyzer />
  </React.StrictMode>,
);
