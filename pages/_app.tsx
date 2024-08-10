import { useEffect } from "react";
import { AppProps } from "next/app";
import { subscribeToSupabaseChanges } from "../lib/realtime";
import { startSync } from "../lib/syncData";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    let isSubscribed = true;
    let subscription: any;

    const handleSubscription = () => {
      try {
        subscription = subscribeToSupabaseChanges();
        console.log("Subscription successfully created.");
      } catch (error) {
        console.error("Error while subscribing to Supabase changes:", error);
      }
    };

    handleSubscription();

    const syncInterval = setInterval(() => {
      if (isSubscribed) {
        startSync();
      }
    }, 15000);

    return () => {
      isSubscribed = false;
      clearInterval(syncInterval);
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      } else {
        console.warn(
          "Subscription cleanup failed; unsubscribe method not found."
        );
      }
    };
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
