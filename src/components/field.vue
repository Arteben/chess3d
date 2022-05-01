<template>
  <div
    ref="field"
    class="field"
  />
</template>

<script>
import { ref, onMounted } from 'vue'
import { getViewport } from '@/utils/field.ts'
export default {
  name: 'Field',
  components: {},
  setup() {
    const field = ref(null)
    onMounted(() => {
      getViewport(field.value, 800, 800)
    })
    return { field }
  },
}
</script>

<style scoped lang="sass">
.field {
  width: 800px;
  height: 800px;
  overflow: hidden;
  border-radius: 10px;
  outline: 5px solid green;
}
</style>
