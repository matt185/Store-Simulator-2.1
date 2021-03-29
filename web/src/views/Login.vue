<template>
  <v-flex class="login">
    <v-card
      class="d-flex flex-column align-center justify-center pl-6 pr-6 pb-6"
      width="50%"
    >
      <v-card-title>Login</v-card-title>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="input.usernameOrEmail"
          :counter="4"
          :rules="nameRules"
          label="Username"
          required
        ></v-text-field>

        <v-text-field
          type="password"
          v-model="input.password"
          :counter="4"
          :rules="passwordRule"
          label="Password"
          required
        ></v-text-field>
        <v-flex class="d-flex flex-column align-center">
          <v-flex class="d-flex flex-row">
            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="validate(input)"
            >
              Validate
            </v-btn>

            <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>
          </v-flex>
          <a href=""><router-link to="/forgot-password">forgot password?</router-link></a>
        </v-flex>
      </v-form>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  data: () => ({
    input: {
      usernameOrEmail: "",
      password: "",
    },
    valid: true,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    passwordRule: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 4) || "The password must more than 4 characters",
    ],
    checkbox: false,
  }),

  methods: {
    validate(data) {
      this.$store.dispatch("users/login", data);
      this.$router.push("/");
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
