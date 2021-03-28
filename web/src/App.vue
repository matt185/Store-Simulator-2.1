<template>
  <v-app>
    <v-app-bar color="grey darken-4 accent-4" dense dark max-height="50px">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Page title</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>
    <v-flex class="d-flex flex-row">
      <v-navigation-drawer v-if="drawer" v-model="drawer">
        <v-list nav dense>
          <v-list-item-group
            v-model="group"
            active-class="grey lighten-3--text text--accent-4"
          >
            <v-list-item v-for="item in menuList" :key="item.name">
              <router-link class="d-flex flex-row" :to="item.link">
                <v-list-item-icon>
                  <v-icon @click="logout(item.name)">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title @click="logout(item.name)">{{
                  item.name
                }}</v-list-item-title>
              </router-link>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <router-view />
      </v-main>
    </v-flex>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import menuList from "./utils/menuList";
export default {
  name: "App",

  components: {
    HelloWorld,
  },

  data: () => ({
    drawer: false,
    group: null,
  }),
  computed: {
    menuList() {
      return menuList;
    },
  },
  methods: {
    logout(item) {
      if (item === "logout") {
        this.$store.dispatch("users/logout");
      }
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
.v-application a {
  color: rgb(73, 73, 73);
}
</style>
