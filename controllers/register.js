const handleRegister = (req, res, db, bcrypt) => {
    // we wanna grab whatever we're getting from req.body
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }//in order to end execution within a function we have to return
    const saltRounds = 2;
    const hash = bcrypt.hashSync(password, saltRounds);
    
   /*  bcrypt.compareSync(myPlaintextPassword, hash); // true
    bcrypt.compareSync(someOtherPlaintextPassword, hash); // false */
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        }).into('login').returning('email').then(loginEmail => {
            return trx('users').returning('*').insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            }).then(user => {
                res.json(user[0]); //database.users[database.users.length-1] - deprecated
        })
    })
    .then(trx.commit).catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register')) 
    //-----------security principle - dont give the client info ABOUT YOUR SYSTEM(ERR) JUST UNABLE TO JOIN
}

module.exports = {
    handleRegister: handleRegister
};