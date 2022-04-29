<template>
  <div class="popup">
    <div class="menu">
      <input
        class="closeBtn"
        type="button"
        value="X"
        @click.stop="closeMenu()"
      >
      point 1 <br>
      point 2 <br>
      {{ p_menu }}
    </div>
  </div>
</template>

<script>
// import { onMounted, ref } from 'vue'
export default {
  name: 'PopupMenu',
  components: {},
  props: {
    p_menu: {
      type: String,
      default: '',
    },
  },
  emits: ['close-popup'],
  // eslint-disable-next-line no-unused-vars
  setup(props, { emit }) {
    const closeMenu = () => {
      emit('close-popup')
    }
    return { closeMenu }
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
  width: 320px;
  flex-direction: column;
  border-radius: 10px;
  border: black solid 5px;
  font-size: 30px;
  font-family: impact;
  padding: 10px;
}

.closeBtn {
  font-size: 20px;
  font-weight: bold;
  border-radius: 100px;
  width: 30px;
  align-self: flex-end;
  cursor: pointer;
}
</style>
