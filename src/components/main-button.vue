<template>
  <input
    class="button"
    type="button"
    :value="p_title"
    @click="p_onClick"
  >
</template>

<script>
// import { onMounted, ref } from 'vue'
export default {
  name: 'MenuButton',
  props: {
    p_title: {
      type: String,
      default: '',
    },
    p_onClick: {
      type: Function,
      default: () => {},
    },
  },
}
</script>

<style scoped lang="sass">
.button {
  width: 120px;
  font-size: 30px;
  font-family: impact;
  border-radius: 10px;
  margin: 0 5px;
}
</style>
