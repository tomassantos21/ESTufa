import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AzureProvider } from './context/AzureContext';
import '../styles/index.css';

function App() {
  return (
    <AzureProvider>
      <RouterProvider router={router} />
    </AzureProvider>
  );
}

export default App;
