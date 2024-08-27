const express = require('express')
const app = express()
const path = require('path');
const PORT = process.env.PORT || 3500;


// ---- This is the normal way to create responses

// app.get('/', (req, res) => {

//     // res.send('Hey from server')
//     // res.sendFile('./views/index.html', {root: __dirname})
//     res.sendFile(path.join(__dirname, 'views', 'index.html'))

// })

// app.get('/new-page.html', (req, res) => {

//     // res.send('Hey from server')
//     // res.sendFile('./views/index.html', {root: __dirname})
//     res.sendFile(path.join(__dirname, 'views', 'new-page.html'))

// })

// ---- The dynamic way to create responses using regex

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
},  (req, res) => {
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

app.get('/chain(.html)?', [one,two,three])

// since express works like a waterfall, the last statement
// would serve as a catch all / default page
// sending 404 page not found will still give status code
// as 200 since the file '404' was found, thus passing
// a status code is required
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));