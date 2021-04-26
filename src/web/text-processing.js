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
  var xhttp = new XMLHttpRequest();
  var url = document.getElementById("input-url").value;
  xhttp.open("GET", "/api/fetch-text/" + btoa(url), true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

function retriveText() {
  var xhttp = new XMLHttpRequest();
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
  var xhttp = new XMLHttpRequest();
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
  const includingText = document.getElementById("input-including-text");
  urlList = [];
  urlNameList = [];
  document.getElementById("url-list").value = "";
  aTags.forEach((a) => {
    if (a.href.indexOf(includingText) > 0) {
      urlList.push(a.href);
      urlNameList.push(a.innerHTML);
      document.getElementById("url-list").value += a.href + "\n";
    }
  });
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
