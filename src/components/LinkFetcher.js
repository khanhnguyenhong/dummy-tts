import React, { useState, useRef } from "react";
import apiService from "../services/apiService";
import {
  paperColor,
  toolStyle,
  inputStyle,
  containerStyle,
  linkInputStyle,
} from "../styles/commonStyles";

function RemainingItems({ count }) {
  return count ? <p style={{ textAlign: "center" }}>Remaining Item(s): {count}</p> : <p style={{ textAlign: "center" }}>No item</p>;
}

const LinkFetcher = () => {
  const [urlList, setUrlList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedContent, setFetchedContent] = useState("");
  const [showTools, setShowTools] = useState(true);
  const [isSneaking, setIsSneaking] = useState(false);
  
  const preUrlRef = useRef(null);
  const urlListRef = useRef(null);
  const inputUrlRef = useRef(null);
  const includingTextRef = useRef(null);
  const domainNameInput = useRef(null)
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
      setFetchedContent(text);
    } catch (error) {
       console.error("Failed to retrieve text", error);
    }
  };

  const extractAllUrlsFromATags = (text) => {
    const urls = text.match(/href='([^']+)'/g) || [];
    return urls.map(url => url.replace(/href='/, "").replace(/'/, ""));
  }

  const refineUrlListFromPage = () => {
    const includingText = includingTextRef.current.value;
    const preUrl = preUrlRef.current ? preUrlRef.current.value.trim() : "";
    const domainName = domainNameInput.current.value;
    const urlsFromText = extractAllUrlsFromATags(preUrl)
    
    let tempUrls = [];
    
    for (let i = 0; i < urlsFromText.length; i++) {
        const url = urlsFromText[i];
        if (url.includes(includingText)) {
             tempUrls.push(domainName + url);
        }
    }

    setUrlList(tempUrls);
    
    if (urlListRef.current) {
        urlListRef.current.value = tempUrls.join("\n");
    }
  };

  const fetchFirstItem = () => {
    if (!urlList.length) return;

    if (inputUrlRef.current) {
      inputUrlRef.current.value = urlList[0];
    }

    const newUrlList = [...urlList];
    newUrlList.shift();
    setUrlList(newUrlList);

    fetchData();
  };

  return (
    <div style={containerStyle} ref={containerRef}>
      <button type="button" style={toolStyle} onClick={() => setShowTools(!showTools)}>
        {showTools ? 'Hide Tools' : 'Show Tools'}
      </button>

      {showTools && (
        <>
          <textarea placeholder="Pre-url" ref={preUrlRef} id="pre-url" style={linkInputStyle} />
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Including text"
              ref={includingTextRef}
              id="input-including-text"
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Domain name"
              ref={domainNameInput}
              id="input-domain-name"
              style={inputStyle}
            />
            <button type="button" style={toolStyle} onClick={refineUrlListFromPage}>
              Refine Url(s)
            </button>
          </div>

          <textarea placeholder="Url list" ref={urlListRef} id="url-list" style={linkInputStyle}></textarea>

          <RemainingItems count={urlList.length} />

          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
            <button type="button" style={toolStyle} onClick={fetchFirstItem}>
              Fetch next item
            </button>
          </div>

          <input
            type="text"
            name="url"
            placeholder="Fetching url"
            ref={inputUrlRef}
            id="input-url"
            style={inputStyle}
          />

          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
            <button type="button" style={toolStyle} onClick={fetchData} disabled={isLoading}>
              {isLoading ? "Fetching..." : "Fetch data"}
            </button>
            <button type="button" style={toolStyle} onClick={retrieveText}>
              Retrieve text
            </button>
          </div>

          <button type="button" style={toolStyle} onClick={() => setIsSneaking(!isSneaking)}>
            Sneak: {isSneaking ? 'Yes' : 'No'}
          </button>
        </>
      )}

      {!showTools && (
        <button type="button" style={toolStyle} onClick={fetchFirstItem}>
          Fetch next item
        </button>
      )}

      <div
        id="demo"
        style={{
          maxHeight: "600px",
          overflow: "auto",
          marginTop: "20px",
          padding: "10px",
          color: isSneaking ? paperColor : "#333"
        }}
        dangerouslySetInnerHTML={{ __html: fetchedContent }}
      ></div>
    </div>
  );
};

export default LinkFetcher;
