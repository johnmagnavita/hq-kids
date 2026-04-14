// Notifications temporarily disabled for iOS build
// Will re-enable once Push Notifications certificate is configured

export async function registerForPushNotifications() {
  return null;
}

export async function sendLocalNotification(
  title: string,
  body: string
) {
  console.log(`[Notification] ${title}: ${body}`);
}
