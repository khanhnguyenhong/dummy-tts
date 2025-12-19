import "./App.css";
import React, { Suspense, useState } from "react";

const TCHFetcher = React.lazy(() => import("./components/TCHFetcher"));
const TTVFetcher = React.lazy(() => import("./components/TTVFetcher"));
const LinkFetcher = React.lazy(() => import("./components/LinkFetcher"));

function App() {
  const [currentFetcher, setCurrentFetcher] = useState("TTVFetcher");

  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <nav style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "10px" }}>
          <button onClick={() => setCurrentFetcher("TTVFetcher")}>TTVFetcher</button>
          <button onClick={() => setCurrentFetcher("TCHFetcher")}>TCHFetcher</button>
          <button onClick={() => setCurrentFetcher("LinkFetcher")}>LinkFetcher</button>
        </nav>

        <main>
            {currentFetcher === "TTVFetcher" && <TTVFetcher />}
            {currentFetcher === "TCHFetcher" && <TCHFetcher />}
            {currentFetcher === "LinkFetcher" && <LinkFetcher />}
        </main>
      </Suspense>
    </div>
  );
}

export default App;
