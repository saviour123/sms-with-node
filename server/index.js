'use strict';

const http = require('http');
const express = require('express');
const Nexmo = require('nexmo');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

/**
 * create the little server
 */
const server = http.createServer(app);
const io = require('socket.io').listen(server);

const nexmo = new Nexmo({
    apiKey: '49a99cce',
    apiSecret: '2b9dbe21237f35f6',
}, { debug: true });


/**
 *  serve file in the public directory
 */
app.set('views', __dirname + '/../views');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/**
 * socket.io additions
 */

io.on('connection', (socket) => {
    console.log('Connected');
    socket.on('disconnect', () => {
        console.log('Disconnected');
    });
});


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
                console.dir(responseData); //experimental
                let data = { id: responseData.messages[0]['message-id'], number: responseData.messages[0]['to'] };
                io.emit('smsStatus', data);
                console.log(data);
            }
        }
    );

    res.send(req.query);
    console.log
});


server.listen(process.env.PORT || 3000);
