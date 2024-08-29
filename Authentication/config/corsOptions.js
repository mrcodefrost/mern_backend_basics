const whiteList = [
    'https://www.mysite.com',
    'http://127.0.0.1:4500',
    'http://localhost:3500'
]

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

module.exports = corsOptions