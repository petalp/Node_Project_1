import express from 'express';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js'
import bcrypt from 'bcryptjs';


const router = express.Router();

router.post('/register', (req, res)=>{
    const {username, password} = req.body;
    
    // encrypt the password
    const hashPassword = bcrypt.hashSync(password, 8);

    try{
        const insertUser = db.prepare(`INSERT INTO user (username, password)
            VALUES(?, ?)`);
        
        // not that we have a user, I want to add their first todo for them
        const result = insertUser.run(username, hashPassword);
        const defualtTodo = `Hello :) Add your first todo`;
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task)
            VALUES(?, ?)`);
        insertTodo.run(result.lastInsertRowid, defualtTodo);

        // create a token
        const token = jwt.sign({id:result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn:'24h'});
        res.json({token});
    }catch(err){
        console.log(err.message);
        res.sendStatus(503);
    }
})

router.post('/login', (req, res)=>{
const {username, password} = req.body;
try{
    const getUser = db.prepare('SELECT * FROM user WHERE username = ?');
    const user = getUser.get(username);
    
    //if we cannot find a user associated with that username, return out from the user
    if(!user){return res.status(404).send({message:"User not found"})};

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    // if the password does not match, return out of the function
    if(!passwordIsValid){return res.status(401).send({message:"Invalid password"})};
    console.log(user);
    // then we have successful authentication
    const token = jwt.sign({id :user.id}, process.env.JWT_SECRET, {expiresIn:'24h'});
    res.json({token})
}catch(err){
    console.log(err);
    res.sendStatus(503);
}
})

export default router;