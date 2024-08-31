const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const jwt = require('jsonwebtoken')
require('dotenv').config()


const handleRefreshToken = (req, res) => {
    const cookies = req.cookies


    if (!cookies?.jwt) {
        return res.status(401).json({
            'message': 'Cookies dont exist'
        })
    }

    console.log(cookies.jwt)
    const refreshToken = cookies.jwt

    // check is usersname exists in DB
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)

    if (!foundUser) {
        return res.sendStatus(403) // forbidden
    }

    // evaluate JWT 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) {
                return res.sendStatus(403)
            }
            const roles = Object.values(foundUser.roles)
            const accessToken = jwt.sign(
                {
                    "UserInfo" : {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '2000s' }
            )

            res.json({ accessToken })
        }

    )   
}

module.exports = { handleRefreshToken }