<script setup>
import { ref, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  username: {
    type: String,
    default: null
  },
  userExists: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['logout']);

const showSearchBar = ref(false);
const searchTerm = ref('');
const searchInput = ref(null);

const route = useRoute();
const router = useRouter();

const currentRoutePath = computed(() => route.path);

const isActiveRoute = (path) => {
  return currentRoutePath.value === path ? 'active' : '';
};

const openSearch = () => {
  showSearchBar.value = true;
  nextTick(() => {
    searchInput.value?.focus();
  });
};

const closeSearch = () => {
  showSearchBar.value = false;
  searchTerm.value = '';
};

const submitSearch = () => {
  if (searchTerm.value.trim()) {
    router.push({ path: '/search', query: { q: searchTerm.value.trim() } });
    closeSearch();
  }
};

const handleLogoutClick = () => {
  emit('logout');
};
</script>

<template>
  <header class="header">
    <router-link to="/" class="header_logo">MyDay</router-link>

    <nav class="header_nav">
      <ul>
        <li>
          <router-link to="/" :class="isActiveRoute('/')">Home</router-link>
        </li>
        <li v-if="!userExists">
          <router-link to="/about" :class="isActiveRoute('/about')">About</router-link>
        </li>
        <li>
          <router-link to="/contact" :class="isActiveRoute('/contact')">Contact</router-link>
        </li>
        <li v-if="!userExists">
          <router-link to="/admin" :class="isActiveRoute('/admin')">Login</router-link>
        </li>
        <template v-else>
          <li>
            <router-link to="/dashboard" :class="isActiveRoute('/dashboard')">Dashboard</router-link>
          </li>
          <li>
  <a href="#" @click.prevent="handleLogoutClick" :class="isActiveRoute('/logout')">Logout</a>
</li>

        </template>
      </ul>
    </nav>

    <div class="header_button">
      <button
        class="searchBtn"
        :aria-expanded="showSearchBar.toString()"
        @click="openSearch"
      >
        Search
        <svg fill="#000000" height="14px" width="14px" viewBox="0 0 488.4 488.4">
          <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6
            s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2
            S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7
            S381.9,104.65,381.9,203.25z"/>
        </svg>
      </button>
    </div>

    <div class="searchBar" :class="{ open: showSearchBar }">
      <div class="searchContainer">
        <form @submit.prevent="submitSearch" class="search_form" role="search">
          <input
            id="searchInput"
            ref="searchInput"
            type="search"
            v-model="searchTerm"
            placeholder="Search the site ..."
          />
        </form>
        <div id="searchClose" @click="closeSearch">Close</div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/*
  ONLY Search Bar specific styles
  All other header styles should be in your global CSS (e.g., style.css)
*/

.searchBar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.searchBar.open {
  visibility: visible;
  opacity: 1;
}

.searchContainer {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 80%;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 10px;
}

.search_form {
  flex-grow: 1;
}

#searchInput {
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  background-color: #fff;
  color: #333;
}

#searchInput:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

#searchClose {
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
  background: #e40303;
  border-radius: 5px;
  margin-left: 10px;
  position: static;
  top: auto;
  right: auto;
}

#searchClose:hover{
  background: #b30000;
}
</style>