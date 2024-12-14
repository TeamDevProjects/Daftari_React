import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'react-toastify/dist/ReactToastify.css'

import './index.css'
import { ToastContainer } from 'react-toastify'
import { UserProvider } from './Context/userContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer position="top-center" autoClose={2000} />
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
)
