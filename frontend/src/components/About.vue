<template>
  <div class="container">
    <main>
      <h2>Welcome to MyDay</h2>
      <p>
        Welcome to MyDay, your daily source of inspiration, knowledge, and updates. At MyDay, we are dedicated to providing you with insightful content that brightens your day and enriches your life. Whether you're seeking the latest news, exploring thought-provoking articles, or simply looking for something interesting to read, MyDay is here to serve you.
      </p>
      <p>
        Our mission is to deliver high-quality, engaging, and diverse content that caters to your interests and passions. From in-depth articles on current events and emerging trends to personal growth tips and inspirational stories, we strive to offer something for everyone.
      </p>
      <p>
        Here’s what you can expect from MyDay:
      </p>
      <ul>
        <li><strong>Daily Updates:</strong> Stay informed with our up-to-date news and feature stories that cover a wide range of topics.</li>
        <li><strong>Thoughtful Articles:</strong> Dive into articles that provoke thought, inspire creativity, and provide valuable insights into various subjects.</li>
        <li><strong>Community Engagement:</strong> Join our community of like-minded readers and contributors who share your enthusiasm for learning and growth.</li>
        <li><strong>Personalized Experience:</strong> Enjoy a tailored reading experience based on your interests and preferences, ensuring that you find the content that matters most to you.</li>
      </ul>
      <p>
        At MyDay, we believe that every day is an opportunity to discover something new and exciting. We invite you to explore our content, engage with our community, and make the most of your daily dose of inspiration.
      </p>
    </main>
  </div>
</template>

<script>
export default {
  name: 'About'
};
</script>

<style scoped>
.container {
  width: 90%;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin: 0;
  font-size: 2.5rem;
  color: #333;
}


h2 {
  margin-top: 0;
  padding-bottom: 1rem;
}

p {
  margin-top: 1rem;
  text-align: justify;
  font-size: 1.1rem;
  color: #555;
}

ul {
  margin-top: 1rem;
  padding-left: 1.5rem;
}

ul li {
  margin-bottom: 0.5rem;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .container {
    width: 95%;
    padding: 1rem;
  }

  main {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  p {
    font-size: 1rem;
  }
}
</style>
