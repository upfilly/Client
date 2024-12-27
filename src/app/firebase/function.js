import { getMessaging, getToken, onMessage } from 'firebase/messaging';
//....
import { firebaseApp } from './firebase'
import { toast } from 'react-toastify';


export const requestForToken = async () => {

  let messaging = getMessaging(firebaseApp)

  return await getToken(messaging, { vapidKey: 'BOwK9E1ZDaiGlKDTGOMLnDJdwL1vdxARmePqtC14ebpoQL-GlEErQzkrG3Z7grB-BgyyfTIfkqLbyai5e9rIrR8' })
    .then((currentToken) => {
      if (currentToken) {
        localStorage.setItem('device_token', currentToken);

        // console.log('current token for client: ', currentToken);
      } else {
        // console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      // console.log('An error occurred while retrieving token. ', err);
    });
};


export const message = (history) => {

  let messaging = getMessaging(firebaseApp)
   // console.log(messaging,"messaging===")
  return onMessage(messaging, (payload) => {
    // console.log(payload,"messaging===12345")
    const notificationTitle = payload?.notification?.body;
    // let rout = payload?.data['gcm.notification.type'] == "proposal" ? '/proposallisting' : '/mycontract'
    toast.success(notificationTitle, { onClick: function () { history.push(rout) }, })
    document.getElementById('unreadnoti')?.click()
  })
};







