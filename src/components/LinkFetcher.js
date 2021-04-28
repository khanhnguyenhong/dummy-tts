import React from "react";

class LinkFetcher extends React.Component {
  urlList = [];
  urlNameList = [];

  fetchData() {
    let xhttp = new XMLHttpRequest();
    let url = document.getElementById("input-url").value;
    xhttp.open("GET", "/api/fetch-text/" + btoa(url), true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
  }

  _splitByTag(_arr, _tag) {
    let result = [];
    _arr.forEach((e) => {
      let processingArr = (e + "").split("<" + _tag);
      processingArr.forEach((str) => {
        str = str.split("</" + _tag + ">")[0];
      });
      result = result.concat(processingArr);
    });
    return result;
  }

  _reFineHtml(htmlString) {
    const tags = ["p", "h1", "h2", "h3", "h4", "h5", "pre"];
    const junks = ["undefined", null];

    let reFinedHtml = htmlString && htmlString.length ? htmlString + "" : "";
    let refiningArr = [reFinedHtml + ""];
    tags.forEach((tag) => {
      refiningArr = this._splitByTag(refiningArr, tag);
    });

    let result = "";
    refiningArr.forEach(
      (str) =>
        (result +=
          '<p style="color: white">' + str.split("<")[0].split(">")[1] + "</p>")
    );
    junks.forEach((j) => (result = result.replace(j, "")));

    return result;
  }

  retriveText() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("demo").innerHTML = this._reFineHtml(
          this.responseText
        );
      }
    };
    xhttp.open("GET", "/api/retrive-data", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
  }

  retrivePage() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("demo").innerHTML = this.responseText;
      }
    };
    xhttp.open("GET", "/api/retrive-data", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
  }

  constructUrlList() {
    this.urlList = document.getElementById("url-list").value.split("\n");
    document.getElementById("url-list").value = "";
    const urlListContainer = document.getElementById("url-list-container");
    urlListContainer.innerHTML = "Item(s): " + this.urlList.length;
  }

  refineUrlListFromPage() {
    const aTags = document.getElementsByTagName("a");
    const includingText = document.getElementById("input-including-text").value;
    this.urlList = [];
    this.urlNameList = [];

    let tempUrls = [],
      tempNames = [];
    for (let i = 0; i < aTags.length; i++) {
      let a = aTags[i];
      try {
        tempUrls.push(a.href);
        tempNames.push(a.innerHTML);
      } catch (error) {
        console.log("error while refining a tag", error);
      }
    }

    document.getElementById("url-list").value = "";
    for (let i = 0; i < tempUrls.length; i++) {
      if (tempNames[i].indexOf(includingText) >= 0) {
        this.urlNameList.push(tempNames[i]);
        this.urlList.push(tempUrls[i]);
        document.getElementById("url-list").value += tempUrls[i] + "\n";
      }
    }
  }

  fetchFirstItem() {
    if (this.urlList.length) {
      document.getElementById("url-list-container").innerHTML = "No item";
      return;
    }
    const preUrl = document.getElementById("pre-url").value.trim();
    document.getElementById("input-url").value = preUrl + this.urlList[0];
    this.urlList.splice(0, 1);
    document.getElementById("url-list-container").innerHTML =
      "Item(s): " + this.urlList.length;
    this.fetchData();
  }

  render() {
    return (
      <div className="container">
        <a className="full-width" href="\">
          <button type="button" className="full-width">
            Home
          </button>
        </a>

        <input type="text" placeholder="Pre-url" id="pre-url" />
        <textarea placeholder="Url list" id="url-list"></textarea>

        <button type="button" onClick={this.constructUrlList}>
          constructUrlList
        </button>
        <button type="button" onClick={this.fetchFirstItem}>
          Fetch next item
        </button>

        <div id="url-list-container"></div>

        <input
          type="text"
          name="url"
          placeholder="Fetching url"
          id="input-url"
        />

        <button type="button" onClick={() => this.fetchData()}>
          Fetch data
        </button>
        <button type="button" onClick={this.retriveText}>
          Retrieve text
        </button>
        <button type="button" onClick={this.retrivePage}>
          Retrieve page
        </button>

        <div className="full-width">
          <input
            type="text"
            placeholder="Including text"
            id="input-including-text"
          />
          <button type="button" onClick={this.refineUrlListFromPage}>
            Refine Url(s)
          </button>
        </div>

        <div id="demo"></div>
      </div>
    );
  }
}

export default LinkFetcher;
