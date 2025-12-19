import React, { useState } from "react";
import { isEmpty } from "lodash";
import apiService from "../services/apiService";

const TCHFetcher = () => {
    // https://truyenchuhay.vn/vo-tan-sat-luc-ta-hoa-cau-co-bug/chuong-10
    const [fetchedData, setFetchedData] = useState("");
    const [currentLink, setCurrentLink] = useState("");
    const [storyId, setStoryId] = useState("");
    const [chapter, setChapter] = useState(1);
    const [isSneaking, setIsSneaking] = useState(false);
    
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
            await apiService.fetchData(url);
            setFetchedData("Done");
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
            const params = newLink.split('/');
            // console.log(params);
            if (params.length > 4) {
                 setStoryId(params[3]);
                 if (params[4].includes('-')) {
                    setChapter(params[4].split('-')[1]);
                 }
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
        const newLink = `https://truyenchuhay.vn/${sId}/chuong-${chap}`
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
        const newLink = `https://truyenchuhay.vn/${storyId}/chuong-${nextChapter}`
        fetchData(newLink);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "300px", margin: "auto" }}>
            <p>TCHFetcher</p>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <button type="button" onClick={loadLink}>
                    Load Previous Link
                </button>
                <button type="button" onClick={() => {
                   const hist = getHistory();
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
            <button type="button" onClick={() => fetchNextChapters(1)}>
                Fetch next chapter
            </button>
            <button type="button" onClick={retriveData}>
                Show data
            </button>
            <button type="button" onClick={() => setIsSneaking(!isSneaking)}>Sneak: {isSneaking ? 'Yes' : 'No'}</button>
            <div style={{ maxHeight: "400px", overflow: "auto", color: (isSneaking && fetchedData?.length > 20) ? "rgb(37, 38, 38)" : "gray" }} dangerouslySetInnerHTML={{ __html: fetchedData }}>
            </div>
        </div >
    )
};

export default TCHFetcher;