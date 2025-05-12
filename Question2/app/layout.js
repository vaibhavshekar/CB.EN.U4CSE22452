import { Inter } from 'next/font/google';
import { CssBaseline } from '@mui/material';
import Navbar from '../components/Navbar';
import ThemeRegistry from '../components/ThemeRegistry';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Stock Analytics',
  description: 'Real-time stock price analysis',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <CssBaseline />
          <Navbar />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}