const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient
var db;
var string;
let date=new Date().toString()
MongoClient.connect('mongodb://localhost:27017',{ useUnifiedTopology: true},(err,database)=>{
    if(err) return console.log(err);
    db=database.db('WestSide');
    app.listen(5000,()=>{
        console.log("Listening to port 5000");
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/',(req,res)=>{
    db.collection('clothes').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('homepage.ejs',{data:result})
    })
})
app.get('/create',(req,res)=>{
    res.render('add.ejs')
})

app.get('/updatestock',(req,res)=>{
    res.render('update.ejs')
})

app.get('/deleteproduct',(req,res)=>{
    res.render('delete.ejs')
})
app.post('/AddData',(req,res)=>{
    db.collection('clothes').save(req.body,(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})
app.post('/update',(req,res)=>{
    db.collection('clothes').find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i<result.length;i++){
            if(result[i].pid==req.body.id){
                string=parseInt(result[i].stock)
                break
            }
        }
    db.collection('clothes').findOneAndUpdate({pid:req.body.id},{
        $set: {stock: string+parseInt(req.body.stock)}},{sort: {_id:-1}}
        ,(err,result)=>{
            if(err) return console.log(err)
            console.log(req.body.id+' stock updated');
            res.redirect('/')
        })
    })
})

app.post('/delete',(req,res)=>{
    db.collection('clothes').findOneAndDelete({pid:req.body.id},(err,result)=>{
        if(err) return console.log(err)
    })
    
    res.redirect('/')
})