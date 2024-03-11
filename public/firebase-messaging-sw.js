importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCVNUxNAOtZVdiT44i9uxzdPwJ7fqGZ7so",
  authDomain: "upfilly-3e4d5.firebaseapp.com",
  projectId: "upfilly-3e4d5",
  storageBucket: "upfilly-3e4d5.appspot.com",
  messagingSenderId: "817638365394",
  appId: "1:817638365394:web:742834d096c4c6703eb50b",
  measurementId: "G-39PLER8V73"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();