<template>
  <div
    v-if="display"
    width="100%"
    height="100%"
    class="maindiv"
  >
    <video
      id="video-id"
      width="100%"
      height="100%"
    >
      <source
        :src="source"
        type="video/mp4"
      >
    </video>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  props: {
    source: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      player: null,
      display: false,
    }
  },
  watch: {
    source (newval, oldval) {
      if (newval === oldval) return
      if (!newval || String(newval).length === 0) { this.player.pause() }
      if (newval) { this.loadPlayer() }
    },
  },
  mounted () { this.loadPlayer() },
  methods: {
    loadPlayer () {
      this.display = false
      this.player = null
      this.$nextTick(() => {
        // Add the component back in
        this.display = true
        this.$nextTick(() => {
          // eslint-disable-next-line no-undef
          this.player = fluidPlayer('video-id', {
            layoutControls: {
              fillToContainer: false,
              primaryColor: false,
              posterImage: false,
              autoPlay: true,
              playButtonShowing: true,
              playPauseAnimation: true,
              mute: false,
              logo: {
                imageUrl: null,
                position: 'top left',
                clickUrl: null,
                opacity: 1,
                mouseOverImageUrl: null,
                imageMargin: '2px',
                hideWithControls: false,
                showOverAds: false,
              },
              allowDownload: true,
              allowTheatre: true,
              playbackRateEnabled: false,
              controlBar: {
                autoHide: true,
                autoHideTimeout: 3,
                animated: true,
              },
            },
          })
        })
      })
    },
  },
}
</script>
<style scoped>
.maindiv {
  overflow: hidden !important;
}
</style>
