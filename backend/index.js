const express = require('express')
const cors = require('cors')

const app = express()

//config JSON response
app.use(express.json())

// Solve CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//public folders for images
app.use(express.static('public'))

//Routes
const userRoutes = require('./routes/userRoutes')
const petRoutes = require('./routes/petRoutes')

app.use('/users', userRoutes)
app.use('/pets', petRoutes)


app.listen(5000)