<template>
  <div class="task-add-modal-component">
    <div id="button">
      <button v-on:click="openModal">+New Task Add！</button>
    </div>
    <!-- モーダルウィンドウの外側をクリックkしても閉じるように、ここにもcloseイベントを設定しておく。 -->
    <div id="overlay" v-show="showContent" v-on:click.self="closeModal">
      <div id="content">
        <p>
        <label>タスク名：<input type="text" v-model="taskName" placeholder="taskName"></label>
        </p>
        <p>
        <label>タスク内容：<input type="text" v-model="taskDetail" placeholder="taskDetail"></label>
        </p>
        <p>
        <button v-bind:disabled="!isEntered()" v-on:click="addTask()">タスク追加</button>
        </p>
        <p>
        <button v-on:click="closeModal">Close</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      showContent: false,
      taskName: '',
      taskDetail: '',
    }
  },
  methods:{
    openModal: function(){
      this.showContent = true
    },
    closeModal: function(){
      this.showContent = false
    },
    isEntered: function() {
      if (this.taskName === '' || this.taskDetail === '') {
        return false;
      } else {
        return true;
      }
    },
    addTask: function() {
      this.$store.dispatch('addTask', {
        taskNumber: 0,
        taskName: this.taskName,
        taskDetail: this.taskDetail,
        status: 'Working',
        options: ['Working', 'Done'],
        });
      this.taskName = '';
      this.taskDetail = '';
      },
  }
}
</script>

<style scoped>
.task-add-modal-component {
  height: 15vh;
}
#overlay {
  /* 要素を重ねた時の順番 */
  z-index:1;

  /* 画面全体を覆う設定 */
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.5);

  /* 画面の中央に要素を表示させる設定 */
  display: flex;
  align-items: center;
  justify-content: center;
}
#content{
  z-index:2;
  width:50%;
  padding:1em;
  background:#fff;
}
#content input {
  width: 50%;
  margin: 0 auto;
  text-align: center;
}
.task-add-modal-component #button{
  vertical-align: middle;
  text-align: center;
}
button {
  background: #FAF0E6;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  color: #000000;
  padding: 10px;
  /* box-shadow: 0 4px 0 #FFF8DC; */
}
</style>