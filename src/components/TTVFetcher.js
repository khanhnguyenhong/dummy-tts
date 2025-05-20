import React from "react";

const TTVFetcher = () => {
    const [fetchedData, setFetchedData] = React.useState("");

    const fetchData = () => {
        let url = document.getElementById("input-url").value;
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

    return (
        <div style={{ display: "flex", flexDirection: "column"; width: "300px", margin: "auto" }}>
            <input type="text" placeholder="Url" id="input-url" />
            <button type="button" onClick={fetchData}>
                Fetch
            </button>
            <button type="button" onClick={retriveData}>
                Show data
            </button>
            <div dangerouslySetInnerHTML={{ __html: fetchedData }}>
            </div>
        </div >
    )
}

export default TTVFetcher