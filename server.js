const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const { logger }= require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')

const PORT = process.env.PORT || 3000;

//custom middleware
app.use(logger)

const whitelist = ['https://www.yoursite.com/', 'http://127.0.0.1:5500', 'http://localhost:3000']
const corsOptions = {
    origin: (origin, callback) =>{
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

//built-in middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))

app.get('^/$|index(.html)?', (req, res) => {
    //res.sendFile('./views/index.html', { root: __dirname})
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})
app.get('/new-page.(html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})
app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html')
})
app.get('/hello(.html)?', (req, res, next) => {
    console.log("attempted to load hello.html")
    next()
}, (req, res) => {
    res.send('Hello world!')
})

app.all('/*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }else if (req.accepts('json')) {
        res.json({ error: "404 not Found"})
    }else{
        res.type('txt').send("404 not Found")
    }
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
