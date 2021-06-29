<template>
  <div class="layout-main">
    <div class="top">
        <base-header></base-header>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import baseHeader from './header.vue'
export default defineComponent({
  name: 'App',
  components:{baseHeader}
})
</script>

<style scoped>

</style>