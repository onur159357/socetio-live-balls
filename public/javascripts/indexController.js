const connectionOption = {
    reconnectionAttempts : 3, // 3 defa bağlanmayı densin
    reconnectionDelay : 600 // 600 milisaniyede bir bağlanmayı densin

}
let userStatusTag = document.querySelectorAll('.list-group');
let ballContent = document.querySelectorAll('.ball-content');
let users;
let container = document.querySelector("#myController");
let theThing;
let socketContent;

//soket bağlantısını sağlayan function
let indexFactory = (userName) => {
    connectSocket('http://192.168.2.51:3000/', connectionOption)
        .then((socket) => {
            socketContent = socket;
            //init() function u içerisinden gelen user name i server a yolladık
            socket.emit('newUser', { userName });

            //server dan gelen userData objesini aldık ve index.hbs ye yazdırdık.
            socket.on('newUser', (data) => {
                users[data.id] = data;
                userStatusTag[0].insertAdjacentHTML('beforeend', `<li class="list-group-item">[SERVER] <b> ${data.userName} </b> Katıldı</li> `);

                ballUserHTML(users).then((data) => {
                    ballContent[0].innerHTML = data;
                    return data;

                }).then(() => {
                    theThing = document.getElementById(`${socket.id}`);
                    container.addEventListener("click", getClickPosition, false);

                });
                
            });

            //Çıkış yapan kullanıcı ile ilgili bilgileri servardan alıyoruz.
            socket.on('disUser', (data) => {
                userStatusTag[0].insertAdjacentHTML('beforeend', `<li class="list-group-item">[SERVER] <b> ${data.userName} </b>Ayrıldı</li>`);

                delete users[data.id];  
                let userBall = document.getElementById(`${data.id}`);
                userBall.remove(userBall);

            });

            //Kullanıcı giriş yaptığında servardan zaten var olan kullanıcıların bilgilerini alıyoruz.
            socket.on('initPlayer', (data) => { 
                users = data;
                ballUserHTML(users).then((data) => {
                    ballContent[0].innerHTML = data;
                    return data;

                }).then(() => {
                    theThing = document.getElementById(`${socket.id}`);
                    container.addEventListener("click", getClickPosition, false);

                });
                
            });

            //Servardan gelen animasyon kodlarını tüm kullanıcılar için alıyoruz
            socket.on('animate', (data) => {
                users[data.socketId].position.x = data.x;
                users[data.socketId].position.y = data.y;

                let userBallId = document.getElementById(data.socketId);
                    userBallId.style.top = data.y;
                    userBallId.style.left = data.x;
            })
            
            //mesajı alıyoruz
            let message = () => {
                let messageBox = document.getElementById('message-box').value;
                document.getElementById('message-box').value = '';
                userStatusTag[0].insertAdjacentHTML('beforeend', `<li class="list-group-item"> <b>${userName}</b> ${messageBox}</li> `);
                //Scrollu aşağı kaydırıyoruz
                let messageArea = document.querySelectorAll('.message-area')[0];
                messageArea.scrollTop = messageArea.scrollHeight;
            }
            let messageEnter = (event) => {
                event.preventDefault();
                if (event.keyCode === 13) {
                    message();
                }
            }
            
            let messageBtn = document.getElementById('message-btn'); 
            let messageBox = document.getElementById('message-box'); 
            messageBtn.addEventListener('click', message, false);
            messageBox.addEventListener("keyup", messageEnter, false);
            
        }).catch((err) => {
            console.log(err);
            return err;
                                    
        })

}

//user name girildiği zaman çalışacak function
const init = () => {
    const userName = prompt('please enter user name');
    //user name girildiyse socket bağlantısını gerçekleştiriyoruz
    if(userName)
        indexFactory(userName)
    else 
        return false;
  
};

let myControler = document.getElementById("myController");

if(myControler !== null)
    init();
else
    console.log('myControler yok');


//HTML BALL
let ballUserHTML = (data) => {
    return new Promise((resolve, reject) => {
        htmlContent = new String();
        for(key in data) {
            htmlContent +=  `
                <div class="ball-user ${data[key].color}" id="${data[key].id}" style = 'left: ${data[key].position.x}px; top:${data[key].position.y}px'>
                    <div class="ball-msg">message</div>
                    <div class="ball-user-name"> ${data[key].userName} </div>
                </div>`;

        }

        resolve(htmlContent);

    })
    
}

//Animasyon işlemleri
const socketAnimate = (x, y) => {
    socketContent.emit('animate', { x, y });

}

function getClickPosition(e) {
    let parentPosition = getPosition(e.currentTarget);
    let xPosition = e.clientX - parentPosition.x - (theThing.clientWidth / 2);
    let yPosition = e.clientY - parentPosition.y - (theThing.clientHeight / 2);
    
    theThing.style.left = xPosition + "px";
    theThing.style.top = yPosition + "px";

    users[theThing.id].position.x = xPosition;
    users[theThing.id].position.y = yPosition;
    
    socketAnimate(xPosition, yPosition);

}

//Bir elemanın tam konumunu elde etmek için yardımcı fonksiyon
function getPosition(el) {
    let xPos = 0;
    let yPos = 0;
    
    while (el) {
        if (el.tagName == "BODY") {
            // gövde / pencere / belge ve sayfa kaydırma ile tarayıcı sorunları ile başa çıkmak
            let xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            let yScroll = el.scrollTop || document.documentElement.scrollTop;
        
            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);

        } else {
            // diğer tüm BODY olmayan öğeler için
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);

        }
    
        el = el.offsetParent;
    }
    return {
        x: xPos,
        y: yPos

    };
}