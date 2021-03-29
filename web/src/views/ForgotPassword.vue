<template>
  <v-flex class="forgot-password">
    <v-card
      class="d-flex flex-column align-center justify-center pl-6 pr-6 pb-6"
      width="50%"
    >
      <v-card-title>Forgot Password</v-card-title>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>
        <v-flex class="d-flex flex-row align-center">
          <v-dialog transition="dialog-top-transition" max-width="600">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate()"
              >
                Send email
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <!-- <v-toolbar color="primary" dark>Opening from the top</v-toolbar> -->
                <v-card-text>
                  <div class="text-p2 pa-12 d-flex justify-center align-center">
                    An email has been sended at {{ email }}
                  </div>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn text @click="dialog.value = false" to="/">Close</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
          <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>
        </v-flex>
      </v-form>
    </v-card>
  </v-flex>
</template>

<script>
import gql from "graphql-tag";
export default {
  data: () => ({
    email: "",
    valid: true,
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    check: false,
  }),
  computed: {
    isLogged() {
      return this.$store.state.users.isLogged;
    },
  },
  methods: {
    validate() {
      this.$apollo.mutate({
        mutation: gql`
          mutation forgotPassword($email: String!) {
            forgotPassword(email: $email)
          }
        `,
        variables: {
          email: this.email,
        },
      });
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style>
.forgot-password {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
