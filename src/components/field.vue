<template>
  <div
    ref="fieldEl"
    class="field"
  />
</template>

<script>
import { ref, onMounted, watchEffect } from 'vue'
import { ChessField } from '@/utils/chess-field.ts'
export default {
  name: 'Field',
  components: {},
  props: {
    p_game: {
      type: String,
      default: '',
    },
  },
  // eslint-disable-next-line no-unused-vars
  setup(props) {
    const fieldEl = ref(null)
    let chessField

    const switchColor = function (_type) {
      if (_type) {
        chessField.setBackground()
      }
    }

    onMounted(() => {
      chessField = new ChessField(fieldEl.value, 1200, 800)
      watchEffect(() => switchColor(props.p_game))
    })



    return { fieldEl }
  },
}
</script>

<style scoped lang="sass">
.field {
  width: 1200px;
  height: 800px;
  overflow: hidden;
  border-radius: 10px;
  outline: 5px solid green;
}
</style>
