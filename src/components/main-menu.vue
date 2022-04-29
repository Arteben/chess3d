<template>
  <div class="menu">
    <main-button
      v-for="btn in btns"
      :key="btn"
      :p_title="btn"
      @click-main-btn="clickBtn(btn)"
    />
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
  emits: ['open-menu'],
  // eslint-disable-next-line no-unused-vars
  setup(props, { emit }) {
    const btns = [ 'game', 'settings' ]
    const clickBtn = (_title) => {
      emit('open-menu', _title)
    }
    return { btns, clickBtn }
  },
}
</script>

<style scoped lang="sass">
.menu {
  display: flex;
  background: linear-gradient(45deg, #529434, #1a5302);
  padding: 5px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 320px;
  border-radius: 100px 100px 0 0;
  border: black solid 5px;
  border-bottom: 0px;
}
</style>
