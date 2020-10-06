import { createContext, useContext } from 'react'

export const AuthenticateContext = createContext();

export function useAuthenticate() {
  return useContext(AuthenticateContext);
}

export const isAuthenticated = async () => {
  try {
    let response = await fetch('/api/auth/authenticated', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 
                 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    return await response.json()
  } catch (err) { return { error: err } }
}

export const hasRole = async (role) => {
  try {
    let response = await fetch(`/api/auth/authorized/${role}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 
                 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    return await response.json()
  } catch (err) { return { error: err } }
}