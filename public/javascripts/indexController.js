// let controller = (scope) => {
//     const socket = io.connect('http://localhost:3000/'); 
// }

// document.getElementById("myController").addEventListener("load", controller());

const connectionOption = {
    reconnectionAttempts : 3,
    reconnectionDelay : 600

}

let indexFactory = () => {
    connectSocket('http://localhost:3000/', connectionOption)
        .then((data) => {
            console.log(data);
            return data;

        }).catch((err) => {
            console.log(err);
            return err;

        })

}

document.getElementById("myController").addEventListener("load", indexFactory());
