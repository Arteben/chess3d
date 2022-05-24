<template>
  <div id="root">
    <div id="container">
      <div class="plate">
        <main-menu
          @click-menu-btn="onStartGame"
        />
        <div class="stateContainer">
          <span class="stateText">{{ stateGame }}</span>
        </div>
      </div>
      <field
        :p_game="game"
        @change-game-state="onChangeState"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import MainMenu from '@/components/main-menu.vue'
import Field from '@/components/field.vue'
export default {
  name: 'RootElement',
  components: {
    MainMenu,
    Field,
    // PopupMenu,
  },
  setup() {
    let game = ref({})
    const stateGame = ref('')

    const onStartGame = (_infoGame) => {
      game.value = {
        type: _infoGame.type,
        isTop: _infoGame.isTop,
      }
    }

    const onChangeState = (_state = '') => {
      stateGame.value = _state
    }

    return {
      onStartGame,
      game,
      onChangeState,
      stateGame,
    }
  },
}
</script>

<style lang="sass">
BODY {
  background: gray;
}
</style>

<style lang="sass" scoped>
#root {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

#container {
  display: flex;
  flex-direction: column;
}

.plate {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}

.stateContainer {
  display: flex;
  background: white;
  flex-direction: row;
  height: 25px;
  flex-grow: 1;
  background: antiquewhite;
  font-size: 20px;
  padding: 10px;
  justify-content: center;
  border-radius: 10px 100px 0 0;
  outline: 5px solid green;
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
}

.stateText {
  max-width: 800px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
