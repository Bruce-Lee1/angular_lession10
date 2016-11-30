var http = require('http');
var url = require('url');
var fs = require('fs');
var mime = require('mime');
var users = [
    {name:'张三',age:20,id:1,gender:'0'},
    {name:'李四',age:33,id:2,gender:'1'}
];
var querystring = require('querystring');
var server = http.createServer(function (req,res) {
    var urlObj = url.parse(req.url,true);
    var pathname = urlObj.pathname;
    if(pathname =='/'){
        res.setHeader('Content-Type','text/html;charset=utf8');
        fs.createReadStream('./index.html').pipe(res);
    }else if(/\/users(\/\d+)?/.test(pathname)){
        //正则的方式来匹配  /users/1   /user
        // 匹配是增删改查中的哪一个参数，通过请求的方法来判断
        var id = /\/users(\/\d+)?/.exec(pathname)[1];
        switch (req.method){
            case 'GET':
                if(id){ //查询单个
                    id = id.slice(1);
                }else{ //查询所有
                    res.end(JSON.stringify(users));
                }
                break;
            case 'PUT':

                break;
            case 'POST':

                break;
            case 'DELETE':
                if(id){
                    id = id.slice(1); //拿到对应的id号
                    users = users.filter(function (item) {
                        return item.id != id;
                    });
                    res.end(JSON.stringify({}));
                }
                break;
        }
    }else{
        fs.exists('.'+pathname,function (exists) {
            if(exists){
                res.setHeader('Content-Type',mime.lookup(pathname)+';charset=utf8');
                fs.createReadStream('.'+pathname).pipe(res);
            }else{
                res.statusCode = 404;
                res.end('');
            }
        });
    }
});
server.listen(3000);