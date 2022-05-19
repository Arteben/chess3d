<template>
  <div id="root">
    <main-menu
      @open-menu="onSelectMenu"
    />
    <field :p_game="game" />
    <popup-menu
      v-if="popupMenu"
      :p_menu="popupMenu"
      @close-popup="onClosePopup()"
      @start-game="onStartGame"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import MainMenu from '@/components/main-menu.vue'
import Field from '@/components/field.vue'
import PopupMenu from '@/components/popup-menu.vue'
export default {
  name: 'RootElement',
  components: {
    MainMenu,
    Field,
    PopupMenu,
  },
  setup() {
    let popupMenu = ref('')
    let game = ref({})

    const onSelectMenu = (_title) => {
      popupMenu.value = _title
    }

    const onClosePopup = () => {
      popupMenu.value = ''
    }

    const onStartGame = (_type) => {
      game.value = { type: _type }
    }

    return {
      onSelectMenu,
      popupMenu,
      onClosePopup,
      onStartGame,
      game,
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
  flex-direction: column;
  align-items: center;
}
</style>
