import React from "react";
import { isEmpty } from "lodash";

const TTVFetcher = () => {
    // https://tangthuvien.net/get-4-chap?story_id=38060&sort_by_ttv=10
    const [fetchedData, setFetchedData] = React.useState("");
    const [currentLink, setCurrentLink] = React.useState("");
    const [storyId, setStoryId] = React.useState("");
    const [chapter, setChapter] = React.useState(1);

    const fetchData = (input = '') => {
        const url = isEmpty(input) ? currentLink : input;
        localStorage.setItem('preTTVLink', url);
        setFetchedData("Fetching " + url);
        fetch("/api/fetch-data", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url,
            }),
        }).then(() => {
            setFetchedData("Done");
        }).catch(() => {
            setFetchedData("Error");
        });
    }

    const loadLink = () => {
        const newLink = localStorage.getItem('preTTVLink');
        setCurrentLink(newLink);
        setCustomLinkData(newLink);
    }

    const retriveData = () => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                setFetchedData(this.responseText);
            }
        };
        xhttp.open("GET", "/api/retrive-data", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();
    }

    const setCustomLinkData = (newLink) => {
        const qs = require('qs');
        const params = qs.parse(newLink.split('?')[1]);
        console.log(params.story_id);
        console.log(params.sort_by_ttv);
        setStoryId(params.story_id);
        setChapter(params.sort_by_ttv);
    }

    const onChangeCurrentLink = (e) => {
        const newLink = e.target.value;
        setCurrentLink(newLink);
        setCustomLinkData(newLink);
    }

    const editLink = ({ newStoryId, newChapter }) => {
        const newLink = `https://tangthuvien.net/get-4-chap?story_id=${newStoryId || storyId}&sort_by_ttv=${newChapter || chapter}`
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
            <button type="button" onClick={loadLink}>
                Load Previous Link
            </button>
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
            <div style={{ maxHeight: "400px", overflow: "auto" }} dangerouslySetInnerHTML={{ __html: fetchedData }}>
            </div>
        </div >
    )
}

export default TTVFetcher