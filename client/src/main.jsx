import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ManagerContext from "./context/ManagerContext.jsx";
import StudentContext from "./context/StudentContext.jsx";

createRoot(document.getElementById("root")).render(
  <ManagerContext>
    <StudentContext>
      {/* <StrictMode> */}
        <App />
      {/* </StrictMode> */}
    </StudentContext>
  </ManagerContext>
);
