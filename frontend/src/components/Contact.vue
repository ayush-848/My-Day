<template>
    <div class="contact-wrapper">
      <h2>Contact Us</h2>
      <form action="/submit-contact" method="POST">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required />

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label for="message">Message:</label>
        <textarea id="message" name="message" rows="4" required></textarea>

        <button class="button_contact" type="submit">Submit</button>
      </form>
    </div>
</template>

<script setup>
// No script needed
</script>

<style scoped>
.contact-wrapper {
  margin: 3rem auto;
  padding: 1.5rem;
  background-color: white;
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
}

h2 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-top: 1rem;
  font-weight: 500;
}

input,
textarea {
  width: 100%;
  padding: 10px 12px;
  margin-top: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  background: #fefefe;
}

.button_contact {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #1c1c1c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  margin-top: 1.5rem;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s ease;
}

.button_contact:hover {
  background-color: #4cae4c;
}
</style>
