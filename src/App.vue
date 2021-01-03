<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
    <TaskAddModal></TaskAddModal>
  </div>
</template>

<script>
import Header from './components/Header'
import TaskAddModal from './components/TaskAddModal'

export default {
  components: {
    Header,
    TaskAddModal,
  }
}
</script>

<style>
@font-face {
  font-family: 'NagomiGokubosoGothic';
  src: url("/nagomigokubosogothic/NagomiGokubosoGothic-ExtraLight.otf");
}
#app {
  font-family: 'NagomiGokubosoGothic', "Batang", cursive, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  background-color:lightcyan;
}
</style>
