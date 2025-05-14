import { Inter, Poppins, Roboto_Mono } from 'next/font/google';
import ThemeProvider from '../components/layout/ThemeProvider';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './styles/tailwind.css';

// Load fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const robotoMono = Roboto_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata = {
  title: 'UN-Habitat Project Management',
  description: 'UN-Habitat project management and data visualization platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} scroll-smooth`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <ThemeProvider>
          {/* Background decorative elements */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Top-right blob */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full filter blur-3xl"></div>
            {/* Bottom-left blob */}
            <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-secondary-200/30 dark:bg-secondary-900/20 rounded-full filter blur-3xl"></div>
            {/* Middle accent */}
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent-200/20 dark:bg-accent-900/10 rounded-full filter blur-3xl"></div>
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern-dark opacity-[0.015] dark:opacity-[0.03]"></div>
          </div>
          
          <Navbar />
          <main className="flex-grow pt-16 relative z-10">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
} 