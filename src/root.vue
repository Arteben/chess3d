<template>
  <div class="title">
    <span>
      CHESS 3d project <br>
      <button @click="show()">show text</button>
    </span>
  </div>
</template>

<script>
import { showText } from '@/main.ts'
export default {
  name: 'RootElement',
  setup() {
    const show = function () {
      showText('chess 3d')
    }
    return { show }
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
