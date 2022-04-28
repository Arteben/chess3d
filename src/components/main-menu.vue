<template>
  <div class="menu">
    <main-button :p_title="'game'" />
    <main-button :p_title="'settings'" />
  </div>
</template>

<script>
// import { onMounted, ref } from 'vue'
import MainButton from '@/components/main-button.vue'
export default {
  name: 'MainMenu',
  components: {
    MainButton,
  },
  setup() {
    return {}
  },
}
</script>

<style scoped lang="sass">
.menu {
  display: flex;
  background: linear-gradient(45deg, #529434, #1a5302);
  padding: 20px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 400px;
  border-radius: 100px 100px 0 0;
  border: black solid 3px;
  border-bottom: 0px;
}
</style>
