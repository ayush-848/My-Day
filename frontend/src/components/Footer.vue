<template>
    <form action="/subscribe" method="POST" class="newsletter-form">
      <h3>Subscribe to Our Newsletter</h3>
      <div class="form-group">
        <input type="email" name="email" placeholder="Enter your email" required />
        <button type="submit">Subscribe</button>
      </div>
    </form>
  <footer class="footer">
    <nav class="footer__nav">
      <ul class="footer__nav-list">
        <li class="footer__nav-item">
          <router-link
            to="/changelog"
            class="footer__nav-link"
            :class="isActiveRoute('/changelog')"
          >
            Changelog
          </router-link>
        </li>
        <li class="footer__nav-item">
          <a
            href="https://github.com/ayush-848"
            target="_blank"
            rel="noopener noreferrer"
            class="footer__nav-link"
          >
            Github
          </a>
        </li>
        <li v-if="username" class="footer__nav-item">
          <router-link
            to="/about"
            class="footer__nav-link"
            :class="isActiveRoute('/about')"
          >
            About
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Copyright -->
    <p class="footer__copyright">
      &copy; {{ currentYear }} Ayush | With NodeJs & MongoDB
    </p>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    username: {
      type: String,
      default: ''
    }
  },
  computed: {
    currentRoute() {
      return this.$route.path;
    },
    currentYear() {
      return new Date().getFullYear();
    }
  },
  methods: {
    isActiveRoute(route) {
      return this.currentRoute === route ? 'active' : '';
    }
  }
};
</script>