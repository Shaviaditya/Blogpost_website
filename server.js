const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res) =>{
    res.setHeader('Content-Type','text/html');
    let path = './views/'
    switch(req.url){
        case '/':
            path+='index.html';
            break;
        case '/about':
            path+='about.html';
            break;
        default:
            path+='error.html';
            break;
    }
    fs.readFile(path,(err,data)=>{
        if(err){
            console.log("Error");
            res.end();
        }
        else{
            res.write(data);
            res.end();
        }
    });
});

server.listen(8080,'localhost',() =>{
    console.log("LoggedIn to localhost:8080");
});