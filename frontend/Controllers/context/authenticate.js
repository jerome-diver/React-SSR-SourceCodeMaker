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
  } catch (error) { return JSON.stringify({error}) }
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
  } catch (error) { return JSON.stringify({error}) }
}

export const canModify = (role, type_name) => {
  return (role != undefined && 
          ((role.name == 'Admin') || (role.name == 'Writer')))
          /* but should better find Type.id from type_name, 
             then check Rule for this document and this Role.id
             to accept or reject modification ability */
}

export const itsMine = (user, data) => {
  return (user != undefined && user.id == data.author_id)
}