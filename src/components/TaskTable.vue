<template>
  <div class="task-table-component">
    <table class="table table-striped table-bordered table-hover table-sm">
      <thead>
        <tr>
          <th>number</th>
          <th>name</th>
          <th>detail</th>
          <th>STATUS</th>
          <th>update</th>
          <th>delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="oneTaskRecord in taskTable" v-bind:key="oneTaskRecord.taskNumber" v-bind:name="oneTaskRecord.taskNumber">
          <td>{{oneTaskRecord.taskNumber}}</td>
          <td><input type="text" v-bind:value="oneTaskRecord.taskName" v-bind:id="'taskName'+oneTaskRecord.taskNumber"></td>
          <td><input type="text" v-bind:value="oneTaskRecord.taskDetail" v-bind:id="'taskDetail'+oneTaskRecord.taskNumber"></td>
          <td><v-select v-model="oneTaskRecord.status" :options="oneTaskRecord.options" v-bind:id="'status'+oneTaskRecord.taskNumber" v-bind:status="oneTaskRecord.status"></v-select></td>
          <td><button v-on:click="reviseTask(oneTaskRecord.taskNumber)">update!</button></td>
          <td><button v-on:click="deleteTask(oneTaskRecord.taskNumber)">delete!</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data: function() {
      return {
        message: '',
        width: window.innerWidth,
        height: window.innerHeight
      }
  },
  computed: {
    taskTable() {
      return this.$store.getters.taskTable;
    }
  },
  methods: {
    deleteTask(taskNumber){
      this.$store.dispatch('deleteTask', taskNumber)
    },
    reviseTask(taskNumber) {
      this.$store.dispatch('reviseTask', {
        taskNumber: taskNumber,
        taskName: document.getElementById('taskName'+taskNumber).value,
        taskDetail: document.getElementById('taskDetail'+taskNumber).value,
        status: document.getElementById('status'+taskNumber).getAttribute("status"),
        options: ['Working', 'Done'],
      });
    },
    // 以下修正があった行の修正ボタンだけ活性化するようしたい。
    onChangeInput(event) {
      this.message = event.target.value
    },
    setWidth(taskTable) {
      if (window.matchMedia('(max-width: 736px)').matches) {
        taskTable.classList.remove('width-1024-and-margin-0-auto');
        taskTable.classList.add('w-100');
      } else if (window.matchMedia('(min-width: 736px)').matches) {
        // 画面サイズ > IPad 横置き幅
        taskTable.classList.remove('w-100');
        taskTable.classList.add('width-736-and-margin-0-auto');
      }
    },
  },
  mounted: function () {
    const taskTable = document.getElementsByClassName('task-table-component')[0];
    this.setWidth(taskTable);
    window.addEventListener('resize', this.setWidth(taskTable));
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.task-table-component {
  height: 70vh;
  overflow: scroll;
  padding: 10px;
}
table thead tr th{
  width: 100%;
  white-space: nowrap;
  overflow: scroll;
  vertical-align: middle;
  text-align: center;
}
table tbody tr td{
  width: 100%;
  white-space: nowrap;
  overflow: scroll;
  vertical-align: middle;
  text-align: center;
}
table tbody tr td button {
  background: #FAF0E6;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  color: #000000;
  /* box-shadow: 0 4px 0 #FFF8DC; */
}
table tbody tr td input{
  background: #FAF0E6;
}
.v-select{
  background: #FAF0E6;
}
@media (min-width:415px) {
  table {
    table-layout: fixed;
  }
  table tbody tr td input{
    width: 100%;
  }
  table tbody tr td button{
    width: 100%;
  }
}
@media (min-width:736px) {
  .width-736-and-margin-0-auto {
    margin: 0 auto;
    width: 736px;
  }
}
</style>
