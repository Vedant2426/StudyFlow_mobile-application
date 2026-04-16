import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermissionsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

export async function scheduleClassNotification(subject: string, time: string, room: string, days: number[]) {
  try {
    // Parse time "09:00 AM"
    const timeRegex = /(\d+):(\d+)\s(.*)/;
    const match = time.match(timeRegex);
    if (!match) {
      console.warn('Invalid time format for notification:', time);
      return;
    }

    const [_unused, hoursStr, minutesStr, ampm] = match;
    let hours = parseInt(hoursStr, 10);
    let minutes = parseInt(minutesStr, 10);
    
    if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;

    // Subtract 10 minutes for the warning
    minutes = minutes - 10;
    if (minutes < 0) {
      minutes += 60;
      hours -= 1;
      if (hours < 0) hours = 23;
    }

    const scheduledNotifications = [];
    for (const day of days) {
      try {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Class starts soon! 📚',
            body: `${subject} will begin in 10 minutes at ${room}.`,
            sound: true,
          },
          trigger: {
            weekday: day,
            hour: hours,
            minute: minutes,
            repeats: true,
          } as any,
        });
        scheduledNotifications.push(notificationId);
      } catch (error) {
        console.error(`Failed to schedule notification for ${subject} on day ${day}:`, error);
      }
    }
    
    console.log(`Successfully scheduled ${scheduledNotifications.length} notifications for ${subject}`);
    return scheduledNotifications;
  } catch (error) {
    console.error('Error in scheduleClassNotification:', error);
    throw error;
  }
}
