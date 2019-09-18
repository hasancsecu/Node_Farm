const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/template.js');
const slugify = require('slugify');

//////////////////////////////
//Files
//Blocking. synchronous way
/*
const textIn = fs.readFileSync('./txt/input.txt','utf-8');
console.log(textIn);
const fileOut =`This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', fileOut);
console.log("File written");

//Non-Blocking, asynchronous way

fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
    if(err){
        console.log('Error!');
    }
    console.log(data);
});
console.log('Will read file');
*/

//////////////////////////////
//SERVER
const tempOverview = fs.readFileSync(`./templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`./templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`./templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`./dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map(el => slugify(el.productName, {
    lower: true
}));
console.log(slugs);
const server = http.createServer((req, res) => {
    const {
        query,
        pathname
    } = url.parse(req.url, true);
    //console.log(query);

    //Overview Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    }

    //Product Page
    else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const product = dataObj[parseInt(query.id)];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    }
    //API Page    
    else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'Hello World'
        });
        res.end('<h1>Page Not Found!</h1>');
    }
});
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening from the server 8000');
});