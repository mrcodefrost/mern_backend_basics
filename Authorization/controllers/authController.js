const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
require('dotenv').config()
const fsPromises = require('fs').promises
const path = require('path')

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body

    if (!user || !pwd) {
        return res.status(400).json({
            'message': 'Username and password are required'
        })
    }

    // check is usersname exists in DB
    const foundUser = usersDB.users.find(person => person.username === user)

    if (!foundUser) {
        return res.sendStatus(401)
    }

    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password)

    if (match) {
        const roles = Object.values(foundUser.roles)
        // SHORT TERM TOKEN - ACCESS TOKEN
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles":roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '2000s' }
        )


        // LONG TERM TOKEN - REFRESH TOKEN
        // No point of sending roles in refreshToken
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )


        // Saving refresh token with the current user
        // this allows to invalidate the refresh token if user logs out before token expiry
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username)

        const currentUser = { ...foundUser, refreshToken }

        usersDB.setUsers([...otherUsers, currentUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        )

        // access token should only be stored in memory on the front end (RAM)
        // storing in local DB is not secure, storing in cookies is not either 

        // sending the token in a cookie but with HTTP only format will make it inaccessible to JS - hence secure

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })
        res.json({ accessToken })

    } else {
        res.status(401).json({
            'message': 'Password is incorrect'
        });
    }
}

module.exports = { handleLogin }