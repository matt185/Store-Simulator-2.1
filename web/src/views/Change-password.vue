<template>
  <v-flex class="change-password">
    <v-card
      class="d-flex flex-column align-center justify-center pl-6 pr-6 pb-6"
      width="50%"
    >
      <v-card-title>Update Password</v-card-title>
      <v-form ref="form" v-model="valid" lazy-validation>
        <p v-if="this.$store.state.users.user.errors">
          Token expired for a new one click
          <router-link to="/forgot-password"> here </router-link>
        </p>
        <v-text-field
          v-else
          type="password"
          v-model="input.newPassword"
          :rules="passwordRule"
          label="Password"
          required
        ></v-text-field>
        <!-- <p v-else> Token expired</p> -->
        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="validate(input.newPassword)"
        >
          Validate
        </v-btn>
        <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>
      </v-form>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  props: ["token"],
  data: () => ({
    input: {
      newPassword: "",
      error: "",
    },
    valid: true,
    passwordRule: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 4) || "The password must more than 4 characters",
    ],
  }),
  computed: {
    isLogged() {
      return this.$store.state.users.isLogged;
    },
  },
  methods: {
    validate(data) {
      const input = { token: this.token, newPassword: data };
      this.$store.dispatch("users/changePsw", input);
      if (!this.$store.state.users.user.user) {
        this.$router.push("/");
      }
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style>
.change-password {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
