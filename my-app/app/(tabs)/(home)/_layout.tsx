import { Stack,Link } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="index" />
      <Link href="/details/1">View first user details</Link>
      <Link href="/details/2">View second user details</Link>
    </Stack>
  );
}
