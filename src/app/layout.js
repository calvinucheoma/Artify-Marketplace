import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Provider from '@/components/Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Nextjs Marketplace App',
  description: 'A webapp where users can buy and sell products online',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
