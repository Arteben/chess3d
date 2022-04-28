<template>
  <div id="root">
    <main-menu />
  </div>
  <!-- <div class="title">
    <span>
      CHESS 3d project <br>
      <button @click="show()">show text</button>
    </span>
  </div>
  <div ref="screen" /> -->
</template>

<script>
// import { onMounted, ref } from 'vue'
import MainMenu from '@/components/main-menu.vue'
export default {
  name: 'RootElement',
  components: {
    MainMenu,
  },
  setup() {
  },
}
</script>

<style lang="sass">
BODY {
  background: gray;
}
</style>

<style lang="sass" scoped>
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
