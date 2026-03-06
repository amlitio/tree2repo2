import { Inter, Roboto_Mono } from 'next/font/google';
import '../styles/globals.css';

// Load Aave's official brand fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export default function App({ Component, pageProps }) {
  return (
    <main className={`${inter.variable} ${robotoMono.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  );
}