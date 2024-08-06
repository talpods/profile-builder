import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AntThemeProvider from "./Providers/AntThemeProvider";
import StateProvider from "./Providers/StateProvider";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StateProvider>
    <AntThemeProvider>
      <App />
    </AntThemeProvider>
  </StateProvider>
);

reportWebVitals();
