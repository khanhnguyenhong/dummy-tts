import React, { useState, useEffect } from "react";
import apiService from "../services/apiService";
import {
  paperColor,
  toolStyle,
  inputStyle,
  containerStyle,
} from "../styles/commonStyles";

const FlexLinkFetcher = () => {
  const [linkHead, setLinkHead] = useState("");
  const [flexibleNumber, setFlexibleNumber] = useState(0);
  const [linkTrail, setLinkTrail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedContent, setFetchedContent] = useState("");
  const [isSneaking, setIsSneaking] = useState(false);
  const [showTools, setShowTools] = useState(true);

  useEffect(() => {
    const savedLinkHead = localStorage.getItem("flexFetch_linkHead");
    const savedFlexibleNumber = localStorage.getItem("flexFetch_flexibleNumber");
    const savedLinkTrail = localStorage.getItem("flexFetch_linkTrail");

    if (savedLinkHead !== null) setLinkHead(savedLinkHead);
    if (savedFlexibleNumber !== null) setFlexibleNumber(parseInt(savedFlexibleNumber) || 0);
    if (savedLinkTrail !== null) setLinkTrail(savedLinkTrail);
  }, []);

  useEffect(() => {
    localStorage.setItem("flexFetch_linkHead", linkHead);
    localStorage.setItem("flexFetch_flexibleNumber", flexibleNumber);
    localStorage.setItem("flexFetch_linkTrail", linkTrail);
  }, [linkHead, flexibleNumber, linkTrail]);

  const getCombinedUrl = () => {
    return `${linkHead}${flexibleNumber}${linkTrail}`;
  };

  const fetchData = async () => {
    const url = getCombinedUrl();
    if (!url) return;

    setIsLoading(true);
    try {
      await apiService.fetchData(url);
      await retrieveText();
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

  const fetchNext = async () => {
    const nextNumber = flexibleNumber + 1;
    setFlexibleNumber(nextNumber);
    
    const url = `${linkHead}${nextNumber}${linkTrail}`;
    
    setIsLoading(true);
    try {
      await apiService.fetchData(url);
      await retrieveText();
    } catch (error) {
      console.error("Failed to fetch next data", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <button 
        type="button" 
        style={toolStyle} 
        onClick={() => setShowTools(!showTools)}
      >
        {showTools ? 'Hide Tools' : 'Show Tools'}
      </button>

      {showTools && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <input
              type="text"
              placeholder="Link Head"
              value={linkHead}
              onChange={(e) => setLinkHead(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Flexible Number"
              value={flexibleNumber}
              onChange={(e) => setFlexibleNumber(parseInt(e.target.value) || 0)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Link Trail"
              value={linkTrail}
              onChange={(e) => setLinkTrail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ padding: "10px", wordBreak: "break-all", fontSize: "12px", border: "1px dashed #ccc", margin: "5px 0" }}>
            URL: {getCombinedUrl()}
          </div>

          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
            <button type="button" style={toolStyle} onClick={fetchData} disabled={isLoading}>
              {isLoading ? "Fetching..." : "Fetch"}
            </button>
            <button type="button" style={toolStyle} onClick={retrieveText}>
              Retrieve Text
            </button>
            <button type="button" style={toolStyle} onClick={fetchNext} disabled={isLoading}>
              Fetch Next
            </button>
          </div>

          <button type="button" style={toolStyle} onClick={() => setIsSneaking(!isSneaking)}>
            Sneak: {isSneaking ? 'Yes' : 'No'}
          </button>
        </>
      )}

      {!showTools && (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <button type="button" style={toolStyle} onClick={fetchNext} disabled={isLoading}>
                Fetch Next ({flexibleNumber + 1})
            </button>
        </div>
      )}

      <div
        id="content-display"
        style={{
          maxHeight: "600px",
          overflow: "auto",
          marginTop: "20px",
          padding: "10px",
          color: isSneaking ? paperColor : "#333",
          borderTop: "1px solid #eee"
        }}
        dangerouslySetInnerHTML={{ __html: fetchedContent }}
      ></div>
    </div>
  );
};

export default FlexLinkFetcher;
