<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      md6
    >
      <v-text-field
        v-model="search"
        label="Search"
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
        class="ma-3"
      />
      <v-treeview
        v-model="tree"
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
            @click="setDisplay(item.path, item.filetype)"
          >{{ item.name }}</span>
        </template>
      </v-treeview>
    </v-flex>
    <v-flex
      xs12
      md6
    >
      <VideoPlayer
        v-if="displaytype === 'video'"
        :source="displaysource"
      />
      <ImageViewer
        v-if="displaytype === 'image'"
        :source="displaysource"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import VideoPlayer from '../components/VideoPlayer'
import ImageViewer from '../components/ImageViewer'

export default {
  name: 'BrowseRoute',
  components: {
    VideoPlayer,
    ImageViewer,
  },
  data () {
    return {
      loading: true,
      search: '',
      items: [],
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
          name: 'movies-skyline.dyndns.tv/SeriesTVS/',
          url: 'http://localhost:3000/?url=https://movies-skyline.dyndns.tv/SeriesTVS/',
        },
      ],
      displaysource: '',
      displaytype: '',
    }
  },
  async mounted () {
    await this.fetchAllFolders()
  },
  methods: {
    setDisplay (source, filetype) {
      if (!source) return
      const types = {
        html: 'text',
        js: 'text',
        json: 'text',
        md: 'text',
        pdf: 'pdf',
        png: 'image',
        jpg: 'image',
        jpeg: 'image',
        txt: 'text',
        mp3: 'music',
        mp4: 'video',
        mkv: 'video',
      }
      if (types[filetype]) {
        this.displaysource = source
        this.displaytype = types[filetype]
      }
    },
    async fetchFolder (url) { 
      try {
        if (url.substr(-1, 1) !== '/') url += '/'
        console.log(url)

        const folderName = url.match(/.+\/(.+)\//i)[1]
        const html = await axios(url, {
          method: 'GET',
          mode: 'no-cors',
          withCredentials: false,
        })
        const parsed1 = html.data.match(/href="(.+?)"/mgi)
        const parsed2 = parsed1.map(el => el.slice(6, -1))

        const folders = parsed2.filter(el => el !== '../' && el.substr(-1) === '/')
        const files = parsed2.filter(el => el.substr(-1) !== '/').map(el => { 
          return {
            name: decodeURI(el), 
            filetype: el.substr((Math.max(0, el.lastIndexOf('.')) || Infinity) + 1),
            path: url + el,
          } 
        })
        
        let populatedFolders = []

        for (const i in folders) {
          if (folders.hasOwnProperty(i)) {
            const folderUrl = url + folders[i]
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
    },
  },
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
