<template>
  <div class="edit-post-wrapper">
    <a href="/dashboard" class="back-link">&larr; Back</a>

    <div class="admin_title">
      <h2>View / Edit Post</h2>
      <form @submit.prevent="deletePost">
        <button type="submit" class="btn btn_delete">Delete</button>
      </form>
    </div>

    <form @submit.prevent="updatePost">
      <label for="title"><b>Title</b></label>
      <input
        type="text"
        id="title"
        placeholder="Post Title"
        v-model="form.title"
      />

      <label for="body"><b>Content</b></label>
      <textarea
        id="body"
        cols="50"
        rows="10"
        v-model="form.body"
      ></textarea>

      <button type="submit" class="btn">Update</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const form = ref({ title: '', body: '' })

const route = useRoute()
const router = useRouter()
const postId = route.params.id

const statusMessage = ref(null)

const showStatusMessage = (type, text) => {
  statusMessage.value = { type, text }
  setTimeout(() => {
    statusMessage.value = null
  }, 4000)
}

const fetchPost = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/post/${postId}`)
    form.value = {
      title: res.data.title,
      body: res.data.body
    }
  } catch (error) {
    console.error('Failed to load post:', error)
    showStatusMessage('error', 'Post not found or failed to load.')
    router.push('/dashboard')
  }
}

const updatePost = async () => {
  try {
    const token = localStorage.getItem('token')

    const res = await axios.put(`${API_BASE_URL}/api/edit-post/${postId}`, form.value, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })

    showStatusMessage(res.data.type || 'success', res.data.message || 'Post updated successfully.')
    router.push('/dashboard')
  } catch (error) {
    console.error('Update failed:', error)
    showStatusMessage('error', error.response?.data?.message || 'Failed to update post.')
  }
}

const deletePost = async () => {
  try {
    const token = localStorage.getItem('token')

    const res = await axios.delete(`${API_BASE_URL}/api/delete-post/${postId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })

    showStatusMessage(res.data.type || 'success', res.data.message || 'Post deleted.')
    router.push('/dashboard')
  } catch (error) {
    console.error('Delete failed:', error)
    showStatusMessage('error', error.response?.data?.message || 'Failed to delete post.')
  }
}

onMounted(fetchPost)
</script>



<style scoped>
.edit-post-wrapper {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: none;
  background: #333;
  color: white;
}

.btn_delete {
  background-color: #e63946;
}
</style>
