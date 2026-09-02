import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { CMSProvider } from './context/CMSContext';
import { ErrorBoundary } from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <DataProvider>
        <CMSProvider>
          <ErrorBoundary fallbackTitle="BrizX India Portal Error">
            <App />
          </ErrorBoundary>
        </CMSProvider>
      </DataProvider>
    </AuthProvider>
  </StrictMode>,
);

