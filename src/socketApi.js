const socketio = require('socket.io'); //sayfaya socket io yu dahil ettik
const io = socketio(); //io değişkenine socket io nun contractor(müteahhit) ini atadık;
const socketApi = {};

socketApi.io = io;

//connection ile bağlantı durumunu kontorol ediyoruz.
io.on('connection', (socket) => {
    console.log('hey burdayım');
});

module.exports = socketApi;
//modül haline getirdik ve
//bin altında www içerisine ekliyoruz