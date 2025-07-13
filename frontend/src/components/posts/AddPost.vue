<template>
  <div class="add-post-wrapper">
    <a href="/dashboard" class="back-link">&larr; Back</a>

    <div class="admin_title">
      <h2>Add New Post</h2>
    </div>

    <form @submit.prevent="submitPost">
      <label for="title"><b>Title</b></label>
      <input
        type="text"
        id="title"
        placeholder="Post Title"
        v-model="form.title"
        required
      />

      <label for="body"><b>Content</b></label>
      <textarea
        id="body"
        cols="50"
        rows="10"
        v-model="form.body"
        required
      ></textarea>

      <button type="submit" class="btn">Add</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const router = useRouter()

const form = ref({
  title: '',
  body: ''
})

const submitPost = async () => {
  try {
    const token = localStorage.getItem('token')

    await axios.post(`${API_BASE_URL}/api/add-post`, form.value, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })

    alert('Post added successfully.')
    router.push('/dashboard')
  } catch (err) {
    console.error('Failed to add post:', err)
    alert('Failed to add post.')
  }
}
</script>


<style scoped>
.add-post-wrapper {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  text-decoration: none;
  font-weight: bold;
}

.admin_title {
  margin-bottom: 1.5rem;
}

form label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.4rem;
  font-size: 1rem;
  box-sizing: border-box;
}

.btn {
  margin-top: 1.2rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  border: none;
  background: #333;
  color: white;
  font-size: 1rem;
}
</style>
