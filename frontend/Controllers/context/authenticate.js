import { createContext, useContext } from 'react'
const jwt = require('jsonwebtoken')


export const AuthentifyContext = createContext();

export function useAuthentify() {
  return useContext(AuthentifyContext);
}

export const IsAuthorized = () => {
  // should send the Cookie token (the httpOnly one) 
  // and get back an answer if Authorized
}