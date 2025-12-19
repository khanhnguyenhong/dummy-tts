import React, { useState, useRef } from "react";
import apiService from "../services/apiService";
import { refineHtml } from "../utils/htmlUtils";

function RemainingItems({ count }) {
  return count ? <p>Remaining Item(s): {count}</p> : <p>No item</p>;
}

const LinkFetcher = () => {
  const [urlList, setUrlList] = useState([]);
  const [urlNameList, setUrlNameList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedContent, setFetchedContent] = useState("");
  
  const preUrlRef = useRef(null);
  const urlListRef = useRef(null);
  const inputUrlRef = useRef(null);
  const includingTextRef = useRef(null);
  const containerRef = useRef(null);

  const fetchData = async () => {
    const url = inputUrlRef.current.value;
    if (!url) return;
    
    setIsLoading(true);
    try {
      await apiService.fetchData(url);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const retrieveText = async () => {
    try {
      const text = await apiService.retrieveData();
      setFetchedContent(refineHtml(text));
    } catch (error) {
       console.error("Failed to retrieve text", error);
    }
  };

  const retrievePage = async () => {
    try {
      const text = await apiService.retrieveData();
      setFetchedContent(text);
    } catch (error) {
      console.error("Failed to retrieve page", error);
    }
  };

  const constructUrlList = () => {
    if (urlListRef.current) {
      setUrlList(urlListRef.current.value.split("\n").filter(line => line.trim() !== ""));
      urlListRef.current.value = "";
    }
  };

  const refineUrlListFromPage = () => {
    // Note: This still relies on the page having specific content rendered/available in the DOM.
    // Ideally this should parse fetched content, but conforming to original behavior:
    const aTags = document.getElementsByTagName("a");
    const includingText = includingTextRef.current.value;
    
    let tempUrls = [];
    let tempNames = [];
    
    for (let i = 0; i < aTags.length; i++) {
        let a = aTags[i];
        if (a.innerHTML.includes(includingText)) {
             tempUrls.push(a.href);
             tempNames.push(a.innerHTML);
        }
    }

    setUrlList(tempUrls);
    setUrlNameList(tempNames);
    
    if (urlListRef.current) {
        urlListRef.current.value = tempUrls.join("\n");
    }
  };

  const fetchFirstItem = () => {
    if (!urlList.length) return;

    const preUrl = preUrlRef.current ? preUrlRef.current.value.trim() : "";
    const nextUrl = urlList[0];
    
    if (inputUrlRef.current) {
        inputUrlRef.current.value = preUrl + nextUrl;
    }

    const newUrlList = [...urlList];
    newUrlList.shift();
    setUrlList(newUrlList);

    fetchData(); // This uses the inputUrlRef value we just set
  };

  return (
    <div className="container" ref={containerRef}>
      <a className="full-width" href="/">
        <button type="button" className="full-width">
          Home
        </button>
      </a>

      <input type="text" placeholder="Pre-url" ref={preUrlRef} id="pre-url" />
      <textarea placeholder="Url list" ref={urlListRef} id="url-list"></textarea>

      <RemainingItems count={urlList.length} />

      <button type="button" onClick={constructUrlList}>
        constructUrlList
      </button>
      <button type="button" onClick={fetchFirstItem}>
        Fetch next item
      </button>

      <div id="url-list-container">
          {/* Visualization of url list could go here if needed */}
      </div>

      <input
        type="text"
        name="url"
        placeholder="Fetching url"
        ref={inputUrlRef}
        id="input-url"
      />

      <button type="button" onClick={fetchData} disabled={isLoading}>
        {isLoading ? "Fetching..." : "Fetch data"}
      </button>
      <button type="button" onClick={retrieveText}>
        Retrieve text
      </button>
      <button type="button" onClick={retrievePage}>
        Retrieve page
      </button>

      <div className="full-width">
        <input
          type="text"
          placeholder="Including text"
          ref={includingTextRef}
          id="input-including-text"
        />
        <button type="button" onClick={refineUrlListFromPage}>
          Refine Url(s)
        </button>
      </div>

      <div id="demo" dangerouslySetInnerHTML={{ __html: fetchedContent }}></div>
    </div>
  );
};

export default LinkFetcher;
