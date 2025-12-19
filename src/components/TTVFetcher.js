import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import apiService from "../services/apiService";

const TTVFetcher = () => {
    // https://tangthuvien.net/get-4-chap?story_id=38060&sort_by_ttv=217
    const [fetchedData, setFetchedData] = useState("");
    const [currentLink, setCurrentLink] = useState("");
    const [storyId, setStoryId] = useState("");
    const [chapter, setChapter] = useState(1);
    const [isSneaking, setIsSneaking] = useState(false);
    
    // Use state for history to ensure re-renders if needed, though originally it was a local var
    // But since it's only used for display and local storage, local variable in render scope or ref is better if we don't want re-renders on every change.
    // However, the original code had `let history = {}` inside component body which is reset on every render! 
    // This looks like a bug in original code (or it relied on `getHistory` called inside functions).
    // I will keep it simple.
    
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
        <div style={{ display: "flex", flexDirection: "column", width: "300px", margin: "auto" }}>
            <p>TTVFetcher</p>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <button type="button" onClick={loadLink}>
                    Load Previous Link
                </button>
                <button type="button" onClick={() => {
                    const hist = getHistory()
                    setFetchedData(JSON.stringify(hist))
                }}>
                    Fetch History
                </button>
                <button type="button" onClick={fetchHistoryFromServer}>
                    Fetch History from Server
                </button>
            </div>

            <textarea type="text" placeholder="Url" value={currentLink} onChange={onChangeCurrentLink} />
            <div style={{ display: "flex", flexDirection: "row" }}>
                <input type="text" placeholder="story_id" value={storyId} onChange={onChangeStoryId} />
                <input type="text" placeholder="chapter" value={chapter} onChange={onChangeChapter} />
            </div>
            <button type="button" onClick={() => fetchData()}>
                Fetch
            </button>
            <button type="button" onClick={() => fetchNextChapters(4)}>
                Fetch next 4 chapters
            </button>
            <button type="button" onClick={retriveData}>
                Show data
            </button>
            <button type="button" onClick={() => setIsSneaking(!isSneaking)}>Sneak: {isSneaking ? 'Yes' : 'No'}</button>
            <div style={{ maxHeight: "400px", overflow: "auto", color: (isSneaking && fetchedData?.length > 20) ? "rgb(37, 38, 38)" : "gray" }} dangerouslySetInnerHTML={{ __html: fetchedData }}>
            </div>
        </div >
    )
}

export default TTVFetcher