const usersDB = {
    users: require('../model/users.json'),
    setUsers : function (data) {this.users = data}
}

const bcrypt = require('bcrypt')

const handleLogin = async (req, res) => {
    const { user, pwd} = req.body

    if(!user || !pwd) {
        return res.status(400).json({
            'message': 'Username and password are required'
        })
    }

    // check is usersname exists in DB
    const foundUser = usersDB.users.find(person => person.username === user)

    if(!foundUser) {
        return res.sendStatus(401)
    }

    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password)

    if(match) {
        // in next ( this is where we create JWTs )
        res.json({ 'success': `User ${user} is logged in!`})
    } else {
        res.status(401).json({
            'message': 'Password is incorrect'
        });
    }
}

module.exports = {handleLogin}