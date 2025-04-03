import { useState, useEffect } from "react";
import BoringLayout from "./components/layouts/BoringLayout";
import DesignLayout from "./components/layouts/DesignLayout";

function App() {
  const [design, setDesign] = useState(0);

  useEffect(() => {
    if (window.location.pathname === "/fancy") {
      setDesign(1);
    }
  }, []);

  return design == 0 ? <BoringLayout /> : <DesignLayout />
}

export default App;
