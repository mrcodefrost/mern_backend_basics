const express = require('express')
const app = express()
const path = require('path');
const cors = require('cors')
const {logger} = require('./middleware/logEvents')
const PORT = process.env.PORT || 3500;

// Anything between requests and response are called Middlewares

// there are many middlewares - built in, third party and custom

// custom middleware logger 
// moved to logEvents.js, exported as 'logger'
// app.use((req, res, next) => {
//     logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
//     console.log(`${req.method} ${req.path}`)
//     next();
// })

app.use(logger)

// Cross Orign resource sharing - allowed
// whiteList will store the authorized domains that can connect to this backend
const whiteList = ['https://www.mysite.com', 'http://127.0.0.1:4500', 'http://localhost:3500']
const corsOptions = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin){ // during dev add !origin
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded data
// in other words, form data
// content-type: application/x-www-form-urlencoded

app.use(express.urlencoded({ extended: false }))

// like the http methods below, middlewares also follow a waterfall
// model in express and hence writing on top will apply the middleware
// to all the sucessive methods/middlewares

// built-in middleware for json
// to handle json submitted data
app.use(express.json())

// serve static files (to apply css on load)
app.use(express.static(path.join(__dirname, '/public')))

app.get('^/$|/index(.html)?', (req, res) => {

    res.sendFile(path.join(__dirname, 'views', 'index.html'))

})

app.get('/new-page(.html)?', (req, res) => {

    res.sendFile(path.join(__dirname, 'views', 'new-page.html'))

})

// Redirecting page to new page

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page,html');
})


// Route Handlers

app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html')
    next() // next allows to chain functions 
    // and call one after another
}, (req, res) => {
    res.send('Hello world !')
})


// chaining route handlers
const one = (req, res, next) => {
    console.log('one')
    next()
}
const two = (req, res, next) => {
    console.log('two')
    next()
}
const three = (req, res) => {
    console.log('three')
    res.send('Done')
}

app.get('/chain(.html)?', [one, two, three])

// since express works like a waterfall, the last statement
// would serve as a catch all / default page
// sending 404 page not found will still give status code
// as 200 since the file '404' was found, thus passing
// a status code is required
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
})

// custom error builder middleware
app.use((err,req,res, next) => {
    console.error(err.stack)
    res.status(500).send(err.message)
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));