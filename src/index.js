const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const studentArray = require('./InitialData')
let currentId = studentArray.length
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

app.get('/api/student', (req,res)=>{
    res.json(studentArray)
})

app.get('/api/student/:id', (req,res)=>{
    let id = req.params.id
    if(!isNaN(id)){
        id = parseInt(id)
        let student = studentArray.find((st)=>{
            return st.id === id
        })
        if(student){
            res.json(student)
        }else{
            res.sendStatus(404)
        }
    }else{
        return res.sendStatus(400) // bad request
    }
})

app.post('/api/student',(req,res)=>{
    let requiredKeys = Object.keys(req.body)
    if(requiredKeys.includes('name') && requiredKeys.includes('currentClass') && requiredKeys.includes('division')){
        if(!isNaN(req.body.currentClass)){
            let name = req.body.name
            let currentClass = parseInt(req.body.currentClass)
            let division = req.body.division
            currentId++
            studentArray.push({
                id:currentId,
                name,
                currentClass,
                division
            }) 
            res.json({
                id:currentId
            })
        }
    }else{
        res.sendStatus(400)
    }
})

app.put('/api/student/:id',(req,res)=>{
    if(!isNaN(req.params.id)){
        let id = parseInt(req.params.id)
        let student = studentArray.find((st)=>{
            return st.id === id
        })
        if(student){
            let updateObject = req.body
            if(Object.keys(updateObject).find((e)=>{return e === 'currentClass'})){
                if(!isNaN(updateObject.currentClass)){
                    updateObject.currentClass = parseInt(updateObject.currentClass)
                }else{
                    return res.sendStatus(400)
                }
            }
            let studentObjectNew = { ...student, ...updateObject}
            let index = studentArray.indexOf(student)
            studentArray.splice(index,1);
            studentArray.push(studentObjectNew)
            res.sendStatus(200)
            
        }else{
            res.sendStatus(400)
        }
    }else{
        res.sendStatus(400)
    }
})

app.delete('/api/student/:id', (req,res)=>{
    let id = req.params.id;
    if(!isNaN(id)){
        id = parseInt(id)
        let student = studentArray.find((st)=>{
            return st.id === id
        })
        if(student){
            let index = studentArray.indexOf(student)
            studentArray.splice(index,1)
            res.sendStatus(200)
        }else{
            res.sendStatus(404)
        }
    }else{
        res.sendStatus(400)
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   