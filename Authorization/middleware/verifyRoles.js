const verifyRoles = ({admin, editor, user}) => {
    return (req, res, next) => {
        if(!req?.roles) {
            return res.sendStatus(401)
        }

        const rolesArray = [
            admin,
            editor, 
            user
        ];
        console.log(rolesArray)
        console.log(req.roles)

        // const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true)
        // need to correct and make this function more general like dave did
        const result = req.roles.filter(user => rolesArray.includes(user));
        console.log(result, user, result.includes(user))
        if(!result.includes(admin) || !result.includes(editor)) {
            return res.sendStatus(401)
        }
        next()
    }
}


module.exports = verifyRoles