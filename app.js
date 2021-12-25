const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({extended:true}))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/reservations', require('./routes/calendar.routes'))

if(process.env.NODE_ENV === 'production') {
    app.use('/',express.static)
}

const PORT  = config.get('port') || 5000;

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`App has been started at port ${PORT}`))
    } catch (error) {
        console.log('Server error', error.message);
        process.exit(1)
    }
}
start();
