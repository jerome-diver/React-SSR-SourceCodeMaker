import { createContext, useContext } from 'react'
const jwt = require('jsonwebtoken')


export const AuthenticateContext = createContext();

export function useAuthenticate() {
  return useContext(AuthenticateContext);
}

export const IsAuthorized = () => {
  // should send the Cookie token (the httpOnly one) 
  // and get back an answer if Authorized
}

export const isAuthenticated = async (id) => {
  console.log("Fetch id", id)
  try {
    let response = await fetch('/api/auth/authorized', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({id: id})
    })
    return await response.json()
  } catch (err) { return { error: err } }
}