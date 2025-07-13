<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const post = ref(null)
const route = useRoute()
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const fetchPost = async () => {
  const postId = route.params.id
  if (!postId) return

  try {
    const response = await axios.get(`${API_BASE_URL}/api/post/${postId}`, {
      withCredentials: true,
    })
    post.value = response.data
  } catch (error) {
    console.error('Failed to fetch post:', error)
    alert('Failed to fetch post.')
  }
}

const goBack = () => router.back()
onMounted(fetchPost)
</script>

<template>
  <div class="post-container">
    <div class="back-wrapper">
      <button class="back-button" @click="goBack">← Back</button>
    </div>

    <div v-if="post" class="post-content">
      <h2 class="post-title">{{ post.title }}</h2>
      <article class="post-body" v-html="post.body" />
      <p class="post-meta">Posted on: {{ new Date(post.createdAt).toLocaleDateString() }}</p>
      <p class="post-author" v-if="post.user?.username">By: {{ post.user.username }}</p>
    </div>

    <div v-else class="loading">
      <p>Loading post ...</p>
    </div>
  </div>
</template>

<style scoped>
.post-container {
  max-width: 700px;
  margin: 1rem auto 2rem;
  padding: 0 1rem;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}

.back-wrapper {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.back-button {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: opacity 0.2s ease;
}

.back-button:hover {
  opacity: 0.7;
}

.post-content {
  border-top: 1px solid #ccc;
  padding-top: 1rem;
}

.post-title {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.post-body {
  margin-bottom: 1.5rem;
}

.post-meta,
.post-author {
  font-size: 0.9rem;
  font-style: italic;
  margin-top: 0.5rem;
  display: block;
}

.loading {
  text-align: center;
  padding: 2rem;
}
</style>
