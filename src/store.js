import Vue from 'vue';
import Vuex from 'vuex';
import axios from './axios-settings.js';
import router from './router.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userId: 1,
        taskTable: [],
        taskIndexList: [],
        doneTaskTable: [],
        doneTaskIndexList: [],
        deletedTaskTable: [],
        deletedTaskIndexList: [],
        preLoginedCsrfToken: null,
        errorStatus: null,
        errorStatusText: null,
        // taskTable:[{
        //     taskId: 1,
        //     userId: 1,
        //     taskName: "画面作成",
        //     taskDetail: "修正・新規作成・削除機能の作成",
        //     doneFlag: 0,
        //     deletedFlag: 0,
        //     index: フロント側で設定する値。フロント側でのみ保持する。
        //   }]
    },
    getters: {
        taskTable: state => state.taskTable,
        doneTaskTable: state => state.doneTaskTable,
        deletedTaskTable: state => state.deletedTaskTable,
        errorStatus: state => state.errorStatus,
        errorStatusText: state => state.errorStatusText,
    },
    // 以下、mutationsとは、ここでしか値を変えられないようにするためのもの。
    mutations: {
        registerPreLoginedCsrfToken(state, preLoginedcsrfToken){
            state.preLoginedCsrfToken = preLoginedcsrfToken;
        },
        registerErrorInfo(state, errorInfo){
            state.errorStatus = errorInfo.errorStatus;
            state.errorStatusText = errorInfo.errorStatusText;
        },
        refleshErrorInfo(state){
            // 結局エラー内容は毎度上書きされるから要らないかも。
            state.errorStatus = '';
            state.errorStatusText = '';
        },
        reflectTaskTableFromDb(state, taskObjectList){
            // 配列を初期化
            state.taskTable = []
            taskObjectList.forEach((taskObject, index) => {
                state.taskIndexList.push(index);
                taskObject.index = index;
                state.taskTable.push(taskObject);
            })
        },
        reflectDoneTaskTableFromDb(state, doneTaskObjectList){
            // 配列を初期化
            state.doneTaskTable = []
            doneTaskObjectList.forEach((doneTaskObject, index) => {
                state.doneTaskIndexList.push(index);
                doneTaskObject.index = index;
                state.doneTaskTable.push(doneTaskObject);
            })
        },
        reflectDeletedTaskTableFromDb(state, deletedTaskObjectList){
            // 配列を初期化
            state.deletedTaskTable = []
            deletedTaskObjectList.forEach((deletedTaskObject, index) => {
                state.deletedTaskIndexList.push(index);
                deletedTaskObject.index = index;
                state.deletedTaskTable.push(deletedTaskObject);
            })
        },
        addToTaskTable(state, taskObject) {
            // stateにタスクを追加する前に、タスクオブジェクトにindexを追加している。
            // 理由:各オブジェクトごとに配列全体の何番目に位置するかを示すindexを与えていた方が、フロント側でタスク削除の管理しやすいから。(spliceメソッドが使いやすいから)
            if (state.taskIndexList.length === 0){
                // 最初のタスクのindexは0。
                taskObject.index = 0;
            } else{
                // 2つ目以降のタスクのindexは、indexList長と値になる。
                taskObject.index = state.taskIndexList.length;
            }
            state.taskTable.push(taskObject);
            state.taskIndexList.push(taskObject.index);
        },
        addToDoneTaskTable(state, doneTaskObject){
            if (state.doneTaskIndexList.length === 0){
                doneTaskObject.index = 0;
            } else{
                doneTaskObject.index = state.taskIndexList.length;
            }
            state.doneTaskTable.push(doneTaskObject);
            state.doneTaskIndexList.push(doneTaskObject.index);
        },
        addToDeletedTaskTable(state, deletedTaskObject){
            if (state.deletedTaskIndexList.length === 0){
                deletedTaskObject.index = 0;
            } else{
                deletedTaskObject.index = state.deletedTaskIndexList.length;
            }
            state.deletedTaskTable.push(deletedTaskObject);
            state.deletedTaskIndexList.push(deletedTaskObject.index);
        },
        reviseTaskTable(state, taskObject) {
            state.taskTable.splice(taskObject.index, 1, taskObject);
        },
        deleteFromTaskTable(state, deleteIndex) {
            state.taskTable.splice(deleteIndex, 1);

            // deleteIndexより前のindexと後のindexに分ける。後のindexに関してはそれぞれ-1する。
            let beforeIndexList = [];
            let afterIndexList = [];
            beforeIndexList = state.taskIndexList.filter(index => index < deleteIndex);
            afterIndexList = state.taskIndexList.filter(index => index > deleteIndex).map(index => index - 1);
            state.taskIndexList = beforeIndexList.concat(afterIndexList);

            let beforeTaskTable = [];
            let afterTaskTable = [];
            beforeTaskTable = state.taskTable.filter(task => task.index < deleteIndex);
            afterTaskTable = state.taskTable.filter(task => task.index > deleteIndex);
            let updatedAfterTaskTable = [];
            for (let afterTask of afterTaskTable){
                // memo:mapを使ってもうまく書く要素データ加工できる。
                // pref:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map#using_map_to_reformat_objects_in_an_array
                afterTask.index = afterTask.index - 1;
                updatedAfterTaskTable.push(afterTask);
            }
            state.taskTable = beforeTaskTable.concat(updatedAfterTaskTable);
        },
        deleteFromDoneTaskTable(state, deleteIndex) {
            state.doneTaskTable.splice(deleteIndex, 1);

            // TODO: deleteのチェックマークついていてもいなくても削除で更新されてしまう挙動を修正
            // TODO: 削除した次のタスクにチェックマークがついた状態のままになってしまう挙動を修正。
            let beforeDoneTaskIndexList = []
            let afterDoneTaskIndexList = []
            beforeDoneTaskIndexList = state.doneTaskIndexList.filter(index => index < deleteIndex);
            afterDoneTaskIndexList = state.doneTaskIndexList.filter(index => index > deleteIndex).map(index => index - 1);
            state.doneTaskIndexList = beforeDoneTaskIndexList.concat(afterDoneTaskIndexList);

            let beforeDoneTaskTable = []
            let afterDoneTaskTable = []
            beforeDoneTaskTable = state.doneTaskTable.filter(task => task.index < deleteIndex);
            afterDoneTaskTable = state.doneTaskTable.filter(task => task.index > deleteIndex);
            let updatedAfterDoneTaskTable = []
            for (let afterDoneTask of afterDoneTaskTable) {
                afterDoneTask.index = afterDoneTask.index - 1;
                updatedAfterDoneTaskTable.push(afterDoneTask);
            }
            state.doneTaskTable = beforeDoneTaskTable.concat(updatedAfterDoneTaskTable);
        }
    },
    actions: {
        addTask({dispatch, commit, state}, taskObject) {
            taskObject.userId = state.userId;
            return new Promise((resolve, reject) => {
                axios({
                    method: "POST",
                    url: `http://localhost:8080/task/insert`,
                    data: taskObject,
                })
                .then(() => {
                    commit("addToTaskTable", taskObject);
                    resolve();
                })
                .catch(error => {
                    console.log(error);
                    if (error !== null && error.response !== undefined){
                        if (error.response.status === 401 || error.response.status === 403){
                            dispatch('getCsrfToken')
                            router.push('preLogin')
                        }
                        commit("registerErrorInfo", {errorStatus:error.response.status,  errorStatusText:error.response.statusText});
                    }
                    reject();
                });
            })
        },
        reviseTask({dispatch, commit, state}, taskObject) {
            taskObject.userId = state.userId;
            return new Promise((resolve, reject) => {
                axios({
                    method: "PUT",
                    url: `http://localhost:8080/task/update`,
                    data: taskObject,
                })
                .then(() => {
                    // 削除commit
                    // 追加commit
                    if(taskObject.deletedFlag === "1"){
                        commit("deleteFromTaskTable", taskObject.index);
                        commit("addToDeletedTaskTable", taskObject);
                    } else if(taskObject.doneFlag === "1"){
                        commit("deleteFromTaskTable", taskObject.index);
                        commit("addToDoneTaskTable", taskObject);
                    } else{
                        commit("reviseTaskTable", taskObject);
                    }
                    resolve();
                })
                .catch(error => {
                    console.log(error);
                    if (error !== null && error.response !== undefined){
                        if (error.response.status === 401 || error.response.status === 403){
                            dispatch('getCsrfToken')
                            router.push('preLogin')
                        }
                        commit("registerErrorInfo", {errorStatus:error.response.status,  errorStatusText:error.response.statusText});
                    }
                    // TODO: せっかくステータスコードもエラー内容も返ってきているのでこれをtoastで表示させる。
                    reject();
                });
            })
        },
        reviseDoneTask({dispatch, commit, state}, taskObject) {
            taskObject.userId = state.userId;
            return new Promise((resolve, reject) => {
                axios({
                    method: "PUT",
                    url: `http://localhost:8080/task/update`,
                    data: taskObject,
                })
                .then(() => {
                    // 削除commit
                    // 追加commit
                    if(taskObject.deletedFlag === "1"){
                        commit("deleteFromDoneTaskTable", taskObject.index);
                        commit("addToDeletedTaskTable", taskObject);
                    }
                    resolve();
                })
                .catch(error => {
                    console.log(error);
                    if (error !== null && error.response !== undefined){
                        if (error.response.status === 401 || error.response.status === 403){
                            dispatch('getCsrfToken')
                            router.push('preLogin')
                        }
                        commit("registerErrorInfo", {errorStatus:error.response.status,  errorStatusText:error.response.statusText});
                    }
                    reject();
                });
            })
        },
        reflectTaskTableFromDb({dispatch, commit}){
            axios({
                method: "GET",
                url: `http://localhost:8080/task/getNotYetTasks/1`,
            })
            .then((taskObjectList) => {
                if(taskObjectList.data.length >= 1){
                    commit("reflectTaskTableFromDb", taskObjectList.data);
                }
            })
            .catch(error => {
                console.log(error);
                if (error !== null && error.response !== undefined){
                    if (error.response.status === 401 || error.response.status === 403){
                        dispatch('getCsrfToken')
                        router.push('preLogin')
                    }
                    commit("registerErrorInfo", {errorStatus:error.response.status,  errorStatusText:error.response.statusText});
                }
            });
        },
        reflectDoneTaskTable({dispatch, commit}){
            axios({
                method: "GET",
                url: `http://localhost:8080/task/getDoneTasks/1`,
            })
            .then((taskObjectList) => {
                if(taskObjectList.data.length >= 1){
                    commit("reflectDoneTaskTableFromDb", taskObjectList.data);
                }
            })
            .catch(error => {
                console.log(error);
                if (error !== null && error.response !== undefined){
                    if (error.response.status === 401 || error.response.status === 403){
                        dispatch('getCsrfToken')
                        router.push('preLogin')
                    }
                    commit("registerErrorInfo", {errorStatus:error.response.status,  errorStatusText:error.response.statusText});
                }
            });
        },
        reflectDeletedTaskTable({dispatch, commit}){
            axios({
                method: "GET",
                url: `http://localhost:8080/task/getDeletedTasks/1`,
            })
            .then((taskObjectList) => {
                if(taskObjectList.data.length >= 1){
                    commit("reflectDeletedTaskTableFromDb", taskObjectList.data);
                }
            })
            .catch(error => {
                console.log(error);
                if (error !== null && error.response !== undefined){
                    if (error.response.status === 401 || error.response.status === 403){
                        dispatch('getCsrfToken')
                        router.push('preLogin')
                    }
                    commit("registerErrorInfo", {errorStatus:error.response.status,  errorStatusText:error.response.statusText});
                }
            });
        },
        createUesr({dispatch, commit}, user){
            return new Promise((resolve, reject) => {
                axios({
                    method: "POST",
                    url: ``,
                    data: user,
                })
                .then((user) => {
                    commit("registerUser", user.data);
                    resolve();
                })
                .catch(error => {
                    console.log(error);
                    if (error !== null && error.response !== undefined){
                        if (error.response.status === 401 || error.response.status === 403){
                            dispatch('getCsrfToken')
                            router.push('preLogin')
                        }
                        commit("registerErrorInfo", {errorStatus:error.response.status,  errorStatusText:error.response.statusText});
                    }
                    reject();
                })
            })
        },
        login({dispatch, commit}, preLoginFormData){
            let params = new URLSearchParams();
            params.append('mailAddress', preLoginFormData.mailAddress);
            params.append('password', preLoginFormData.password);
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: `http://localhost:8080/login`,
                    data: params,
                    _csrf: this.state.preLoginedCsrfToken,
                })
                .then(() => {
                    commit("refleshErrorInfo");
                    if (typeof preLoginFormData.redirectUrl === 'undefined' || preLoginFormData.redirectUrl === ''){
                        router.push('/taskTable')
                    } else{
                        router.push(preLoginFormData.redirectUrl)
                    }
                    resolve();
                })
                .catch(error => {
                    if(this.state.preLoginedCsrfToken === null){
                        dispatch('getCsrfToken');
                    }
                    if (error !== null && error.response !== undefined){
                        commit("registerErrorInfo", {errorStatus:error.response.status,  errorStatusText:error.response.statusText});
                    }
                    reject();
                })
            })
        },
        getCsrfToken({commit}){
            return new Promise((resolve, reject) => {
                axios({
                    method: "GET",
                    url: `http://localhost:8080/prelogin`,
                })
                .then((csrfToken) => {
                    if(csrfToken != null){
                        commit("registerPreLoginedCsrfToken",
                        csrfToken.data);
                    }
                    resolve();
                })
                .catch(error => {
                    // TODO: statusText も画面に表示したいのでバッチ側でエラー詳細を返すように追加する。
                    if (error !== null && error.response !== undefined){
                        commit("registerErrorInfo", {errorStatus:error.response.status,  errorStatusText:error.response.statusText});
                    } else {
                        // elseの場合は、サーバーからerror自体返ってきていないため、サーバー接続エラーと判定している。
                        // TODO:vue.js側でNetwork Errorを検知する方法を調べたほうが良い。
                        commit("registerErrorInfo", {errorStatus:500,  errorStatusText:"サーバー接続エラー。"});
                    }
                    router.push('error')
                    reject();
                })
            })
        },
    },
})
