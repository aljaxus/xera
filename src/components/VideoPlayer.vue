<template>
  <v-dialog
    v-model="leopen"
    max-width="unset"
    transition="dialog-transition"
  >
    <video id="video-id" width="100%" height="100%">
      <source :src="source" type="video/mp4"/>
    </video>
  </v-dialog>
</template>

<script>
export default {
  name: 'VideoPlayer',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    source: {
      type: String,
      required: true,
    }
  },
  data () {return {
    player: null,
  }},
  watch: {
    open (newval, oldval) {
      if (newval === false) { this.player.pause() }
      if (newval === true) { this.loadPlayer() }
    }
  },
  computed: {
    leopen: {
      get () { return this.open },
      set (val) { if (val === false) this.$emit('close', true) },
    },
  },
  methods: {
    loadPlayer () {
      this.player = null
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
            showOverAds: false
          },
          allowDownload: true,
          allowTheatre: true,
          playbackRateEnabled: false,
          controlBar: {
            autoHide: true,
            autoHideTimeout: 3,
            animated: true
          },
        }
      })
    }
  }
}
</script>

<style>

</style>
