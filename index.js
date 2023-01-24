const express = require('express')
const app = express()
const cors = require('cors')
require('./db/config.js')
const User = require('./db/User.js')
const Notes = require('./db/Notes.js')
require('dotenv').config()


app.use(express.json())
app.use(cors())
const PORT = process.env.PORT || 4000

app.post('/register',async (req, res)=>{
    try{
        let user = new User(req.body);
        if(user){
            let result = await user.save();
            console.log(result)
            res.send({result,message:"Account Creating..."}) 
        }
        else{
            res.status(404).send({message: "Error"})
        }
          
    }catch(err){
        res.status(404).send({message: "Error"})
    }
   
})

app.post('/login',async (req, res)=>{
    try{
        console.log(req.body)
        if(req.body.email && req.body.password){
            let user = await User.findOne(req.body).catch(err => {throw err})
            if(user){
                res.send({user,message:"Login waiting..."})
            }
            else{
                res.send({message:"something went wrong"})
            }
        }
        else{
            res.send({message:"No user fount"})
        }
    }catch(err){
        res.status(404).send({result: "Error"})
    }
   
})


app.post('/add-notes',async (req,res) => {
    let notes = await Notes(req.body)
    let result = await notes.save()
    res.send(result)
})

app.get('/notes/:id/:filter',async (req,res) => {
    let id = req.params.id;
    let filter = req.params.filter;
    // let search = req.params.search;
    console.log(filter)
    let notes;
    if(filter === 'all'){
        notes = await Notes.find({userId:id});
    }else{
        notes = await Notes.find({userId:id, tag:filter});
    }
    
    if(notes.length > 0)
        res.send(notes);
    else
        res.send({result:"No results Found"})
})

app.delete('/delete/:id', async (req, res) => {
    let id = req.params.id
    let result = await Notes.deleteOne({_id:id});
    // console.log(notes)
    res.send({result})
})

//update
app.put('/update/:id', async (req, res) => {
    let result = await Notes.updateOne(
        {_id:req.params.id},
        {
            $set:req.body
        }
        )
    res.send(result)

})

app.get('/count/:id', async (req, res) => {
    let id = req.params.id
    let all = await Notes.find({userId: id})
    let Video = await Notes.find({userId: id,tag: 'Video'})
    let Wishlist = await Notes.find({userId: id,tag: 'Wishlist'})
    let Assignment = await Notes.find({userId: id,tag: 'Assignment'})
    let Projects = await Notes.find({userId: id,tag: 'Project'})
    let Work = await Notes.find({userId: id,tag: 'Work'})
    let Study = await Notes.find({userId: id,tag: 'Study'})
    all = all.length
    Video = Video.length
    Wishlist = Wishlist.length
    Assignment = Assignment.length
    Projects = Projects.length
    Work = Work.length
    Study = Study.length

    console.log({all,Video,Wishlist,Assignment,Projects,Work,Study})
    res.send({all,Video,Wishlist,Assignment,Projects,Work,Study})
})


app.listen(PORT);