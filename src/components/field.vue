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
  emits: ['change-game-state'],
  // eslint-disable-next-line no-unused-vars
  setup(props, { emit }) {
    const fieldEl = ref(null)
    let chessField

    const switchColor = (_game) => {
      if (_game.type) {
        chessField.startNewGame(_game.type)
      }
    }

    const changeGameState = (_state) => {
      emit('change-game-state', _state)
    }

    onMounted(() => {
      chessField = new ChessField(fieldEl.value, 1000, 600)
      chessField.setGameState = changeGameState
      chessField.setGameState('Player, please select a color')
      watchEffect(() => switchColor(props.p_game))
    })

    return { fieldEl }
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
