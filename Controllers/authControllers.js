const users = require('../models/users');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('../models/users');
//Handle_Errors
const errorhandles = (err)=>{
    console.log(err.message,err.code);
    let error = {username:'',email:'',password:''};
    //LoginErrors
    if(err.message==='Incorrect Details' || err.message==='Incorrect Password'){
        error.username = 'Incorrect Details'
        return error;
    }
    //Duplication
    if(err.code===11000){
        error.username = 'This username already exist';
        return error;
    }
    //Validation
    else if(err.message.includes('user validation failed')){
        (Object.values(err.errors)).forEach(({properties}) =>{
            error[properties.path] = properties.message;
        });
    }
    else{
        error.username = 'Incorrect Details'
        return error
    }
    return error;
}
//Handle Tokens
const maxAge = 3*24*3600;
const createtokens = (id)=>{
    return jwt.sign({id},'secretlogin',{
        expiresIn: maxAge
    })
}
module.exports.signup_get = (req,res)=>{
    res.render('signup');
}
module.exports.signup_post = async (req,res)=>{
    const {username,email,password} = req.body;
    try{
        const u1 = await users.create({username,email,password});
        const token = createtokens(u1._id)
        res.cookie('NewUser',token,{httpOnly: true, maxAge:maxAge*1000})
        res.status(201).json({u1: u1._id})
    }
    catch(err){
        const errors = errorhandles(err)
        res.status(400).json({errors});
    }
}
module.exports.login_get = (req,res)=>{
    res.render('login');
}
module.exports.login_post = async (req,res)=>{
    const {username,email,password} = req.body
    try {
        const user = await User.login(username,email,password)
        const token = createtokens(user._id)
        {
            res.cookie('LoggedUser',token,{httpOnly: true})
            res.status(201).json({user: user})
        }
    } 
    catch (err) {
        const errors = errorhandles(err)
        res.status(400).json({errors})
    }
}
module.exports.logout_get = (req,res)=>{
    res.cookie('LoggedUser','',{maxAge: 1});
    res.cookie('NewUser','',{maxAge: 1});
    res.redirect('/')
}