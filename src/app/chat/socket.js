import { io } from "socket.io-client";

// const url = window.location.protocol
let SocketURL = "https://upfillychat.jcsoftwaresolution.in/"
let ConnectSocket = io('https://upfillychat.jcsoftwaresolution.in/');
// if (url != 'https:') {
//     SocketURL = "http://endpoint.jcsoftwaresolution.com:9013/"
//     ConnectSocket = io('http://endpoint.jcsoftwaresolution.com:9013/');
// }

ConnectSocket.connect();

export { SocketURL, ConnectSocket };