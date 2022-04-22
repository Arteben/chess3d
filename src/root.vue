<template>
  <div class="title">
    <span>
      CHESS 3d project <br>
      <button @click="show()">show text</button>
    </span>
  </div>
  <div ref="screen" />
</template>

<script>
import { setThree } from '@/main.ts'
import { onMounted, ref } from 'vue'
export default {
  name: 'RootElement',
  setup() {
    const screen = ref(null)
    onMounted(() => {
      setThree(screen.value)
    })

    return { screen }
  },
}
</script>

<style scoped lang="sass">
.title {
  color: white;
  span {
    color: green;
  }
}
</style>
