const express = require('express')
const app = express()
const path = require('path');
const cors = require('cors')
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;


app.use(logger)

const whiteList = ['https://www.mysite.com', 'http://127.0.0.1:4500', 'http://localhost:3500']
const corsOptions = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin){ // during dev add !origin, allows undefined
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: false }))

app.use(express.json())

// serve static files (to apply css on load)
app.use(express.static(path.join(__dirname, '/public')))

// in case of subdir, we need to specify css for it
app.use('/subdir' ,express.static(path.join(__dirname, '/public')))

// Routes
// redirecting requests of root to root route
app.use('/', require('./routes/root'));

// this will redirect all requests for the subdir to the subdir route
app.use('/subdir', require('./routes/subdir'));

app.use('/employees', require('./routes/api/employees'));


// app.all v/s app.use
// app.use is used for middlewares
// app.all is used for routing, ideally app.all should be 
// used for 404 

// since express works like a waterfall, the last statement
// would serve as a catch all / default page
// sending 404 page not found will still give status code
// as 200 since the file '404' was found, thus passing
// a status code is required

app.all('*', (req,res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({error: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not found')
    }
})


app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));