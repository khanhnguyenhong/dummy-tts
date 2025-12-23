import "./App.css";
import React, { Suspense, useState } from "react";
import { toolStyle } from "./styles/commonStyles";

const TCHFetcher = React.lazy(() => import("./components/TCHFetcher"));
const TTVFetcher = React.lazy(() => import("./components/TTVFetcher"));
const LinkFetcher = React.lazy(() => import("./components/LinkFetcher"));

function App() {
  const [currentFetcher, setCurrentFetcher] = useState("TTVFetcher");

  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <main>
          {currentFetcher === "TTVFetcher" && <TTVFetcher />}
          {currentFetcher === "TCHFetcher" && <TCHFetcher />}
          {currentFetcher === "LinkFetcher" && <LinkFetcher />}
        </main>

        <nav style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "10px" }}>
          <button style={toolStyle} onClick={() => setCurrentFetcher("TTVFetcher")}>TTVFetcher</button>
          <button style={toolStyle} onClick={() => setCurrentFetcher("TCHFetcher")}>TCHFetcher</button>
          <button style={toolStyle} onClick={() => setCurrentFetcher("LinkFetcher")}>LinkFetcher</button>
        </nav>
      </Suspense>
    </div>
  );
}

export default App;
