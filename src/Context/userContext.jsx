/* eslint-disable react/prop-types */
// UserContext.js
import { createContext, useState, useContext } from 'react'

// Create the UserContext
const UserContext = createContext()

// UserProvider Component to wrap your app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null) // Initial state is null
  const [isOpenModal, setModal] = useState(false) // Initial state is null

  const OpenModal = () => {
    setModal(true)
  }
  const CloseModal = () => {
    setModal(false)
  }
  return (
    <UserContext.Provider value={{ user, setUser,isOpenModal, OpenModal, CloseModal }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use UserContext
export const useUser = () => {
  return useContext(UserContext)
}
