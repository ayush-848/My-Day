// services/authService.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const login = async (username, password) => {
  console.log('[authService] Logging in with:', { username })

  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password })

    const { token, username: returnedUsername } = res.data

    // ✅ Store token in localStorage
    localStorage.setItem('token', token)

    console.log('[authService] Login successful')
    return { username: returnedUsername, token }
  } catch (err) {
    console.error('[authService] Login error:', err.response?.data || err.message)
    throw err
  }
}

export const register = async (username, password) => {
  console.log('[authService] Registering user:', { username })

  try {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, { username, password })

    console.log('[authService] Register response:', res.data)
    return res.data
  } catch (err) {
    console.error('[authService] Register error:', err.response?.data || err.message)
    throw err
  }
}

export const logout = () => {
  localStorage.removeItem('token') // ✅ Clear token on logout
}
