import { io } from "socket.io-client";

// const url = window.location.protocol
let SocketURL = "https://chat.upfilly.com/"
let ConnectSocket = io('https://chat.upfilly.com/');
// if (url != 'https:') {
//     SocketURL = "http://endpoint.jcsoftwaresolution.com:9013/"
//     ConnectSocket = io('http://endpoint.jcsoftwaresolution.com:9013/');
// }

ConnectSocket.connect();

export { SocketURL, ConnectSocket };