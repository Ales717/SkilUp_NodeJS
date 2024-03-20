const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const bcrypt = require('bcrypt')

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and passwoord are required' })
    }
    const founUser = usersDB.users.find(p => p.username === user)
    if (!founUser) {
        return res.sendStatus(401)
    }
    const match = await bcrypt.compare(pwd, founUser.password)
    if (match) {
        res.json({ 'success': `User ${user} is logged in`})
    } else{
        res.sendStatus(401)
    }
}

module.exports = {handleLogin}