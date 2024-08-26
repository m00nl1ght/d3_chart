<script setup></script>

<template>
  <v-app>
    <v-app-bar app>
      <nav>
        <router-link to="/">Donat</router-link>
        <router-link to="/line-with-area">LineWithArea</router-link>
        <router-link to="/some">Some</router-link>
      </nav>
    </v-app-bar>

    <v-main>
      <v-container style="max-width: 900px">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
