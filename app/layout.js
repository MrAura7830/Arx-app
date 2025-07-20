import './globals.css';
import { AuthProvider } from '../components/AuthProvider';

export const metadata = {
  title: 'Arx | BargainFinder AI',
  description: 'AI-powered price comparison and deal finder',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
