import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppState } from 'react-native';
import { useEffect } from 'react';
import { connectSocket } from '@/services/socket';
import { initializeNotifications } from '@/services/notifications';

export default function RootLayout() {
  useEffect(() => {
    initializeNotifications();
    connectSocket();

    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        initializeNotifications();
        connectSocket();
      }
    });

    return () => {
      appStateSubscription.remove();
    };
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </>
  );
}
