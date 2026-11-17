import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { firebaseApp } from './firebase';
import { toast } from 'react-toastify';

export const requestForToken = async () => {
  try {
    if (typeof window === 'undefined') return;
    const supported = await isSupported().catch(() => false);
    if (!supported) return;

    const messaging = getMessaging(firebaseApp);
    if (!messaging) return;

    const currentToken = await getToken(messaging, { 
      vapidKey: 'BOwK9E1ZDaiGlKDTGOMLnDJdwL1vdxARmePqtC14ebpoQL-GlEErQzkrG3Z7grB-BgyyfTIfkqLbyai5e9rIrR8' 
    });
    if (currentToken) {
      localStorage.setItem('device_token', currentToken);
    }
  } catch (err) {
    console.warn('Firebase Messaging token request skipped:', err?.message || err);
  }
};

export const message = async (history) => {
  try {
    if (typeof window === 'undefined') return () => {};
    const supported = await isSupported().catch(() => false);
    if (!supported) return () => {};

    const messaging = getMessaging(firebaseApp);
    if (!messaging) return () => {};

    return onMessage(messaging, (payload) => {
      const notificationTitle = payload?.notification?.body;
      const title = payload?.notification?.title?.toLowerCase() || '';
      
      const notifType = payload?.data?.['gcm.notification.type'] || payload?.data?.type;
      if (
        notifType === 'chat' || 
        notifType === 'message' || 
        notifType === 'TEXT' || 
        payload?.data?.room_id ||
        title.includes('admin') ||
        title.includes('message') ||
        title.includes('chat')
      ) {
        return;
      }

      let rout = payload?.data?.['gcm.notification.type'] == "proposal" ? '/proposallisting' : '/mycontract';
      
      toast.success(notificationTitle, { onClick: function () { history?.push(rout); }, });
      document.getElementById('unreadnoti')?.click();
    });
  } catch (err) {
    console.warn('Firebase onMessage registration skipped:', err?.message || err);
    return () => {};
  }
};
