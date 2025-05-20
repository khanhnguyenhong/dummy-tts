import "./App.css";
import React, { Suspense } from "react";

const LinkFetcher = React.lazy(() => import("./components/LinkFetcher"));
const TTVFetcher = React.lazy(() => import("./components/TTVFetcher"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          {/* <LinkFetcher /> */}
          <TTVFetcher />
        </section>
      </Suspense>
    </div>
  );
}

export default App;
