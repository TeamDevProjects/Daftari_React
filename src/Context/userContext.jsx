/* eslint-disable react/prop-types */
// UserContext.js
import { createContext, useState, useContext } from 'react'

// Create the UserContext
const UserContext = createContext()

// UserProvider Component to wrap your app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null) // Initial state is null

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use UserContext
export const useUser = () => {
  return useContext(UserContext)
}
