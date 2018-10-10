var exp = require("express");
var db = require("./model/myModule");
var objectId = require("mongodb").ObjectID;
var app = exp();
app.listen(4000);

app.set("view engine","ejs");
app.use(exp.static("./public"));

app.get("/",function(req,res){
    res.render("index");
});

app.get("/load",function(req,res){
    db.findAll("undo",function(err,undo){//查找未完成的
        console.log(err);
        db.findAll("done",function(err,done){//查找已完成的
            console.log(err);
            res.send({undo:undo,done:done});
        });
    });
});

app.get("/tijiao",function(req,res){
   /*console.log(req.query);
    res.end()*/;
    var data = req.query.msg;//获取数据

    db.add("undo",req.query,function(err,result){
        console.log(err);
        //将数据库中所有undo集合的数据返回给页面
        db.findAll("undo",function(err,docs){
           console.log(err);
            res.send(docs);//返回docs
        });
    });
});

app.get("/done",function(req,res){
    var id = objectId(req.query.id);
    //根据传进来的id,删除undo集合中的数据,并将数据添加到done集合中
    //先查找,然后再删除
    db.find("undo",{_id:id},function(err,docs){
        console.log(err);
        var msgObj = docs[0];
        var msg = msgObj.msg;//获取数据中的msg属性的值
        //删除undo,添加到done中
        db.del("undo",{_id:id},function(err,result){
            console.log(err);
            db.add("done",{msg:msg},function(err,result){
                console.log(err);
                res.redirect("/");
            });
        });


    });
});

app.get("/del",function(req,res){
    var id = objectId(req.query.id);
    var col = req.query.col;
    db.del(col,{_id:id},function(err,result){
        console.log(err);
        res.redirect("/");
    })
});

app.get("/clear",function(req,res){
    db.del("done",{},function(err,result){
        console.log(err);
            res.redirect("/");
    });
})









