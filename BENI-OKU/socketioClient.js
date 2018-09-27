// html alanına önce <script src="http://localhost:3000/socket.io/socket.io.js"></script> i ekliyoruz

//yukarıda tanımladığımız kütüphanede io.connect özelliği mevcut
const socket = io.connect('http://localhost:3000/'); 
//sayfa her yenilendiğinde socketioServer.js içerisindeki aşağıdaki function tetiklenir
/*
  io.sockets.on('connection', (socket) => {
    console.log('kullanıcı bağlandı');
})
*/

//===========================================================================================//

//CLINTDAN SUNUCUYA & SUNUCUDAN CLIENT E MESAJ YOLLAMA =============

//soccet.emit('yolla') methodu msj gönderir.
//soccet.on('yolla') methodu karşılar.

//CLINET Dan SUNUCUYA 
socket.emit('clint den sunucuya yolla', {name : 'onur', surName : 'Yilmaz'});
    //ilk parametredeki string alan iki tarafın birbirini yakaladığı alandır.('clint den sunucuya yolla').
    //emit methodundaki ikinci parametredeki objet karşı tarafa data yollamak için kullanılır.{name : 'onur', surName : 'Yilmaz'}.

//SUNUCU Dan GELEN
socket.on('sunucudan clint a yolla', (data) => {
    //ilk parametredeki string alan iki tarafın birbirini yakaladığı alandır.('clint den sunucuya yolla').
    //on methodundaki ikinci parametredeki callback function gelen data yı temsil eder.
    console.log('karşıladım ve cevapladım');
    console.log(data);
});

//TÜM KULLANICILARA YOLLAMA broadcast.emit
socket.emit('once sunucuya data yolla', {name : 'onur'}); // Sunucuya bilgiyi yolladık

socket.on('clint dan sunucuya sunucudan client a geri', (data) =>  { // sunucudan geri gelen bilgiyi tüm kullanıcılara attık
    console.log(data.name);
})

//NAMESPACE OLUŞTURMA
const socketMyNameSpace = io.connect('http://localhost:3000/my-namespace');
//sayfa her yenilendiğinde socketioServer.js içerisindeki aşağıdaki function tetiklenir
/*
    nsp.on('connection', (socket) => {
        console.log('my-namespace e bağlandın');
    })
*/

//ROOM AÇMA
const socketRoom = io.connect('http://localhost:3000/my-namespace');
socketRoom.emit('joinRoom', {roomName : 'oda1'});
socketRoom.on('odaya msj yolla', ()=> {
    console.log('odaya bir girdi');
})

//ROOM ÇIKIŞ
socketRoom.emit('odadan cik', {roomName : 'oda1'});

socketRoom.on('cikis yaptiktan sonra', (data) => {
    console.log(`Odada ${data.count} kişi kaldı`)
})

//CLINET TARAFLI ÖZELLEŞTİRMELER
const socket = io.connect('http://localhost:3000/', {
    reconnectionAttempts : 2, // Sayfaya ilk bağlanma girişiminden sonra 2 kez daha bağlanmaya çalışır.
    reconnectionDelay : 3000, //Sayfaya 3 saniyede bir bağlanmayı deneyecek
    reconnection : false, // false yaparsak ilk girişiminden sonra tekrar bağlanmayı denemeyecek.
}); 
//reconnect = Yeniden bağlanmanın başarılı olduğu durum.
//reconnect_attempt = yeniden bağlanmaya çalışırken yazar
//reconnect_error = yeniden bağlanma başarısız olduğunda yazar.
socket.on('reconnect', () => {
    console.log('yeniden bağlanma başarılı')
})
socket.on('reconnect_attempt', () => {
    console.log('yeniden bağlanma çalışıyor')
})
socket.on('reconnect_error', () => {
    console.log('Yeniden bağlanma başarısız');
})