<template>
  <div class="login">
    <login-panel draggable="true" />
  </div>
</template>

<script setup lang="ts">
import LoginPanel from '@/views/login/components/login-panel.vue'
</script>

<style scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  background: url('../../assets/img/background.svg');
}
</style>
