import "./App.css";
import React, { Suspense, useState } from "react";
import { toolStyle, activeToolStyle } from "./styles/commonStyles";

const TCHFetcher = React.lazy(() => import("./components/TCHFetcher"));
const TTVFetcher = React.lazy(() => import("./components/TTVFetcher"));
const LinkFetcher = React.lazy(() => import("./components/LinkFetcher"));
const FlexLinkFetcher = React.lazy(() => import("./components/FlexLinkFetcher"));
const HistoryManager = React.lazy(() => import("./components/HistoryManager"));

function App() {
  const [currentFetcher, setCurrentFetcher] = useState("TTVFetcher");

  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <main>
          {currentFetcher === "TTVFetcher" && <TTVFetcher />}
          {currentFetcher === "TCHFetcher" && <TCHFetcher />}
          {currentFetcher === "LinkFetcher" && <LinkFetcher />}
          {currentFetcher === "FlexLinkFetcher" && <FlexLinkFetcher />}
          {currentFetcher === "HistoryManager" && <HistoryManager />}
        </main>

        <nav style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", justifyContent: "center", gap: "10px", padding: "10px", width: "100%" }}>
          <button
            style={currentFetcher === "TTVFetcher" ? activeToolStyle : toolStyle}
            onClick={() => setCurrentFetcher("TTVFetcher")}
          >
            TTVFetcher
          </button>
          <button
            style={currentFetcher === "TCHFetcher" ? activeToolStyle : toolStyle}
            onClick={() => setCurrentFetcher("TCHFetcher")}
          >
            TCHFetcher
          </button>
          <button
            style={currentFetcher === "LinkFetcher" ? activeToolStyle : toolStyle}
            onClick={() => setCurrentFetcher("LinkFetcher")}
          >
            LinkFetcher
          </button>
          <button
            style={currentFetcher === "FlexLinkFetcher" ? activeToolStyle : toolStyle}
            onClick={() => setCurrentFetcher("FlexLinkFetcher")}
          >
            FlexLinkFetcher
          </button>
          <button
            style={currentFetcher === "HistoryManager" ? activeToolStyle : toolStyle}
            onClick={() => setCurrentFetcher("HistoryManager")}
          >
            HistoryManager
          </button>
        </nav>
      </Suspense>
    </div>
  );
}

export default App;
