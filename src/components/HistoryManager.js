import React, { useState, useEffect } from "react";
import apiService from "../services/apiService";
import {
    toolStyle,
    historyContainerStyle,
    historyTitleStyle,
    historyListStyle,
    historyEntryStyle,
    historyEntryInfoStyle,
    historyTimestampStyle,
    historyUrlStyle,
    emptyHistoryStyle,
    copyButtonBaseStyle,
} from "../styles/commonStyles";

const HistoryManager = () => {
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);

    const STORAGE_KEY = "historyManagerData";

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setHistoryList(JSON.parse(saved));
        } catch (e) {
            console.error("Failed to load history from localStorage", e);
        }
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await apiService.fetchHistory();
            const parsed = data?.history ?? [];
            const list = Array.isArray(parsed) ? parsed : [];
            setHistoryList(list);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (error) {
            console.error("Error fetching history from server", error);
            setHistoryList([]);
        } finally {
            setLoading(false);
        }
    };

    const copyUrl = (entry, index) => {
        const separator = " - ";
        const separatorIndex = entry.indexOf(separator);
        const url = separatorIndex !== -1
            ? entry.slice(separatorIndex + separator.length)
            : entry;
        window.prompt("Copy to clipboard: Ctrl+C, Enter", url);
        setCopiedIndex(index);
    };

    return (
        <div style={historyContainerStyle}>
            <h3 style={historyTitleStyle}>
                History Manager
            </h3>

            <button type="button" style={toolStyle} onClick={fetchHistory} disabled={loading}>
                {loading ? "Fetching..." : "Fetch History"}
            </button>

            {historyList.length > 0 && (
                <div style={historyListStyle}>
                    {historyList.map((entry, index) => {
                        const separator = " - ";
                        const separatorIndex = entry.indexOf(separator);
                        const timestamp = separatorIndex !== -1 ? entry.slice(0, separatorIndex) : "";
                        const url = separatorIndex !== -1 ? entry.slice(separatorIndex + separator.length) : entry;
                        const isCopied = copiedIndex === index;

                        return (
                            <div key={index} style={historyEntryStyle}>
                                <div style={historyEntryInfoStyle}>
                                    <div style={historyTimestampStyle}>{timestamp}</div>
                                    <div style={historyUrlStyle}>{url}</div>
                                </div>
                                <button
                                    type="button"
                                    style={{
                                        ...copyButtonBaseStyle,
                                        backgroundColor: isCopied ? "#d4edda" : "#fff",
                                        borderColor: isCopied ? "#28a745" : "#333",
                                        color: isCopied ? "#28a745" : "#333",
                                    }}
                                    onClick={() => copyUrl(entry, index)}
                                >
                                    {isCopied ? "Copied!" : "Copy URL"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && historyList.length === 0 && (
                <p style={emptyHistoryStyle}>
                    No history loaded yet.
                </p>
            )}
        </div>
    );
};

export default HistoryManager;
