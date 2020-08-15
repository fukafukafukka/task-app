<template>
  <div id="app">
    <Header></Header>
    <TaskTable></TaskTable>
    <TaskAddModal></TaskAddModal>
  </div>
</template>

<script>
import Header from './components/Header'
import TaskTable from './components/TaskTable'
import TaskAddModal from './components/TaskAddModal'

export default {
  components: {
    Header,
    TaskTable,
    TaskAddModal,
  }
}
</script>

<style>
#app {
  font-family: 'Fredericka the Great', cursive, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  background-color:lightcyan;
}
</style>
