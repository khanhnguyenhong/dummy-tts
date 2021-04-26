let urlList = [];
let urlNameList = [];

function _splitByTag(_arr, _tag) {
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

function _reFineHtml(htmlString) {
  const tags = ["p", "h1", "h2", "h3", "h4", "h5", "pre"];
  const junks = ["undefined", null];

  let reFinedHtml = htmlString && htmlString.length ? htmlString + "" : "";
  let refiningArr = [reFinedHtml + ""];
  tags.forEach((tag) => {
    refiningArr = _splitByTag(refiningArr, tag);
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

function fetchData() {
  let xhttp = new XMLHttpRequest();
  let url = document.getElementById("input-url").value;
  xhttp.open("GET", "/api/fetch-text/" + btoa(url), true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

function retriveText() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML = _reFineHtml(
        this.responseText
      );
    }
  };
  xhttp.open("GET", "/api/retrive-data", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

function retrivePage() {
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

function constructUrlList() {
  urlList = document.getElementById("url-list").value.split("\n");
  document.getElementById("url-list").value = "";
  const urlListContainer = document.getElementById("url-list-container");
  urlListContainer.innerHTML = "Item(s): " + urlList.length;
}

function refineUrlListFromPage() {
  const aTags = document.getElementsByTagName("a");
  const includingText = document.getElementById("input-including-text").value;
  urlList = [];
  urlNameList = [];

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
      urlNameList.push(tempNames[i]);
      urlList.push(tempUrls[i]);
      document.getElementById("url-list").value += tempUrls[i] + "\n";
    }
  }
}

function fetchFirstItem() {
  if (!urlList.length) {
    document.getElementById("url-list-container").innerHTML = "No item";
    return;
  }
  const preUrl = document.getElementById("pre-url").value.trim();
  document.getElementById("input-url").value = preUrl + urlList[0];
  urlList.splice(0, 1);
  document.getElementById("url-list-container").innerHTML =
    "Item(s): " + urlList.length;
  fetchData();
}
