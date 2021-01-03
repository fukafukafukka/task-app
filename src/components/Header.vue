<template>
  <header>
    <h3>Today's Tasks !</h3>
    <router-link to="/taskTable">not yet</router-link>
    <router-link to="/doneTaskTable">done</router-link>
    <router-link to="/deletedTaskTable">deleted</router-link>
  </header>
</template>

<script>
export default {}
</script>

<style scoped>
header{
  height: 15vh;
  padding-top: 30px;
}
</style>