var http = require('http');

var options = {
    host: 'www.manulife.com.vn',
    path: '/'
}

var request = http.request(options, function (res) {
    var data = '';
    res.on('data', function (chunk) {
        data += chunk;
    });
    res.on('end', function () {
        console.log(data);
    });
});

request.on('error', function (e) {
    console.log(e.message);
});

request.end();