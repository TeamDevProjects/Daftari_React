/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react'

const NetworkContext = createContext()

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true)
  const [serverError, setServerError] = useState(false)

  useEffect(() => {
    // Check the network status
    const updateNetworkStatus = () => {
      setIsConnected(navigator.onLine)
    }

    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [])

  const setServerErrorStatus = (status) => {
    setServerError(status)
  }

  return (
    <NetworkContext.Provider
      value={{ isConnected, serverError, setServerErrorStatus }}
    >
      {children}
    </NetworkContext.Provider>
  )
}

export default NetworkContext
