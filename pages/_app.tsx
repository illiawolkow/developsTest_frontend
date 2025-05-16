import type { AppProps } from 'next/app';
import '../styles/globals.css'; // We'll create this file next

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp; 