const http = require("follow-redirects").https;
const fs = require("fs");
const fileName = "temp-db.txt";
const historyFileName = "history.txt";

function fetchTextController() {
  function _fetchTextFromUrl(url) {
    url = url.trim();
    console.log("fetching data from", url);
    return new Promise((resolve) => {
      let responseHtml = "";
      const options = {
        host: "www.google.com",
        path: "/",
      };

      if (url.length) {
        var requestArr = url.split("//")[1].split("/");
        options.host = requestArr[0];
        options.path = "";
        for (var i = 1; i < requestArr.length; i++) {
          options.path += "/" + requestArr[i];
        }
      }

      const request = http.request(options, (res) => {
        res.on("data", (chunk) => {
          responseHtml += chunk;
        });
        res.on("end", function () {
          try {
            if (!fs.existsSync(fileName)) {
              fs.writeFileSync(fileName, '');
              console.log(`File ${fileName} created`);
            }
            const data = new Uint8Array(Buffer.from(responseHtml));
            fs.promises.writeFile(fileName, data);
          } catch (err) {
            console.error(err);
          }

          let historyContent = '';
          try {
            if (!fs.existsSync(historyFileName)) {
              fs.writeFileSync(historyFileName, '');
              console.log(`File ${historyFileName} created`);
            }

            fs.promises.readFile(historyFileName).then((data) => {
              historyContent = data.toString();
            });

            const history = new Uint8Array(Buffer.from(historyContent + '\n' + url));
            fs.promises.writeFile(historyFileName, url);
          } catch (err) {
            console.error(err);
          }

          resolve(responseHtml);
        });
      });

      request.on("error", function (e) {
        console.error(e);
      });

      request.end();
    });
  }

  function fetchText(req, res) {
    const { url } = req.params;
    const decodedUrl = Buffer.from(url, "base64").toString();

    _fetchTextFromUrl(decodedUrl);

    res.send(true);
  }

  function fetchDataFromUrl(req, res) {
    const { url } = req.body;

    _fetchTextFromUrl(url);

    res.send(true);
  }

  function retriveData(req, res) {
    if (!fs.existsSync(fileName)) {
      res.send("Please fetch data...");
      return
    }
    try {
      fs.promises.readFile(fileName).then((data) => {
        console.log("data from file:", data);
        res.send(data);
      });
    } catch (err) {
      console.error(err);
      res.send("Please fetch data...");
    }
  }

  function fetchHistory(req, res) {
    if (!fs.existsSync(historyFileName)) {
      res.send("No history...");
      return
    }
    try {
      fs.promises.readFile(historyFileName).then((data) => {
        console.log("history from file:", data);
        res.send(data);
      });
    } catch (err) {
      console.error(err);
      res.send("Please fetch data...");
    }
  }

  return {
    fetchText,
    retriveData,
    fetchHistory,
    fetchDataFromUrl,
  };
}

module.exports = fetchTextController;
