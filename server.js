const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const path = require('path');
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.json())

MongoClient.connect('mongodb+srv://loremipsum:np62tQ.9fhiz2zi@cluster0.2aivq.mongodb.net/<dbname>?retryWrites=true&w=majority', { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')

        //posting to the database
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    console.log(result)
                })
                .catch(error => console.error(error))
        })

        //Getting Quotes back from the database
        // app.get('/', (req, res) => {
        //     db.collection('quotes').find().toArray()
        //         .then(results => {
        //             console.log(results)
        //         })
        //         .catch(error => console.error(error))
        //     // ..
        // })

        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
                .catch(/* ... */)
        })

        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { title: 'Front ENd Lead' },
                {
                    $set: {
                        title: req.body.title,
                        link: req.body.link
                    }
                },
                {
                    upsert: true
                }
            )
                .then(result => {
                    console.log(result)
                })
                .catch(error => console.error(error))
        })

        //handling delete
        app.delete('/quotes', (req, res) => {
            quotesCollection.remove(
                { name: req.body.name },
                options
            )
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No quote to delete')
                    }
                    res.json(`Deleted Darth Vadar's quote`)
                })
                .catch(error => console.error(error))
        })

    })
    .catch(error => console.error(error))

// app.use('/static', express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'))




// app.get('/', (req, res) => {
//     res.render(view, locals)
// })

app.listen(3000, function () {
    console.log('listening on 3000')
})
