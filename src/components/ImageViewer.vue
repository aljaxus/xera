<template>
  <v-layout row wrap>
    <v-flex xs12 class="mt-1 centering">
      <img
        :src="source"
        :lazy-src="source"
        :alt="encodeURI(source)"
      />
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  name: 'ImageVidwer',
  props: {
    source: {
      type: String,
      required: true,
    },
  },
  methods: {
    encodeURI: (source) => encodeURI(source),
  }
}
</script>
<style scoped>
.centereing {
  text-align: center;
}
</style>
