import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

let initialized = false;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const initializeNotifications = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#38bdf8',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    const permissions = await Notifications.getPermissionsAsync();
    let finalStatus = permissions.status;

    if (finalStatus !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      finalStatus = requested.status;
    }

    initialized = finalStatus === 'granted';
    return initialized;
  } catch (error) {
    console.error('Failed to initialize notifications:', error);
    initialized = false;
    return false;
  }
};

export const sendLocalNotification = async (title: string, body: string, data?: Record<string, any>) => {
  try {
    if (!initialized) {
      const ready = await initializeNotifications();
      if (!ready) {
        return;
      }
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        badge: 1,
        data: data || {},
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Notification error:', error);
  }
};
