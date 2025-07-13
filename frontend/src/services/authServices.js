// services/authService.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const login = async (username, password) => {
  console.log('[authService] Logging in with:', { username }) // Don't log password for security

  try {
    const res = await axios.post(
      `${API_BASE_URL}/auth/login`,
      { username, password },
      { withCredentials: true }
    )

    console.log('[authService] Login response:', res.data)
    return res.data
  } catch (err) {
    console.error('[authService] Login error:', err.response?.data || err.message)
    throw err
  }
}

export const register = async (username, password) => {
  console.log('[authService] Registering user:', { username })

  try {
    const res = await axios.post(
      `${API_BASE_URL}/auth/register`,
      { username, password }
    )

    console.log('[authService] Register response:', res.data)
    return res.data
  } catch (err) {
    console.error('[authService] Register error:', err.response?.data || err.message)
    throw err
  }
}
