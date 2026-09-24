const VAPID_PUBLIC_KEY = "BD-TXtDTyduyeFXQk4SryD5iZwVniaoO7_YpS6E_v_mmgEzAMHrjSCnTGNiWcZxPx1cqft_BxkyaM-UbhBchZ-w";

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeToNotifications() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker not supported');
  }

  if (!('PushManager' in window)) {
    throw new Error('Push Manager not supported');
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered');

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe on server');
    }

    return true;
  } catch (error) {
    console.error('Push subscription error:', error);
    throw error;
  }
}
