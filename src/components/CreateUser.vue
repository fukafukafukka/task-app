<template>
  <div>
    <div class="sending" v-if="sending">
      Sending...
    </div>
    <div>
      <label>名前:</label>
      <input type="text" v-model="userName">
    </div>
    <div>
      <label>説明文:</label>
      <input type="text" v-model="userDescription">
    </div>
    <div v-if="error" class="error">
      {{error}}
    </div>
    <div>
      <input type="button" @click="createUser" value="送信">
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      userName: '',
      userDescription: '',
    }
  },
  methods: {
    createUser() {
      this.$store.dispatch('createUser', {
        name: "name",
        mailAddress: "mail",
        pass: "pass"
      })
      .then(() => {
        this.success('task revised!');
      })
      .catch(() => {
        this.error('failed to revise task');
      });
    }
  },
}
</script>

<style scoped>
</style>