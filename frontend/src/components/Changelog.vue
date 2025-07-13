<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const changelogs = ref([])
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const loading = ref(true)
const error = ref(null)

const fetchChangelog = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/changelog`)
    changelogs.value = response.data.changelogs
  } catch (err) {
    console.error('Failed to fetch changelogs:', err)
    error.value = 'Failed to load changelogs.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchChangelog)

const formatDate = (date) => {
  return new Date(date).toDateString()
}
</script>

<template>
  <div class="container">
    <div class="changelog-list">
      <h2>Changelog</h2>

      <p v-if="loading">Loading changelog...</p>
      <p v-if="error" class="error">{{ error }}</p>

      <div v-else>
        <div
          v-for="(changelog, index) in changelogs"
          :key="index"
          class="changelog-entry"
        >
          <div class="changelog-info">
            <p><strong>Version:</strong> {{ changelog.versionNumber }}</p>
            <p><strong>Updated On:</strong> {{ formatDate(changelog.updatedOn) }}</p>
            <p><strong>Details:</strong></p>
          </div>
          <ul class="changelog-details">
            <li v-for="(detail, i) in changelog.featureDetails.split('- ').slice(1)" :key="i">
              {{ detail.trim() }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  line-height: 1.6;
  background-color: #f8f9fa;
  color: #333;
}

/* Changelog List Styling */
.changelog-list h2 {
  font-size: 32px;
  color: #212529;
  margin-bottom: 24px;
  text-align: center;
}

.changelog-entry {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e9ecef;
}

.changelog-entry:last-child {
  border-bottom: none;
}

.changelog-entry h3 {
  font-size: 24px;
  color: #007bff;
  margin-bottom: 16px;
}

.changelog-info {
  margin-bottom: 16px;
}

.changelog-info strong {
  font-weight: 700;
  color: #495057;
  margin-right: 8px;
}

.changelog-details {
  list-style-type: none;
  padding-left: 0;
}

.changelog-details li {
  margin-bottom: 3px;
  position: relative;
  padding-left: 20px;
}

.changelog-details li::before {
  content: '•';
  position: absolute;
  left: 0;
}

.error {
  color: red;
  text-align: center;
}
</style>
