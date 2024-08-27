const http = require('http')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises


const logEvents = require('./logEvents')
const EventEmitter = require('events')

class Emitter extends EventEmitter { }

// initialize object 
const myEmitter = new Emitter()
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName))

const PORT = process.env.PORT || 3500

//    // direct but redundant method
// const server = http.createServer((req, res) => {
//     console.log(req.url, req.method)

//     let filePath;
//     if(req.url === '/' || req.url === 'index.html'){
//         res.statusCode = 200
//         // because we will be serving an html page
//         res.setHeader('Content-Type', 'text/html');
//         filePath = path.join(__dirname, 'views', 'index.html')

//         fs.readFile(filePath, 'utf-8', (err,data) => {
//             // sending that file data to be served ( html file)
//             res.end(data);

//         })
//     }

// })

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') 
            ? 'utf-8'
            : ''
        )
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200, 
            { 'Content-Type': contentType })
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        )

    } catch (error) {
        console.error(error)
        myEmitter.emit('log', `${error.name}:\t${error.message}`, 'errorLog.txt')
        response.statusCode = 500
        response.end();
    }
}



const server = http.createServer((req, res) => {
    console.log(req.url, req.method)
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt')

    const extension = path.extname(req.url)

    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css'
            break
        case '.js':
            contentType = 'text/javascript'
            break;
        case '.json':
            contentType = 'application/json'
            break
        case '.jpg':
            contentType = 'image/jpeg'
            break
        case '.png':
            contentType = 'image/png'
            break
        case '.txt':
            contentType = 'text/plain'
            break;
        default:
            contentType = 'text/html'
    }

    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url)

    // Makes the .html ext not required in the browser URL
    if (!extension && req.url.slice(-1) !== '/') { filePath += '.html' }

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        // serve the file
        serveFile(filePath, contentType, res)
    } else {

        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/views/new-page.html' })
                res.end()
                break;
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' })
                res.end()
                break;

            default:
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res)

        }




        console.log(path.parse);
    }


})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))