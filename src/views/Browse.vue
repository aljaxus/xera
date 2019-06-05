<template>
  <v-layout row wrap>
    <v-flex xs12 md6>
      <v-text-field
        v-model="search"
        label="Search"
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
        class="ma-3"
      ></v-text-field>
      <v-treeview
        v-model="tree"
        :open="open"
        :items="items"
        :search="search"
        transition
        item-key="name"
        open-on-click
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="!item.filetype">
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>
          <v-icon v-else>
            {{ files[item.filetype] ? files[item.filetype] : files['placeholder'] }}
          </v-icon>
        </template>
        <template v-slot:label="{ item, open }">
          <span 
            v-if="['mp4', 'mkv'].includes(item.filetype)"
            @click="videosource = item.path"
          >{{ item.name }}</span>
          
          <span v-else>{{ item.name }}</span>
        </template>
      </v-treeview>
    </v-flex>
    <v-flex xs12 md6>
      <video id="video-id" width="100%" height="100%">
        <source :src="videosource" type="video/mp4"/>
      </video>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Browse-route',
  data () {
    return {
      loading: true,
      search: '',
      items: [],
      open: [],
      tree: [],
      files: {
        placeholder: 'mdi-file',
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-json',
        md: 'mdi-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        jpg: 'mdi-file-image',
        jpeg: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
        mp3: 'mdi-file-music',
        mp4: 'mdi-file-video',
        mkv: 'mdi-file-video',
      },
      sources: [
        {
          name: '192.168.1.100:8003',
          url: 'http://192.168.1.100:8003'
        },
      ],
      videosource: '',
      videoplayer: null,
    }
  },
  watch: {
    videosource (newval, oldval) {
      this.videoplayer = null
      this.videoplayer = fluidPlayer('video-id', {
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
  },
  computed: {

  },
  methods: {
    async fetchFolder (url) { 
      try {
        if (url.substr(-1, 1) !== '/') url += '/'
        console.log(url)

        const folderName = url.match(/.+\/(.+)\//i)[1]
        const html = await axios(url, {
          method: 'GET',
          mode: 'no-cors',
          withCredentials: false
        })
        const parsed1 = html.data.match(/href="(.+?)"/mgi)
        const parsed2 = parsed1.map(el => el.slice(6, -1))

        const folders = parsed2.filter(el => el !== '../' && el.substr(-1) === '/')
        const files = parsed2.filter(el => el.substr(-1) !== '/').map(el => { 
          return {
            name: decodeURI(el), 
            filetype: el.substr((Math.max(0, el.lastIndexOf(".")) || Infinity) + 1),
            path: url+el,
          } 
        })
        
        let populatedFolders = []

        for (const i in folders) {
          if (folders.hasOwnProperty(i)) {
            const folderUrl = url+folders[i]
            const folderData = await this.fetchFolder(folderUrl)
            populatedFolders.push(folderData)

            await this.timer(0.1)
          }
        }



        return {
          name: decodeURI(folderName),
          children: populatedFolders.concat(files),
          path: url,
        }

      } catch (error) { console.error(error) }
    },
    timer (ms) {
      return new Promise((resolve, reject) => setTimeout(resolve, ms))
    },
    async fetchAllFolders () {
      this.loading = true
      for (const i in this.sources) {
        if (this.sources.hasOwnProperty(i)) {
          const source = this.sources[i].url
          const data = await this.fetchFolder(source)
          this.items.push(data)
          await this.timer(0.1)
        }
      }
      this.loading = false
    }
  },
  async mounted () {
    await this.fetchAllFolders()
  }
}
</script>

<style>
.v-treeview .v-icon {
  font-size: 18px !important;
}
.v-treeview .v-treeview-node__label {
  font-size: .9em !important;
  line-height: 1 !important;
} 
.v-treeview .v-treeview-node__root {
  min-height: 24px;
}
.v-treeview .v-treeview-node__children .v-treeview-node--click.v-treeview-node--leaf {
  margin-left: 32px;
}
.v-treeview .v-treeview-node__children .v-treeview-node--click:not(.v-treeview-node--leaf) {
  margin-left: 14px;
}
</style>
