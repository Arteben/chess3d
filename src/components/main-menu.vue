<template>
  <div class="menu">
    <main-button
      v-for="btn in btns"
      :key="btn"
      :p_title="`start with ${btn}`"
      class="mainButton"
      @click-btn="clickBtn(btn)"
    />
    <div class="checkbox">
      <label>
        <input
          v-model="grandmasterModel"
          type="checkbox"
        >
        Grandmaster level!
      </label>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { getGameTypes } from '@/utils/menuPoints'
import MainButton from '@/components/button.vue'
export default {
  name: 'MainMenu',
  components: {
    MainButton,
  },
  emits: ['click-menu-btn'],
  // eslint-disable-next-line no-unused-vars
  setup(props, { emit }) {
    const btns = getGameTypes()

    let isTop = false

    const grandmasterModel = computed({
      set: (_value) => { isTop = _value },
      get: () => { return isTop },
    })

    const clickBtn = (_title) => {
      emit('click-menu-btn', {
        type: _title,
        isTop: isTop,
      })
    }

    return {
      btns,
      clickBtn,
      grandmasterModel,
    }
  },
}
</script>

<style scoped lang="sass">
.menu {
  display: flex;
  background: linear-gradient(45deg, #020700, #2b8506);
  padding: 5px 20px;
  padding-right: 50px;
  flex-direction: column;
  border-radius: 10px 90px 0 0;
  outline: 5px solid green;
}

.mainButton {
  margin: 5px 20px;
}

.checkbox {
  display: flex;
  color: white;
  font-size: 16px;
  font-weight: bold;
  margin: 5px 20px;
  justify-content: center;
}
</style>
