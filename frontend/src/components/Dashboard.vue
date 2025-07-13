<template>
  <div class="container">
    <!-- Status Message -->
    <div v-if="statusMessage" :class="statusMessage.type === 'success' ? 'alert-success' : 'alert-danger'">
      {{ statusMessage.text }}
    </div>

    <!-- Admin Title -->
    <div class="admin_title">
      <h2>Posts</h2>
      <router-link to="/add-post" class="button">+ Add New</router-link>
    </div>

    <!-- Posts List -->
    <ul class="admin_posts">
      <li v-for="post in posts" :key="post._id">
        <router-link :to="`/post/${post._id}`">{{ post.title }} ↗</router-link>
        <div class="admin_post_controls">
          <router-link :to="`/edit-post/${post._id}`" class="btn">Edit</router-link>
          <button @click="showDeleteModal(post._id)" class="btn">Delete</button>
        </div>
      </li>
    </ul>

    <!-- Admin-only Section -->
    <div v-if="user?.username === 'ayush848'">
      <h3>Admin Features</h3>

      <!-- Changelog Form -->
      <form @submit.prevent="submitChangelog" class="changelog-form">
        <h2>Add Changelog</h2>
        <label for="versionNumber">Version Number:</label>
        <input type="text" v-model="changelog.versionNumber" required />

        <label for="updatedOn">Updated On:</label>
        <input type="date" v-model="changelog.updatedOn" required />

        <label for="featureDetails">Feature Details:</label>
        <textarea v-model="changelog.featureDetails" rows="4" required></textarea>

        <button type="submit">Add Changelog</button>
      </form>

      <!-- Newsletter Form -->
      <form @submit.prevent="submitNewsletter" class="newsletter-form">
        <h4>Send Newsletter Update</h4>
        <textarea v-model="newsletterContent" rows="4" placeholder="Enter newsletter content..."></textarea>
        <button type="submit">Send Newsletter</button>
      </form>
    </div>

    <!-- Delete Modal -->
    <div v-if="showModal" id="deleteModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="hideDeleteModal">&times;</span>
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this post?</p>
        <div class="modal-actions">
          <button @click="confirmDeletePost" class="delete-btn">Yes, Delete</button>
          <button @click="hideDeleteModal" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
console.log('[Dashboard] Using API_BASE_URL:', API_BASE_URL)

const posts = ref([])
const user = ref(null)
const statusMessage = ref(null)
const changelog = ref({
  versionNumber: '',
  updatedOn: '',
  featureDetails: ''
})
const newsletterContent = ref('')
const showModal = ref(false)
const postToDelete = ref(null)

const showStatusMessage = (type, text) => {
  statusMessage.value = { type, text }
  setTimeout(() => {
    statusMessage.value = null
  }, 4000)
}

const fetchDashboardData = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/dashboard`, { withCredentials: true })
    posts.value = res.data.posts
    user.value = res.data.user
  } catch (err) {
    router.push('/admin')
  }
}

const submitChangelog = async () => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/add-changelog`, changelog.value, { withCredentials: true })
    showStatusMessage(res.data.type, res.data.message)
    changelog.value = { versionNumber: '', updatedOn: '', featureDetails: '' }
  } catch (err) {
    console.error('[Dashboard] Changelog error:', err)
    showStatusMessage('error', err.response?.data?.message || 'Failed to add changelog.')
  }
}

const submitNewsletter = async () => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/send-newsletter`, { newsletterContent: newsletterContent.value }, { withCredentials: true })
    showStatusMessage(res.data.type, res.data.message)
    newsletterContent.value = ''
  } catch (err) {
    console.error('[Dashboard] Newsletter error:', err)
    showStatusMessage('error', err.response?.data?.message || 'Failed to send newsletter.')
  }
}

const showDeleteModal = (postId) => {
  console.log('[Dashboard] Show delete modal for post ID:', postId)
  postToDelete.value = postId
  showModal.value = true
}

const hideDeleteModal = () => {
  console.log('[Dashboard] Hide delete modal')
  showModal.value = false
  postToDelete.value = null
}

const confirmDeletePost = async () => {
  console.log('[Dashboard] Deleting post with ID:', postToDelete.value)
  try {
    const res = await axios.delete(`${API_BASE_URL}/api/delete-post/${postToDelete.value}`, { withCredentials: true })
    posts.value = posts.value.filter(p => p._id !== postToDelete.value)
    hideDeleteModal()
    console.log('[Dashboard] Post deleted successfully')
    showStatusMessage(res.data.type, res.data.message)
  } catch (err) {
    console.error('[Dashboard] Delete post error:', err)
    showStatusMessage('error', err.response?.data?.message || 'Failed to delete post')
  }
}

onMounted(fetchDashboardData)
</script>


<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
}

.close {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 2rem;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
}

.cancel-btn {
  background-color: #ccc;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
}
</style>
