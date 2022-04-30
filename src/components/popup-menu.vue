<template>
  <div class="popup">
    <div class="menu">
      <my-button
        class="closeBtn"
        p_title="x"
        @click-btn="closeMenu()"
      />
      <template v-if="p_menu == getMainMenuBtns('game')">
        <my-button
          v-for="game in games"
          :key="game"
          :p_title="`start ${game}`"
          class="btn"
          @click-btn="startGame(game)"
        />
        <hr>
        <my-button
          class="btn"
          p_title="save game"
          @click-btn="saveLoadGame()"
        />
      </template>
      <template v-else>
        settings
      </template>
    </div>
  </div>
</template>

<script>
// import { onMounted } from 'vue'
import { getMainMenuBtns, getGameTypes } from '@/utils/common'
import MyButton from '@/components/button.vue'
export default {
  name: 'PopupMenu',
  components: {
    MyButton,
  },
  props: {
    p_menu: {
      type: String,
      default: '',
    },
  },
  emits: ['close-popup', 'start-game'],
  // eslint-disable-next-line no-unused-vars
  setup(props, { emit }) {
    const closeMenu = () => {
      emit('close-popup')
    }

    const games = getGameTypes()

    const startGame = (_type) => {
      emit('start-game', _type)
      emit('close-popup')
    }

    const saveLoadGame = () => {}

    return {
      closeMenu,
      games,
      startGame,
      saveLoadGame,
      getMainMenuBtns,
    }
  },
}
</script>

<style lang="sass" scoped>
.popup {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu {
  background: linear-gradient(225deg, #529434, #519434);
  display: flex;
  width: 300px;
  flex-direction: column;
  border-radius: 10px;
  border: black solid 5px;
  font-size: 30px;
  font-family: impact;
  padding: 10px;
  align-items: center;
}

.closeBtn {
  font-size: 20px;
  font-weight: bold;
  border-radius: 100px;
  width: 30px;
  align-self: flex-end;
  cursor: pointer;
  background: #93e16f;
}

.btn {
  margin: 10px;
  width: 180px;
}

hr {
  width: 10px;
}
</style>
