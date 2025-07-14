<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const query = ref(route.query.q || '')
const results = ref([])
const loading = ref(false)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const fetchResults = async () => {
  if (!query.value.trim()) return
  loading.value = true
  try {
    const res = await axios.post(`${API_BASE_URL}/api/search`, {
      searchTerm: query.value
    })
    results.value = res.data.searchResults
  } catch (error) {
    console.error('Search failed:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchResults)
</script>

<template>
  <div class="container">
    <div class="author">
      <h1 class="author_heading">Search Results</h1>
    </div>

    <section class="articles">
      <p v-if="loading">Searching...</p>
      <p v-else-if="results.length === 0">No posts found for "{{ query }}"</p>

      <ul v-else class="article-ul">
        <li v-for="post in results" :key="post._id">
          <router-link :to="`/post/${post._id}`">
            <span>{{ post.title }}</span>
            <span class="article-list_date">{{ formatDate(post.createdAt) }}</span>
          </router-link>
        </li>
      </ul>
    </section>
  </div>
</template>
