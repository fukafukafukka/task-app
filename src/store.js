import Vue from 'vue';
import Vuex from 'vuex';
import axios from './axios-settings.js';
import router from './router.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userId: 1,
        taskTable: [],
        taskIdList: [],
        doneTaskTable: [],
        doneTaskIdList: [],
        deletedTaskTable: [],
        deletedTaskIdList: [],
        csrfToken: null,
        csrfTokenByLogined: null,
        errorStatus: null,
        errorStatusText: null,
        // taskTable:[{
        //     taskId: 1,
        //     userId: 1,
        //     taskName: "画面作成",
        //     taskDetail: "修正・新規作成・削除機能の作成",
        //     doneFlag: 0,
        //     deletedFlag: 0,
        //   }]
    },
    getters: {
        taskTable: state => state.taskTable,
        doneTaskTable: state => state.doneTaskTable,
        deletedTaskTable: state => state.deletedTaskTable,
        errorStatus: state => state.errorStatus,
    },
    // 以下、mutationsとは、ここでしか値を変えられないようにするためのもの。
    mutations: {
        registerCsrfToken(state, csrfToken){
            state.csrfToken = csrfToken;
        },
        registerCsrfTokenByLogined(state, csrfTokenByLogined){
            state.csrfTokenByLogined = csrfTokenByLogined;
        },
        registerErrorInfo(state, errorStatus, errorStatusText){
            state.errorStatus = errorStatus;
            state.errorStatusText = errorStatusText;
        },
        refleshErrorInfo(state){
            state.errorStatus = '';
            state.errorStatusText = '';
        },
        reflectTaskTableFromDb(state, taskObjectList){
            state.taskTable = taskObjectList;
            for (let taskObject of taskObjectList) {
                state.taskIdList.push(taskObject['taskId']);
            }
        },
        reflectDoneTaskTableFromDb(state, doneTaskObjectList){
            state.doneTaskTable = doneTaskObjectList;
            for (let doneTaskObject of doneTaskObjectList) {
                state.doneTaskIdList.push(doneTaskObject['taskId']);
            }
        },
        reflectDeletedTaskTableFromDb(state, deletedTaskObjectList){
            state.deletedTaskTable = deletedTaskObjectList;
            for (let deletedTaskObject of deletedTaskObjectList) {
                state.deletedTaskIdList.push(deletedTaskObject['taskId']);
            }
        },
        addToTaskTable(state, taskObject) {
            // taskIdを既存のtaskId最後の値にプラス1した値に更新している。
            if (state.taskIdList.length === 0){
                taskObject.taskId = 1;
            }else{
                taskObject.taskId = state.taskIdList[state.taskIdList.length - 1] + 1;
            }
            state.taskTable.push(taskObject);
            state.taskIdList.push(taskObject.taskId);
        },
        addToDoneTaskTable(state, doneTaskObject){
            if (state.doneTaskIdList.length === 0){
                doneTaskObject.taskId = 1;
            }else{
                doneTaskObject.taskId = state.doneTaskIdList[state.doneTaskIdList.length - 1] + 1;
            }
            state.doneTaskTable.push(doneTaskObject);
            state.doneTaskIdList.push(doneTaskObject.taskId);
        },
        addToDeletedTaskTable(state, deletedTaskObject){
            if (state.deletedTaskIdList.length === 0){
                deletedTaskObject.taskId = 1;
            }else{
                deletedTaskObject.taskId = state.deletedTaskIdList[state.deletedTaskIdList.length - 1] + 1;
            }
            state.deletedTaskTable.push(deletedTaskObject);
            state.deletedTaskIdList.push(deletedTaskObject.taskId);
        },
        reviseTaskTable(state, taskObject) {
            state.taskTable.splice(state.taskIdList.indexOf( taskObject.taskId ), 1, taskObject);
        },
        deleteFromTaskTable(state, taskId) {
            state.taskTable.splice(state.taskIdList.indexOf( taskId ), 1);
            state.taskIdList = state.taskIdList.filter(n => n !== taskId);
        },
        deleteFromDoneTaskTable(state, doneTaskId) {
            state.doneTaskTable.splice(state.doneTaskIdList.indexOf( doneTaskId ), 1);
            state.doneTaskIdList = state.doneTaskIdList.filter(n => n !== doneTaskId);
        }
    },
    actions: {
        addTask({commit, state}, taskObject) {
            taskObject.userId = state.userId;
            return new Promise((resolve, reject) => {
                axios({
                    method: "POST",
                    url: `http://localhost:8080/task/insert`,
                    data: taskObject,
                    _csrf: this.state.csrfToken,
                })
                .then(() => {
                    commit("addToTaskTable", taskObject);
                    resolve();
                })
                .catch(error => {
                    console.log(error);
                    commit("registerErrorInfo", error.response.status, error.response.statusText);
                    reject();
                });
            })
        },
        reviseTask({commit, state}, taskObject) {
            taskObject.userId = state.userId;
            return new Promise((resolve, reject) => {
                axios({
                    method: "PUT",
                    url: `http://localhost:8080/task/update`,
                    data: taskObject,
                    _csrf: this.state.csrfToken,
                })
                .then(() => {
                    // 削除commit
                    // 追加commit
                    if(taskObject.deletedFlag === "1"){
                        commit("deleteFromTaskTable", taskObject.taskId);
                        commit("addToDeletedTaskTable", taskObject);
                    } else if(taskObject.doneFlag === "1"){
                        commit("deleteFromTaskTable", taskObject.taskId);
                        commit("addToDoneTaskTable", taskObject);
                    } else{
                        commit("reviseTaskTable", taskObject);
                    }
                    resolve();
                })
                .catch(error => {
                    console.log(error);
                    commit("registerErrorInfo", error.response.status, error.response.statusText);
                    reject();
                });
            })
        },
        reviseDoneTask({commit, state}, taskObject) {
            taskObject.userId = state.userId;
            return new Promise((resolve, reject) => {
                axios({
                    method: "PUT",
                    url: `http://localhost:8080/task/update`,
                    data: taskObject,
                    _csrf: this.state.csrfToken,
                })
                .then(() => {
                    // 削除commit
                    // 追加commit
                    if(taskObject.deletedFlag === "1"){
                        commit("deleteFromDoneTaskTable", taskObject.taskId);
                        commit("addToDeletedTaskTable", taskObject);
                    }
                    resolve();
                })
                .catch(error => {
                    console.log(error);
                    commit("registerErrorInfo", error.response.status, error.response.statusText);
                    reject();
                });
            })
        },
        reflectTaskTableFromDb({commit}){
            axios({
                method: "GET",
                url: `http://localhost:8080/task/getNotYetTasks/1`,
                _csrf: this.state.csrfToken,
            })
            .then((taskObjectList) => {
                if(taskObjectList.data.length >= 1){
                    commit("reflectTaskTableFromDb", taskObjectList.data);
                }
            })
            .catch(error => {
                console.log(error);
                commit("registerErrorInfo", error.response.status, error.response.statusText);
            });
        },
        reflectDoneTaskTable({commit}){
            axios({
                method: "GET",
                url: `http://localhost:8080/task/getDoneTasks/1`,
                _csrf: this.state.csrfToken,
            })
            .then((taskObjectList) => {
                if(taskObjectList.data.length >= 1){
                    commit("reflectDoneTaskTableFromDb", taskObjectList.data);
                }
            })
            .catch(error => {
                console.log(error);
                commit("registerErrorInfo", error.response.status, error.response.statusText);
            });
        },
        reflectDeletedTaskTable({commit}){
            axios({
                method: "GET",
                url: `http://localhost:8080/task/getDeletedTasks/1`,
                _csrf: this.state.csrfToken,
            })
            .then((taskObjectList) => {
                if(taskObjectList.data.length >= 1){
                    commit("reflectDeletedTaskTableFromDb", taskObjectList.data);
                }
            })
            .catch(error => {
                console.log(error);
                commit("registerErrorInfo", error.response.status, error.response.statusText);
            });
        },
        createUesr({commit}, user){
            return new Promise((resolve, reject) => {
                axios({
                    method: "POST",
                    url: ``,
                    data: user,
                    _csrf: this.state.csrfToken,
                })
                .then((user) => {
                    commit("registerUser", user.data);
                    resolve();
                })
                .catch(error => {
                    console.log(error);
                    commit("registerErrorInfo", error.response.status, error.response.statusText);
                    reject();
                })
            })
        },
        login({commit}, preLoginFormData){
            let params = new URLSearchParams();
            params.append('mailAddress', preLoginFormData.mailAddress);
            params.append('password', preLoginFormData.password);
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: `http://localhost:8080/login`,
                    data: params,
                    _csrf: this.state.csrfToken,
                })
                .then((response) => {
                    commit("registerCsrfTokenByLogined", response.headers['XSRF-TOKEN']);
                    commit("refleshErrorInfo");
                    if (typeof preLoginFormData.redirectUrl === 'undefined' || preLoginFormData.redirectUrl === ''){
                        router.push('/taskTable')
                    } else{
                        router.push(preLoginFormData.redirectUrl)
                    }
                    resolve();
                })
                .catch(error => {
                    commit("registerErrorInfo", error.response.status, error.response.statusText);
                    reject();
                })
            })
        },
        getCsrfToken({commit}){
            axios({
                method: "GET",
                url: `http://localhost:8080/prelogin`,
            })
            .then((csrfToken) => {
                if(csrfToken != null){
                    commit("registerCsrfToken",
                    csrfToken.data);
                }
            })
            .catch(error => {
                // TODO: statusText も画面に表示したいのでバッチ側でエラー詳細を返すように追加する。
                commit("registerErrorInfo", error.response.status, error.response.statusText);
                // TODO: errorページを作成し、以下でrouter.pushを実行するようにする。
            })
        },
    },
})
