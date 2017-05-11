/**
 * get the form inputs
 */
var numberField = document.querySelector('input[name=number]');
var textField = document.querySelector('input[name=text]');
var button = document.querySelector('input[type=button]');
var msg = document.querySelector('.response');



/**
 * Transforms the form inputs
 */
function send() {
    var number = numberField.value.replace(/\D/g, ''); // Remove all non-numeric chars
    var text = textField.value;

    console.log("sending the inputs ");
    // fetch api to send the data 
    fetch('/', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ number: number, text: text })
        })
        .then(function(res) { console.log(res) })
        .catch(function(error) { console.log(error) });
}


textField.addEventListener('keyup', function(e) {
    if ((e.keyCode || e.charCode) === 13) send();
}, false); // when a user presses a Return key

button.addEventListener('click', send, false); // when a user click the "Send" button

var socket = io();
socket.on('smsStatus', function(data) {
    displayStatus('Message ID ' + data.id + ' successfully sent to ' + data.number);
});

Notification.requestPermission().then(function(status) {
    console.log(status);
});

function displayStatus(message) {
    var notification = new Notification('nexmo', {
        body: message,
        icon: 'images/icon.png'
    })
}