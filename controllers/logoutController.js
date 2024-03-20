const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises
const path = require('path');

const handleLogout = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(204)
    }
    const refreshToken = cookies.jwt

    const foundUser = usersDB.users.find(p => p.refreshToken === refreshToken)
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSie: 'None', secure: true})
        return res.sendStatus(204)
    }
    const otherUsers = usersDB.users.filter(p => p.refreshToken !== foundUser.refreshToken)
    const currentUser = {...foundUser,refreshToken: ''}
    usersDB.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    )
    res.clearCookie('jwt', { httpOnly: true, sameSie: 'None', secure: true})
    res.sendStatus(204)
}

module.exports = { handleLogout }