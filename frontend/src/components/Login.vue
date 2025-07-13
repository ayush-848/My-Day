<template>
  <header class="header">
    <router-link to="/" class="header_logo_admin">Admin Panel</router-link>

    <nav class="header_nav">
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li>
      </ul>
    </nav>
  </header>

  <h3>Sign In</h3>
  <form @submit.prevent="handleLogin">
    <label><b>Username</b></label>
    <input type="text" v-model="loginUsername" placeholder="Enter Username" required />

    <label><b>Password</b></label>
    <input type="password" v-model="loginPassword" placeholder="Enter Password" required />

    <input type="submit" class="btn" value="Submit" />
  </form>

  <h3>Register</h3>
  <form @submit.prevent="handleRegister">
    <label><b>Username</b></label>
    <input type="text" v-model="registerUsername" placeholder="Enter Username" required />

    <label><b>Password</b></label>
    <input type="password" v-model="registerPassword" placeholder="Enter Password" required />

    <input type="submit" class="btn" value="Register" />
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, register } from '../services/authServices'

const router = useRouter()

const loginUsername = ref('')
const loginPassword = ref('')
const registerUsername = ref('')
const registerPassword = ref('')

const handleLogin = async () => {
  try {
    const res = await login(loginUsername.value, loginPassword.value)

    if (res.token) {
      localStorage.setItem('token', res.token)
      localStorage.setItem('username', res.username)
      window.location.href = '/dashboard' // Redirect to dashboard after login
    } else {
      alert('Login failed')
    }
  } catch (err) {
    console.error(err)
    alert('Invalid login')
  }
}

const handleRegister = async () => {
  try {
    const res = await register(registerUsername.value, registerPassword.value)

    if (res.success) {
      alert('Registration successful. You can now log in.')
      registerUsername.value = ''
      registerPassword.value = ''
    } else {
      alert('Registration failed.')
    }
  } catch (err) {
    console.error(err)
    alert('Registration error')
  }
}
</script>

<style scoped>
h3 {
  text-align: center;
  margin: 2rem 0 1rem;
  font-size: 1.6rem;
  font-weight: 600;
}

form {
  max-width: 400px;
  margin: 0 auto 2rem;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

label {
  display: block;
  margin-top: 1rem;
  font-weight: 500;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px 12px;
  margin-top: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fefefe;
  font-size: 1rem;
}

.btn {
  width: 100%;
  padding: 12px;
  margin-top: 1.5rem;
  background-color: #1c1c1c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #363b36;
}
</style>
