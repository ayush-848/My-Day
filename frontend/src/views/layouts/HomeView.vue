<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const posts = ref([]);
const nextPage = ref(null);
const username = ref(null);
const userExists = ref(false);

const fetchPosts = async (page = 1) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/posts?page=${page}`, {
      withCredentials: true,
    });

    posts.value = response.data.posts;
    nextPage.value = response.data.nextPage;
    username.value = response.data.username;
    userExists.value = response.data.userExists;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    alert('Failed to fetch posts. Please check the backend connection.');
  }
};

onMounted(() => {
  fetchPosts();
});

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<template>
  <div class="container">
    <div class="author">
      <h1 class="author_heading">
        <template v-if="username">
          Hello {{ username }},
        </template>
        <template v-else>
          Welcome to MyDay
        </template>
      </h1>
      <h2 v-if="username">Great to see you again</h2>
      <p class="author_body">
        Hope, You are having a Good Day
      </p>
      <img src="/images/hero-image.webp" alt="person looking out of the window" class="hero_image" width="600" height="300">
    </div>

    <section class="articles">
      <h2 class="articles_heading">
        {{ userExists ? 'Your Posts:' : 'Latest Posts:' }}
      </h2>

      <div v-if="posts.length > 0" class="post-list">
        <ul class="article-ul">
          <li v-for="post in posts" :key="post._id">
            <router-link :to="`/post/${post._id}`">
              <span>{{ post.title }}</span>
              <span class="article-list_date">{{ formatDate(post.createdAt) }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No posts found.</p>
      </div>

      <div v-if="nextPage" class="pagination-controls">
  <a href="#" @click.prevent="fetchPosts(nextPage)" class="pagination">
    View Older Posts →
  </a>
</div>

    </section>
  </div>
</template>

<style scoped>
.pagination-controls {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
</style>
