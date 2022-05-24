<template>
  <div
    ref="fieldEl"
    class="field"
    :style="{ width: width + 'px', height: height + 'px' }"
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
  emits: ['change-game-state'],
  // eslint-disable-next-line no-unused-vars
  setup(props, { emit }) {
    const fieldEl = ref(null)
    let chessField
    const width = ref(0)
    const height = ref(0)

    const startNewGame = (_game) => {
      if (_game) {
        chessField.startNewGame(_game)
      }
    }

    const changeGameState = (_state) => {
      emit('change-game-state', _state)
    }

    const minWidth = 900
    const plateHeight = 140

    onMounted(() => {
      width.value = window.innerWidth > minWidth ? (window.innerWidth - 20) : minWidth
      height.value = window.innerHeight - plateHeight

      chessField = new ChessField(fieldEl.value, width.value, height.value)
      chessField.setGameState = changeGameState
      chessField.setGameState('Player, please select a color')
      watchEffect(() => startNewGame(props.p_game))
    })

    return { fieldEl, width, height }
  },
}
</script>

<style scoped lang="sass">
.field {
  display: flex;
  width: 1000px;
  height: 600px;
  overflow: hidden;
  border-radius: 0 0 10px 10px;
  outline: 5px solid green;
}
</style>
