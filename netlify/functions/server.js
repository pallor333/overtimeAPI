const express = require('express')
const serverless = require('serverless-http') //Wrap Express app for serverless deployment
const MongoClient = require('mongodb').MongoClient
const PORT = 3000 //Netlify will specify the PORT
require('dotenv').config()

const app = express()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'overtime';

MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to ${dbName} Database`);
        db = client.db(dbName);

        // Middleware
        app.set('views', './public/views');
        app.use(express.static('public'));
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
    
        // Routes
        //const router = express.Router()

        app.get('/', (request, response) => {
            //Access overtime collection, retrieve all documents, sort by hours descending, then convert
            //into an array of JS Objects.
            db.collection('overtime').find().sort({ hours: -1 }).toArray()
                .then(data => {
                    response.render('index.ejs', { info: data });
                })
                .catch(error => {
                    console.error(error);
                    response.status(500).send('Error retrieving data');
                });
        });

        app.post('/addEmployee', (request, response) => {
            db.collection('overtime').insertOne({
                name: request.body.name,
                hours: request.body.hours,
                startDate: request.body.startDate,
                shift: request.body.shift
            })
            .then(result => {
                console.log('Employee Added');
                response.redirect('/');
            })
            .catch(error => {
                console.error(error);
                response.status(500).send('Error adding employee');
            });
        });

        app.delete('/deleteEmployee', (request, response) => {
            db.collection('overtime').deleteOne({
                name: request.body.currName,
                hours: request.body.currHours,
                startDate: request.body.currStartDate,
                shift: request.body.currShift
            })
                .then(result => {
                    console.log('Employee Deleted');
                    response.json('Employee Deleted');
                })
                .catch(error => {
                    console.error(error);
                    response.status(500).send('Error deleting employee');
                });
        });

    //app.use('/.netlify/functions/server', router);

    // Export express app as Netlify function
    module.exports.handler = serverless(app);
    })
    .catch(error => {
        console.error('Failed to connect to MongoDB:', error);
    });


//Serverless function. Netlify handles function invocation
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})