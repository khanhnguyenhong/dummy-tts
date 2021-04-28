import "./App.css";
import React, { Suspense } from "react";

const LinkFetcher = React.lazy(() => import("./components/LinkFetcher"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <LinkFetcher />
        </section>
      </Suspense>
    </div>
  );
}

export default App;
