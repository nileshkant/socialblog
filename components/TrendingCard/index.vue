<template>
  <v-card>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">Trends</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list class="py-0">
      <template v-for="(item, index) in items">
        <v-subheader
          v-if="item.header"
          :key="item.header"
          v-text="item.header"
        ></v-subheader>

        <v-divider
          v-if="item.divider"
          :key="index"
          :inset="item.inset"
        ></v-divider>

        <v-list-item v-else :key="item.title" @click="() => {}">
          <v-list-item-avatar>
            <span class="headline">#</span>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="item.title"></v-list-item-title>
            <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    items: [
      { title: 'Covid-19', subtitle: 'Find Latest Updates' },
      { divider: true, inset: false },
      { title: 'France', subtitle: 'Situation Updates' }
    ]
  })
}
</script>

<style></style>
