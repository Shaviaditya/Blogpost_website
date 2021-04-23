const express = require('express');
const app = express();
const Blog = require('./models/blog');
const mongoose = require('mongoose');
const { render } = require('ejs');
const dBURL = 'mongodb+srv://Mongoose55:Wifi5757@clusternode.ydfmd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(dBURL,{useNewUrlParser: true, useUnifiedTopology: true})
 .then((result)=> app.listen(8080))
 .catch((err)=>console.log(err));
app.set('view engine','ejs');

app.use(express.static('public')); 
app.use(express.urlencoded({extended: true}));
app.get('/',(req,res)=>{
    res.redirect('/blogs');
});
app.get('/blogs/create',(req,res)=>{
    res.render('create',{title: 'Creative'});
});
app.get('/about',(req,res)=>{
    res.render('about',{title: 'About'});
});
app.get('/blogs/:id',(req,res)=>{
    const id = req.params.id;
    Blog.findById(id)
        .then((result)=>{
            res.render('details',{blog: result,title:'Blog Details'})
        })
        .catch((err)=>{
            console.log(err);
        })
})
app.delete('/blogs/:id',(req,res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect:'/blogs'})
    })
    .catch((err)=>{
        console.log(err)
    });
});
app.get('/blogs',(req,res)=>{
    Blog.find().sort({createdAt:-1})
    .then((result)=>{
        res.render('index',{title:'All-blogs',blogs:result})
    })
    .catch((err)=>{
        console.log(err);
    })
});
app.post('/blogs',(req,res)=>{
    const blog = new Blog(req.body);
    blog.save()
    .then((result)=>{
        res.redirect('/blogs');
    })
    .catch((err)=>{
        console.log(err);
    })
});
app.use((req,res)=>{
    res.status(404).render('404',{title: '404 error!'});
});



