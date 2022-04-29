<template>
  <input
    class="button"
    type="button"
    :value="p_title"
    @click="$emit('click-main-btn')"
  >
</template>

<script>
export default {
  name: 'MenuButton',
  props: {
    p_title: {
      type: String,
      default: '',
    },
  },
  emits: ['click-main-btn'],
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
