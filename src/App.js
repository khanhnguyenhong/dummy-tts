import "./App.css";
import React, { Suspense } from "react";
import TCHFetcher from "./components/TCHFetcher";

const LinkFetcher = React.lazy(() => import("./components/LinkFetcher"));
const TTVFetcher = React.lazy(() => import("./components/TTVFetcher"));

function App() {
  const [currentFetcher, setCurrentFetcher] = React.useState("TTVFetcher");

  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={() => setCurrentFetcher("TTVFetcher")}>TTVFetcher</button>
          <button onClick={() => setCurrentFetcher("TCHFetcher")}>TCHFetcher</button>
        </div>

        {currentFetcher === "TTVFetcher" && <section><TTVFetcher /></section>}
        {currentFetcher === "TCHFetcher" && <section><TCHFetcher /></section>}
      </Suspense>
    </div>
  );
}

export default App;
