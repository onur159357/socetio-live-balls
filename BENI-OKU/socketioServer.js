const http = require('http');
const socketio = require('socket.io');
const server = http.createServer((req,res) => {
    res.end('Test');
});

server.listen(3000);

const io = socketio.listen(server); //server a gelen her istekte aktif bir bağlantı oluşturulacak

//client bu sokete bağlandığında yapılacak işlem 
//connection == sockets.on un bir Event Emitter ıdır.(herhangi bir kullanıcı bağlandığı anda çalışır)
//(socket) = {} == bağlanmış olan client den gelen datayı temsil ediyor. Bağlımı değilmi vs.
io.sockets.on('connection', (socket) => {
    console.log('Kullanıcı Bağlandı');

    //Kullanıcı ile ilgili bilgiler artık socket parametresinde
    //disconnect parametresi ile ayrıldığını görebiliriz.
    socket.on('disconnect', () => {
        console.log('Kullanıcı Ayrıldı')
    });

    //CLINTDAN SUNUCUYA & SUNUCUDAN CLIENT E MESAJ YOLLAMA =============
    //soccet.emit('yolla') methodu msj gönderir.
    //soccet.on('yolla') methodu karşılar.
    

    //CLINET Dan SUNUCUYA
    socket.on('clint den sunucuya yolla', (data) => {
        //İlk parametredeki string alan iki tarafın birbirini yakaladığı alandır.('clint den sunucuya yolla').
        //on methodundaki ikinci parametredeki callback function gelen data yı temsil eder.

        console.log(data); // ===> {name : 'onur', surName : 'Yilmaz'}
        console.log('karşıladım Cvp verdim');
    })

    //SUNUCU Dan CLINT A
    socket.emit('sunucudan clint a yolla', {sunucu : 'yola'});
    //ilk parametredeki string alan iki tarafın birbirini yakaladığı alandır.('sunucudan clint a yolla').
    //emit methodundaki ikinci parametredeki objet karşı tarafa data yollamak için kullanılır.{sunucu : 'yola'}.


    //TÜM KULLANICILARA YOLLAMA broadcast.emit
    socket.on('once sunucuya data yolla', (data) => {
        //Client daki bağlantıyı yapan hariç tüm kullanıcılara yollar
        socket.broadcast.emit('clint dan sunucuya sunucudan client a geri', {name : data.name});
    });

})

//NAMESPACE OLUŞTURMA
const io = socketio.listen(server); //server a gelen her istekte aktif bir bağlantı oluşturulacak
const nsp = io.of('/my-namespace'); //Yeni bir namespace oluşturduk

nsp.on('connection', (socket) => {
    console.log('my-namespace e bağlandın');
    //nsp.emit işlemi ile /my-namespace altındaki tüm kullanıcılara broadcast eder.
})

//ROOM AÇMA
io.on('connection', (socket) => {
    socket.on('joinRoom', (data) => {
        //Herhangi bir odaya girmek yada yeni oda açmak için join kullanılıyor.
        socket.join(data.roomName, () => {
            //socket.to().emit() = İlgili roomdaki kişilere msj gidecek.
            //io.to().emit() = Kendisi dahil herkese msj gönderecekdir.
            //socket.leave('room name) = Odadan ayrılmak için kullanılır.

            //Bağlanılan odada kaç kişi olduğunu öğrenmek için aşağıdaki kodu kullanırız.
            let room = io.sockets.adapter.rooms[data.name].length;
            let count = count ? room.length : 0;

            socket.to(data.roomName).emit('odaya msj yolla', {count} );
            //io.to yapsaydık kendisi dahil herkese emit edilecekti;

            //Bağlı bulunduğu odaları listeleme
            const rooms = Object.keys(socket.rooms);
            console.log(rooms) // ==> ['bağlı olduğu id gelir', 'bağlı olduğu oda 1' ,  'bağlı olduğu oda 2', '...diye gider']
            
        });

        //SOCKET ID
        //socket.id methodu ile kullanıcının bağlı olduğu ıd yi alabiliriz.
        console.log(socket.id);

    });

    //ROOM ÇIKIŞ
    socket.on('odadan cik', (data) => {
        //Çıkış için leave methodunu kullanıyoruz ilk parametre çıkış yapacağı oda.
        socket.leave(data.name, () => {
            let room = io.sockets.adapter.rooms[data.name].length;
            let count = count ? room.length : 0;

            socket.to(data.name).emit('cikis yaptiktan sonra', {count});

        })
    })
})


