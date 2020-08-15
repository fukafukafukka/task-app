import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        taskTable:[{
            taskNumber: 1,
            taskName: "画面作成",
            taskDetail: "修正・新規作成・削除機能の作成",
            status: 'Working',
            options: ['Working', 'Done'],
          }]
    },
    getters: {
        taskTable: state => state.taskTable
    },
    // 以下、mutationsとは、ここでしか値を変えられないようにするためのもの。
    mutations: {
        addTask(state, taskObject) {
            taskObject.taskNumber = state.taskTable[state.taskTable.length -1].taskNumber + 1;
            state.taskTable.push(taskObject);
        },
        reviseTask(state, taskObject) {
            state.taskTable.splice([taskObject.taskNumber]-1, 1, taskObject);
        },
        deleteTask(state, taskNumber) {
            state.taskTable.splice(taskNumber-1, 1);
        }
    },
    actions: {
        addTask({commit}, taskObject) {
            commit("addTask", taskObject);
        },
        reviseTask({commit}, taskObject) {
            commit("reviseTask", taskObject);
        },
        deleteTask({commit}, taskNumber) {
            commit("deleteTask", taskNumber);
        }
    }
})