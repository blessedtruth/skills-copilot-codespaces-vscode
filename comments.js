// Create web server

var http = require('http');
var fs = require('fs');
var url = require('url');

var comments = [];

function renderCommentsList(comments) {
    var list = '<ul>';
    for (var i = 0; i < comments.length; i++) {
        list += '<li><b>' + comments[i].name + '</b> said: <i>' + comments[i].text + '</i></li>';
    }
    list += '</ul>';
    return list;
}

function renderForm() {
    return '<form method="POST" action="/addComment">' +
        'Name: <input type="text" name="name" /><br />' +
        'Comment: <input type="text" name="text" size="50" /><br />' +
        '<input type="submit" />' +
        '</form>';
}

function renderPage(title, comments) {
    return '<html>' +
        '<head><title>' + title + '</title></head>' +
        '<body>' +
        '<h1>' + title + '</h1>' +
        renderCommentsList(comments) +
        renderForm() +
        '</body></html>';
}

http.createServer(function (request, response) {
    var urlParts = url.parse(request.url);
    console.log(urlParts);
    if (urlParts.pathname == '/') {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(renderPage('Comments', comments));
        response.end();
    }
    else if (urlParts.pathname == '/addComment') {
        var requestBody = '';
        request.on('data', function (data) {
            requestBody += data;
            if (requestBody.length > 1e7) {
                response.writeHead(413, 'Request Entity Too Large', { 'Content-Type': 'text/html' });
                response.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
            }
        });
        request.on('end', function () {
            var formData = qs.parse(requestBody);
            comments.push(formData);
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(renderPage('Comments', comments));
            response.end();
        });     
    }
}).listen(8080);