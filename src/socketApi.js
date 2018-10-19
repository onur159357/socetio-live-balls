const socketio = require('socket.io'); //sayfaya socket io yu dahil ettik
const io = socketio(); //io değişkenine socket io nun contractor(müteahhit) ini atadık;

const socketApi = {};
socketApi.io = io;

const users = {};

//Helper-randomColor
const randomColor = require('../helper/randomColor');

//connection ile bağlantı durumunu kontorol ediyoruz.
io.on('connection', (socket) => {
    //client den gelen user name i aldık
   socket.on('newUser', (data) => {
       //client den gelen username, socket.id ve position u düzenleyip users array ine atadık
       const defaultData = {
           id : socket.id,
           position : {
               x : 0,
               y : 0,
           },
           color : randomColor(), 
       }
       const userData = Object.assign(data, defaultData); // İki objeyi birleştirdik
       users[socket.id] = userData;

       //userData objesini kendisi hariç bütün kullanıcıları görebileceği şekilde client e yolladık
       socket.broadcast.emit('newUser', userData);

       //Kullanıcı giriş yaptığında diğer userlar ile ilgili bilgileri yolluyoruz
       socket.emit('initPlayer', users);

   })
   //Çıkış yapan user ı yakalamak için disconnect i kullanıyoruz.
   socket.on('disconnect', () => {
        //çıkış yapan kullanıcının tüm bilgilerini disUser ile client a yolladık.
        socket.broadcast.emit('disUser', users[socket.id]);

        //users objesinden çıkan kullanıcıyı siliyoruz
        delete users[socket.id];

   })
   //Animasyon işlemlerini halletme
   socket.on('animate', (data)=> {
       users[socket.id].position.x = data.x;
       users[socket.id].position.y = data.y;

       //Animasyonu tüm kullanıcılarda gönderiyoruz
       socket.broadcast.emit('animate', {
           socketId : socket.id,
           x : data.x,
           y : data.y,
       })

   })
   //Message işlemleri
   socket.on('newMessage', data => {
       socket.broadcast.emit('newMessage', data);
   })

});

module.exports = socketApi;
//modül haline getirdik ve
//bin altında www içerisine ekliyoruz

