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
      type: Object,
      default () {
        return { type: ''}
      },
    },
  },
  // eslint-disable-next-line no-unused-vars
  setup(props) {
    const fieldEl = ref(null)
    let chessField

    const switchColor = function (_game) {
      if (_game.type) {
        chessField.startNewGame(_game.type)
      }
    }

    onMounted(() => {
      chessField = new ChessField(fieldEl.value, 1200, 600)
      watchEffect(() => switchColor(props.p_game))
    })

    return { fieldEl }
  },
}
</script>

<style scoped lang="sass">
.field {
  width: 1200px;
  height: 600px;
  overflow: hidden;
  border-radius: 10px;
  outline: 5px solid green;
}
</style>
