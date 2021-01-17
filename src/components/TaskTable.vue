<template>
  <div class="task-table-component">
    <table class="table table-striped table-bordered table-hover table-sm">
      <thead>
        <tr>
          <th>index</th>
          <th>name</th>
          <th>detail</th>
          <th>done</th>
          <th>delete</th>
          <th>update</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="oneTaskRecord in taskTable" v-bind:key="oneTaskRecord.index" v-bind:name="oneTaskRecord.index">
          <td>{{oneTaskRecord.index}}</td>
          <td><input type="text" v-bind:value="oneTaskRecord.taskName" v-bind:id="'taskName'+oneTaskRecord.index" v-on:change="activateButton(oneTaskRecord.index)"></td>
          <td><input type="text" v-bind:value="oneTaskRecord.taskDetail" v-bind:id="'taskDetail'+oneTaskRecord.index" v-on:change="activateButton(oneTaskRecord.index)"></td>
          <td><input type="checkbox" v-bind:id="'doneFlag'+oneTaskRecord.index" v-on:change="clickedDoneFlagCheckBox(oneTaskRecord.index)" value=0><label></label></td>
          <td><input type="checkbox" v-bind:id="'deletedFlag'+oneTaskRecord.index" v-on:change="clickedDeleteFlagCheckBox(oneTaskRecord.index)" value=0><label></label></td>
          <td><button v-on:click="reviseTask(oneTaskRecord.index, oneTaskRecord.taskId)" v-bind:id="'updateButton'+oneTaskRecord.index" disabled>update!</button></td>
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
        height: window.innerHeight,
      }
  },
  computed: {
    taskTable() {
      return this.$store.getters.taskTable;
    },
  },
  methods: {
    success(msg) {
      this.$toasted.show(msg, {
        theme: "outline",
        position: "top-center",
        duration : 5000,
        Icon: "done_all"
     });
    },
    error(msg) {
      this.$toasted.show(msg, {
        theme: "outline",
        position: "top-center",
        duration : 5000,
        Icon: "error"
     })
    },
    reviseTask(index, taskId) {
      // inputタグ内で修正した内容は、引数では取得できないため、dom操作で取得している。
      this.$store.dispatch('reviseTask', {
        index: parseInt(index, 10),
        taskId: parseInt(taskId, 10),
        taskName: document.getElementById('taskName'+index).value,
        taskDetail: document.getElementById('taskDetail'+index).value,
        doneFlag: document.getElementById('doneFlag'+index).value,
        deletedFlag: document.getElementById('deletedFlag'+index).value
      })
      .then(() => {
        this.inactivateButton(index);
        this.clearCheckBox(index);
        this.success('task revised!');
      })
      .catch(() => {
        this.error('failed to revise task');
      });
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
    // 以下修正があった行の修正ボタンだけ活性化するようしたい。
    activateButton(index) {
      document.getElementById('updateButton'+index).disabled = false;
    },
    inactivateButton(index) {
      document.getElementById('updateButton'+index).disabled = true;
    },
    clickedDoneFlagCheckBox(index) {
      if (document.getElementById('doneFlag'+index).checked){
        document.getElementById('updateButton'+index).disabled = false;
        document.getElementById('doneFlag'+index).value = 1;
      } else {
        document.getElementById('updateButton'+index).disabled = true;
        document.getElementById('doneFlag'+index).value = 0;
      }
    },
    clickedDeleteFlagCheckBox(index) {
      if (document.getElementById('deletedFlag'+index).checked){
        document.getElementById('updateButton'+index).disabled = false;
        document.getElementById('deletedFlag'+index).value = 1;
      } else {
        document.getElementById('updateButton'+index).disabled = true;
        document.getElementById('deletedFlag'+index).value = 0;
      }
    },
    clearCheckBox(index){
      document.getElementById('doneFlag'+index).checked = false;
      document.getElementById('doneFlag'+index).value = 0;
      document.getElementById('deletedFlag'+index).checked = false;
      document.getElementById('deletedFlag'+index).value = 0;
    }

  },
  mounted: function () {
    const taskTable = document.getElementsByClassName('task-table-component')[0];
    this.setWidth(taskTable);
    window.addEventListener('resize', this.setWidth(taskTable));
    this.$store.dispatch('reflectTaskTableFromDb');
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize);
  },
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
:disabled{
  background: #BBBBBB;
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
