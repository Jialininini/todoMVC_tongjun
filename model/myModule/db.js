var mongoClient = require("mongodb").MongoClient;
//var config = require("../../config.js");
//数据库地址
var url = "mongodb://localhost:27017";
//数据库名称
var dbName = "web1804";
//连接数据库
function GetCon(callback){
    mongoClient.connect(url,function(err,client){
        callback(err,client);
    });
}
//增
//collection :保存数据的集合
//json :保存的数据
exports.add = function(collection,json,callback){
    GetCon(function(err,client){//获取链接
        if(err){
            console.log(err);
            callback(err,null);//返回错误信息
            return;
        }
        var db = client.db(dbName);//获取数据库名
        var coll = db.collection(collection);//获取集合名
        //插入数据
        coll.insert(json,function(err,result){
            callback(err,result);
            //关闭链接
            client.close();
        });
    })

};
//TODO 封装插入多条数据的方法
exports.addMany = function(collection,arr,callback){
    GetCon(function(err,client){//获取链接
        if(err){
            console.log(err);
            callback(err,null);//返回错误信息
            return;
        }
        var db = client.db(dbName);//获取数据库名
        var coll = db.collection(collection);//获取集合名
        //插入数据
        coll.insertMany(arr,function(err,result){
            callback(err,result);
            //关闭链接
            client.close();
        });
    })

};
//删
//collection :要删除哪个集合中的数据
//json :删除的条件
//删除多个文档
exports.del = function(collection,json,callback){
    GetCon(function(err,client){
        if (err){
            console.log(err);
            callback(err,null);
            return;
        }
        var db = client.db(dbName);
        var coll = db.collection(collection);
        //调用deleteMany 删除多条数据/文档
        coll.deleteMany(json,function(err,result){
            callback(err,result );
            client.close();
        });
    });
};
//TODO 添加一个参数,来决定删除多条数据或者一条数据



//改
//collection :要修改哪个集合中的数据
//json :修改的条件
//data: 修改的数据
exports.modify = function(collection,json,data,callback){
    GetCon(function(err,client){
        if(err){
            console.log(err);
            callback(err,null);//返回错误信息
            return;
        }
        var db = client.db(dbName);//获取数据库名
        var coll = db.collection(collection);//获取集合名
        coll.updateMany(json,{$set:data},function(err,result){
                callback(err,result);
                client.close();
        })
    })
};

//查
exports.findAll = function(collection,callback){
    GetCon(function(err,client){
        if(err){
            console.log(err);
            callback(err,null);//返回错误信息
            return;
        }
        var db = client.db(dbName);
        var coll = db.collection(collection);
        coll.find({}).toArray(function(err,docs){
            callback(err,docs);
            client.close();
        })
    })
};
//根据条件查找部分数据


//find
//根据条件查询
//collection 将要查询数据的集合名
//json 查询的条件
//option 可选参数 是否要分页或者排序
//若没有该参数 则默认显示第一页 每项显示5条数据 降序排列
//exports.find = function(collection,json,callback){
//    GetCon(function(err,client){
//        if(err){
//            console.log(err);
//            callback(err,null);//返回错误信息
//            return;
//        }
//        var db = client.db(dbName);
//        var coll = db.collection(collection);
//        coll.find(json).toArray(function(err,docs){
//            callback(err,docs);
//            client.close();
//        })
//    })
//};

exports.find = function(collection,json,option,callback){
    //if (arguments.length==4){
    //    //四个参数全有的时候 其他3个可以不考虑 option中有多种情况
    //    option.skip = option.skip || 0;
    //    option.limit = option.limit || 5;
    //    option.order = option.order || {};
    //}else if(arguments.length==3){
    //    callback = option;
    //    option = {skip:0,limit:5,order:{}};
    //}
    if(typeof option == "function"){
        callback = option;
        option = {skip:0,limit:5,order:{}};
    }else{
        option.skip = option.skip || 0;//如果option中没有skip则默认为0
        option.limit = option.limit || 5;
        option.order = option.order || {};
    }
    //callback(collection,json,option);
    //获取链接查询数据
    GetCon(function(err,client){
        if(err){
            console.log(err);
            callback(err,null);//返回错误信息
            return;
        }
        var db = client.db(dbName) ;
        var coll = db.collection(collection);//获取集合名
        //插入数据
        coll.find(json).skip(option.skip).limit(option.limit).sort(option.order).toArray(function(err,docs){
            callback(err,docs);
            client.close();
        })
    })
};







