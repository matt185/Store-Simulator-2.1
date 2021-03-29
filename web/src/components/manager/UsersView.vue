<template>
  <v-flex class="d-flex align-center justify-center flex-column">
    <h1>User manager</h1>
    <v-flex class="searchField">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-flex>
    <v-data-table class="table" :headers="headers" :items="users" :search="search">
      <template v-slot:item="row">
        <tr>
          <td>{{ row.item.id }}</td>
          <td>{{ row.item.username }}</td>
          <td>{{ row.item.phone }}</td>
          <td>{{ row.item.role }}</td>
          <td>{{ row.item.createdAt }}</td>
          <td>{{ row.item.updatedAt }}</td>
          <td>
            <v-btn
              class="mx-2 btn"
              fab
              dark
              small
              color="gray"
              @click="onButtonClick(row.item)"
            >
              <v-icon dark>mdi-lead-pencil</v-icon>
            </v-btn>
            <v-btn
              class="mx-2 btn"
              fab
              dark
              small
              color="gray"
              @click="onButtonClick(row.item)"
            >
              <v-icon dark>mdi-trash-can-outline</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-flex>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "id",
          align: "start",
          filterable: false,
          value: "id",
        },
        { text: "Username", value: "username" },

        { text: "PhoneNumber", value: "phone" },
        { text: "role", value: "role" },
        { text: "createdAt", value: "createdAt" },
        { text: "updatedAt", value: "updatedAt" },
        { text: "", value: "" },
      ],
    };
  },
  created() {
    this.$store.dispatch("users/users");
  },
  computed: {
    users() {
      return this.$store.state.users.users;
    },
  },
};
</script>

<style scoped>
.searchField {
  width: 50%;
}
.table {
  width: 90%;
}
</style>
