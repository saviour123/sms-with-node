'use strict';

const express = require('express');
const Nexmo = require('nexmo');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

/**
 * start the little server
 */
const server = app.listen(4000, function(err) {
    if (err) {
        throw err;
    } else {
        console.log(`server is listening on 4000`)
    }
});

const nexmo = new Nexmo({
    apiKey: '49a99cce',
    apiSecret: '2b9dbe21237f35f6',
}, { debug: true });

const io = socketio(server);
io.on('connection', (socket) => {
    console.log('Connected');
    socket.on('disconnect', () => {
        console.log('Disconnected');
    });
});



// serve file in the public directory
app.set('views', __dirname + '/../views');
console.log(__dirname);
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// render an index view..
app.get('/', (req, res) => {
    res.render('index');
});


app.post('/', (req, res) => {
    res.send(req.body);
    console.log(req.body); //experimental
    let toNumber = req.body.number;
    let text = req.body.text;
    nexmo.message.sendSms(
        233543486731, toNumber, text, { type: 'unicode' },
        (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                console.dir(responseData);
                // socket io
            }
        }
    );
});