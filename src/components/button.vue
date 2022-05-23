<template>
  <input
    class="button"
    type="button"
    :value="p_title"
    @click.stop="$emit('click-btn')"
  >
</template>

<script>
export default {
  name: 'Button',
  props: {
    p_title: {
      type: String,
      default: '',
    },
  },
  emits: ['click-btn'],
}
</script>

<style scoped lang="sass">
.button {
  font-size: 15px;
  font-family: arial;
  font-weight: bold;
  border-radius: 12px;
  padding: 5px 8px;
  display: inline;
}
</style>
