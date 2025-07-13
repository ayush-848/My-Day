<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import TheHeader from './components/Header.vue'
import TheFooter from './components/Footer.vue'

const router = useRouter()
const route = useRoute()

const loggedInUsername = ref(null)
const userExists = ref(false)

const checkAuthStatus = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/auth-status`, {
  withCredentials: true
})

    loggedInUsername.value = response.data.username || null
    userExists.value = response.data.userExists || false
  } catch (error) {
    console.error('Error fetching auth status:', error)
    loggedInUsername.value = null
    userExists.value = false
  }
}

onMounted(() => {
  checkAuthStatus()
})

const logout = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {}, {
      withCredentials: true
    })

    localStorage.removeItem('token')
    localStorage.removeItem('username')
    loggedInUsername.value = null
    userExists.value = false

    router.push('/admin')
  } catch (error) {
    console.error('Error during logout:', error)
    alert('Logout failed. Please try again.')
  }
}
const hideHeaderFooter = computed(() => route.path === '/admin')
</script>

<template>
  <div id="app">
    <TheHeader
      v-if="!hideHeaderFooter"
      :username="loggedInUsername"
      :userExists="userExists"
      @logout="logout"
    />

    <main class="main-content">
      <router-view />
    </main>

    <TheFooter :username="loggedInUsername" />
  </div>
</template>
