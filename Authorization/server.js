const express = require('express')
const app = express()
const path = require('path');
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const credentials = require('./middleware/credentials')
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 3500;


app.use(logger)

// call this before CORS
// Handle options credendtials check 
// and fetches cookies credentials requirement
app.use(credentials);
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: false }))

app.use(express.json())

// serve static files (to apply css on load)
app.use(express.static(path.join(__dirname, '/public')))

// Middleware for cookies
app.use(cookieParser())

// Routes
// redirecting requests of root to root route
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT) // (Waterfall) - everything below this will require JWT
app.use('/employees', require('./routes/api/employees'));

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