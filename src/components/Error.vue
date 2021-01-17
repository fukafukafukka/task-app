<template>
  <div>
    <h3>error page</h3>
    <div v-if="errorStatus" class="error">
      <div>errorStatus: {{errorStatus}}</div>
    </div>
    <div v-if="errorStatusText" class="error">
      <div>errorStatusText: {{errorStatusText}}</div>
    </div>
    <div>
      <input type="button" @click="moveToPreLogin()" value="ログイン画面へ">
    </div>
  </div>
</template>

<script>
import router from '../router.js';

export default {
  data: function() {
    return {
    }
  },
  computed: {
    errorStatus() {
      return this.$store.getters.errorStatus;
    },
    errorStatusText() {
      return this.$store.getters.errorStatusText;
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
    moveToPreLogin() {
      this.$store.dispatch('getCsrfToken')
      .then(() => {
        this.success('got csrf-token!');
        // 上記のdispatchでcsrf-token取得後に、下記ルーティング先のログイン画面に遷移する。
        router.push('preLogin');
      })
      .catch(() => {
        this.error('failed to got csrf-token');
      });
    }
  },
}
</script>

<style scoped>
</style>