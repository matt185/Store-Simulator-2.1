<template>
  <v-card class="pl-6 pr-6 pb-6">
    <v-card-title>Register</v-card-title>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="input.username"
        :counter="4"
        :rules="nameRules"
        label="Username"
        required
      ></v-text-field>

      <v-text-field
        v-model="input.email"
        :rules="emailRules"
        label="E-mail"
        required
      ></v-text-field>

      <v-text-field
        v-model="input.phone"
        :counter="13"
        :rules="phoneNumberRule"
        label="Phone Number"
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

      <v-select
        v-model="input.role"
        :items="items"
        :rules="[(v) => !!v || 'Item is required']"
        label="Role"
        required
      ></v-select>

      <v-checkbox
        v-model="checkbox"
        :rules="[(v) => !!v || 'You must agree to continue!']"
        label="Confirm"
        required
      ></v-checkbox>

      <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate(input)">
        Validate
      </v-btn>

      <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>

      <v-btn color="warning" @click="resetValidation"> Reset Validation </v-btn>
    </v-form>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    input: {
      username: "",
      email: "",
      phone: "",
      password: "",
      role: "customer",
    },
    valid: true,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    passwordRule: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 4) || "The password must more than 4 characters",
    ],
    phoneNumberRule: [
      (v) => !!v || "Phone Number is required",
      (v) => (v && v.length === 13) || "Phone number must be 14 characters",
    ],
    items: ["customer", "manager", "admin", "master"],
    checkbox: false,
  }),

  methods: {
    validate(data) {
      this.$store.dispatch("user/register", data);
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>

<style></style>
