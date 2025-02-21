const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = process.env.PORT || 2121
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'overtime'

MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
        
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/',(request, response)=>{
    //Acess overtime collection, retrieve all documents, sort by hours descending, then convert
    //into an array of JS Objects.
    db.collection('overtime').find().sort({hours: -1}).toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
}) 
app.post('/addEmployee', (request, response) => {
    db.collection('overtime').insertOne({name: request.body.name,
    hours: request.body.hours, startDate: request.body.startDate, 
    shift: request.body.shift})
    .then(result => {
        console.log('Employee Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})
app.delete('/deleteEmployee', (request, response) => {
    db.collection('overtime').deleteOne({name: request.body.currName,
        hours: request.body.currHours, startDate: request.body.currStartDate, 
        shift: request.body.currShift})
    .then(result => {
        console.log('Employee Deleted')
        response.json('Employee Deleted')
    })
    .catch(error => console.error(error))

}) 

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})