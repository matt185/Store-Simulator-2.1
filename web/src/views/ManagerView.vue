<template>
  <!-- <v-flex class="manager d-flex flex-wrap justify-center align-center">
    <UserView />
    <Agenda />
    <ItemManager /> -->
  <v-tabs fixed-tabs>
    <v-tab href="#user"> User </v-tab>
    <v-tab href="#agenda">Agenda</v-tab>
    <v-tab href="#item">Product</v-tab>
    <v-tab-item value="user"> <UserView /> </v-tab-item>
    <v-tab-item value="agenda"> <Agenda /> </v-tab-item>
    <v-tab-item value="item"> <ItemManager /> </v-tab-item>
  </v-tabs>
  <!-- </v-flex> -->
</template>

<script>
import UserView from "../components/manager/UsersView";
import Agenda from "../components/manager/Agenda";
import ItemManager from "../components/manager/ItemManager";
export default {
  components: { UserView, Agenda, ItemManager },
};
</script>

<style>
.manager {
  height: 100%;
}
.v-application .primary--text {
  color: rgb(60, 59, 59) !important;
}
</style>
