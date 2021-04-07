
const handleSignin = (db, bcrypt) => (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }
    //---------------REMEMBER
    // when sending data from the frontEND and using JSON we need to parse it
    //in order to be able to use req.body we need body-parser
    db.select('email', 'hash').from('login').where('email', '=', email)
        .then(data => {
        // Load hash from your password DB.
        const isValid = bcrypt.compareSync(password, data[0].hash);
            if(isValid) {
                return db.select('*').from('users').where('email', '=', email)
                .then(user => {
                    res.json(user[0])
                }).catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrongy wrong')
            }
    }).catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
    handleSignin
}