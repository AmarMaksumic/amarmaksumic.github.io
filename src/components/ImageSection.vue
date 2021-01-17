<template>
  <section :style="{'background-image':'url(/src/assets/' + `${img_src}` + ')'}">
    test
    {{ img_src }}
  </section>
</template>

<script>
export default {
  name: 'ImageSection',
  props: {
    img_src: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
