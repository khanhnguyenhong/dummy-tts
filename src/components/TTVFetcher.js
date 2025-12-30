import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import apiService from "../services/apiService";
import {
    paperColor,
    toolStyle,
    inputStyle,
    containerStyle,
    linkInputStyle,
    shortInputStyle,
    shorterInputStyle
} from "../styles/commonStyles";

const TTVFetcher = () => {
    // https://tangthuvien.net/get-4-chap?story_id=38060&sort_by_ttv=217
    const [fetchedData, setFetchedData] = useState("");
    const [currentLink, setCurrentLink] = useState("");
    const [storyId, setStoryId] = useState("");
    const [chapter, setChapter] = useState(1);
    const [isSneaking, setIsSneaking] = useState(false);
    const [showTools, setShowTools] = useState(true);

    const getHistory = () => {
        const historyString = localStorage.getItem('preTTVHistory');
        if (historyString) {
            try {
                return JSON.parse(historyString);
            } catch (e) {
                return {};
            }
        }
        return {};
    }

    const fetchData = async (input = '') => {
        const url = isEmpty(input) ? currentLink : input;
        localStorage.setItem('preTTVLink', url);

        const history = getHistory();
        localStorage.setItem('preTTVHistory', JSON.stringify({
            ...history,
            [storyId]: chapter
        }));

        setFetchedData("Fetching " + url);
        try {
            const response = await apiService.fetchData(url);
            setFetchedData(JSON.stringify(response.data, null, 2));
        } catch (error) {
            setFetchedData("Error");
        }
    }

    const loadLink = () => {
        const newLink = localStorage.getItem('preTTVLink');
        if (newLink) {
            setCurrentLink(newLink);
            setCustomLinkData(newLink);
        }
    }

    const retriveData = async () => {
        try {
            const data = await apiService.retrieveData();
            setFetchedData(data);
        } catch (error) {
            console.error("Error retrieving data", error);
        }
    }

    const fetchHistoryFromServer = async () => {
        try {
            const data = await apiService.fetchHistory();
            setFetchedData(data);
        } catch (error) {
            console.error("Error fetching history", error);
        }
    }

    const setCustomLinkData = (newLink) => {
        if (!newLink) return;
        try {
            const qs = require('qs');
            if (newLink.split('?')[1]) {
                const params = qs.parse(newLink.split('?')[1]);
                if (params.story_id) setStoryId(params.story_id);
                if (params.sort_by_ttv) setChapter(params.sort_by_ttv);
            }
        } catch (e) {
            console.error("Error parsing link", e);
        }
    }

    const onChangeCurrentLink = (e) => {
        const newLink = e.target.value;
        setCurrentLink(newLink);
        setCustomLinkData(newLink);
    }

    const editLink = ({ newStoryId, newChapter }) => {
        const sId = newStoryId || storyId;
        const chap = newChapter || chapter;
        const newLink = `https://tangthuvien.net/get-4-chap?story_id=${sId}&sort_by_ttv=${chap}`
        setCurrentLink(newLink);
    }

    const onChangeStoryId = (e) => {
        setStoryId(e.target.value);
        editLink({
            newStoryId: e.target.value
        })
    }

    const onChangeChapter = (e) => {
        setChapter(e.target.value);
        editLink({
            newChapter: e.target.value
        })
    }

    const fetchNextChapters = (number) => {
        const nextChapter = parseInt(chapter) + number;
        setChapter(nextChapter);
        editLink({
            newChapter: nextChapter
        })
        const newLink = `https://tangthuvien.net/get-4-chap?story_id=${storyId}&sort_by_ttv=${nextChapter}`
        fetchData(newLink);
    }

    return (
        <div style={containerStyle}>
            <button type="button" style={toolStyle} onClick={() => setShowTools(!showTools)}>
                {showTools ? 'Hide Tools' : 'Show Tools'}
            </button>

            {showTools && (
                <>
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                        <button type="button" style={toolStyle} onClick={loadLink}>
                            Load Previous Link
                        </button>
                        <button type="button" style={toolStyle} onClick={() => {
                            const hist = getHistory()
                            setFetchedData(JSON.stringify(hist))
                        }}>
                            Fetch History
                        </button>
                        <button type="button" style={toolStyle} onClick={fetchHistoryFromServer}>
                            Fetch History from Server
                        </button>
                    </div>
                </>
            )}

            {showTools && (
                <textarea type="text" placeholder="Url" value={currentLink} onChange={onChangeCurrentLink} style={linkInputStyle} />
            )}

            {showTools && (
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <input type="text" placeholder="story_id" value={storyId} onChange={onChangeStoryId} style={shortInputStyle} />
                    <input type="text" placeholder="chapter" value={chapter} onChange={onChangeChapter} style={shorterInputStyle} />
                </div>
            )}

            {showTools && (
                <button type="button" style={toolStyle} onClick={() => fetchData()}>
                    Fetch
                </button>
            )}

            <button type="button" style={toolStyle} onClick={() => fetchNextChapters(4)}>
                Fetch next 4 chapters
            </button>

            <button type="button" style={toolStyle} onClick={retriveData}>
                Show data
            </button>

            {showTools && (
                <button type="button" style={toolStyle} onClick={() => setIsSneaking(!isSneaking)}>Sneak: {isSneaking ? 'Yes' : 'No'}</button>
            )}

            <div
                style={{
                    maxHeight: "600px",
                    overflow: "auto",
                    marginTop: "20px",
                    padding: "10px",
                    color: isSneaking ? paperColor : "#333"
                }}
                dangerouslySetInnerHTML={{ __html: fetchedData }}
            >
            </div>
        </div >
    )
}

export default TTVFetcher