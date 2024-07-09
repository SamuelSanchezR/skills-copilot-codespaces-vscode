// Create web server
const http = require('http');
const fs = require('fs');
const comments = require('./comments.json');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream('./index.html').pipe(res);
    } else if (req.url === '/comments' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(comments));
    } else if (req.url === '/comments' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const newComment = JSON.parse(body);
            comments.push(newComment);
            fs.writeFile('./comments.json', JSON.stringify(comments, null, 2), (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newComment));
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
// Run in terminal
// $ node comments.js
// Open browser and navigate to http://localhost:3000
// Open Postman and send a POST request to http://localhost:3000/comments with a JSON payload
// {
//     "name": "John Doe",
//     "comment": "Hello, World!"
// }