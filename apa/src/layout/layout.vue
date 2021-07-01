<template>
  <div class="layout-main">
    <div class="top">
        <base-header></base-header>
    </div>
    <router-view />
  </div>
</template>

<script setup>
import baseHeader from './header.vue'

</script>

<style scoped>

</style>