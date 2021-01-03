<template>
  <div>
    <div>
      <label>mail_address:</label>
      <input type="text" v-model="mailAddress">
    </div>
    <div>
      <label>password:</label>
      <input type="text" v-model="password">
    </div>
    <div v-if="errorStatus" class="error">
      <div>errorStatus: {{errorStatus}}</div>
    </div>
    <div v-if="errorStatusText" class="error">
      <div>errorStatusText: {{errorStatusText}}</div>
    </div>
    <div>
      <input type="button" @click="login()" value="ログイン">
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      mailAddress: '',
      password: '',
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
    login() {
      this.$store.dispatch('login', {
        mailAddress: this.mailAddress,
        password: this.password,
        redirectUrl: this.$route.query.redirect,
      })
      .then(() => {
        this.success('logined!');
      })
      .catch(() => {
        this.error('failed to login');
      });
    }
  },
}
</script>

<style scoped>
</style>