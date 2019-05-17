<template>
  <pre>
    <code>{{scannedFoldersCount}}</code>
    <code>{{JSON.stringify(filetree, null, 2)}}</code>
  </pre>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Browse-route',
  data () {
    return {
      loading: true,
      filetree: [],
      scannedFoldersCount: 0,
      sources: [
        {
          name: 'dl.upfdl.com',
          url: 'https://cors.io/?http://dl.upfdl.com/files/Film/'
        },
      ]
    }
  },
  computed: {

  },
  methods: {
    async fetchFolder (url) { 
      try {
        if (url.substr(-1, 1) !== '/') url += '/'
        this.scannedFoldersCount++
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
        const files = parsed2.filter(el => el.substr(-1) !== '/')
        
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
          name: folderName,
          files,
          folders: populatedFolders 
        }

      } catch (error) { console.error(error) }
    },
    timer (ms) {
      return new Promise((resolve, reject) => setTimeout(resolve, ms))
    },
  },
  async mounted () {
    this.loading = true
    for (const i in this.sources) {
      if (this.sources.hasOwnProperty(i)) {
        const source = this.sources[i].url
        const data = await this.fetchFolder(source)
        this.filetree.push(data)
        await this.timer(0.1)
      }
    }
    this.loading = false
  }
}
</script>

<style>

</style>
