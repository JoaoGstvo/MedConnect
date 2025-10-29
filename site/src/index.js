import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './Components/Hooks/AuthProvider';
import Routes from "./routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Routes />
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastStyle={{
          backgroundColor: '#e6f0ff', // azul claro
          color: '#003366',           // texto azul escuro
          borderLeft: '6px solid #007bff',
          borderRadius: '10px',
          padding: '14px 16px',
          fontFamily: 'Poppins, sans-serif',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
        }}
        bodyStyle={{
          fontSize: '15px',
          fontWeight: 500,
        }}
      />
    </AuthProvider>
  </React.StrictMode>
);
