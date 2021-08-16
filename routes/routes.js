const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const cookieParser = require('cookie-parser')
const {reqauth,checkuser} = require('../middlewares/auth');
router.use(express.static('public'));
router.use(express.urlencoded({extended: true}));
router.use(cookieParser());
router.get('/',(req,res)=>{
    res.redirect('/blogs');
});
router.get('/blogs/create',reqauth,checkuser,(req,res)=>{
    res.render('create',{title: 'Creative'});
});


router.get('/about',(req,res)=>{
    res.render('about',{title: 'About'});
});


router.get('/blogs/:id',reqauth,(req,res)=>{
    const id = req.params.id;
    Blog.findById(id)
        .then((result)=>{
            res.render('details',{blog: result,title:'Blog Details'})
        })
        .catch((err)=>{
            console.log(err);
        })
})

router.delete('/blogs/:id',reqauth,checkuser,(req,res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect:'/blogs'})
    })
    .catch((err)=>{
        console.log(err)
    });
});


router.get('/blogs',(req,res)=>{
    Blog.find().sort({createdAt:-1})
    .then((result)=>{
        res.render('index',{title:'All-blogs',blogs:result})
    })
    .catch((err)=>{
        console.log(err);
    })
});


router.post('/blogs',reqauth,(req,res)=>{
    const blog = new Blog(req.body);
    blog.save()
    .then((result)=>{
        res.redirect('/blogs');
    })
    .catch((err)=>{
        console.log(err);
    })
});
/*
router.use((req,res)=>{
    res.status(404).render('404',{title: '404 error!'});
});
*/

module.exports = router;