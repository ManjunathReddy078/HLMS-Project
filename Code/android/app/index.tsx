import { Redirect } from 'expo-router';

export default function Index() {
  // Explicitly routing the root path to the dedicated login file
  // This solves Expo Router path ambiguity between root index and nested tab index
  return <Redirect href="/login" />;
}
