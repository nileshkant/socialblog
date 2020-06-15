import axios from 'axios'
import cheerio from 'cheerio'

export const embedObj = async (url) => {
  return await axios.get(`https://noembed.com/embed?url=${url}&maxwidth=500`)
}

export const websiteDetails = async (url) => {
  let post = null
  if (url.includes('twitter.com')) {
    const noEmbed = await embedObj(url)
    if (noEmbed && noEmbed.data) {
      post = { ...post, embedJson: noEmbed.data }
    }
  } else {
    const urlInfo = await axios.get(url)
    if (urlInfo && JSON.stringify(urlInfo.data)) {
      const $ = cheerio.load(urlInfo.data)
      post = {
        title: $('meta[name="title"]').text(),
        canonical: $('link[rel="canonical"]').attr('href'),
        description: $('meta[name="description"]').attr('content'),
        // Get OG Values
        og_title: $('meta[property="og:title"]').attr('content'),
        og_url: $('meta[property="og:url"]').attr('content'),
        og_img: $('meta[property="og:image"]').attr('content'),
        og_type: $('meta[property="og:type"]').attr('content'),
        og_video: $('meta[property="og:video"]').attr('content'),
        og_description: $('meta[property="og:description"]').attr('content'),
        // Get Twitter Values
        twitter_site: $('meta[name="twitter:site"]').attr('content'),
        twitter_domain: $('meta[name="twitter:domain"]').attr('content'),
        twitter_img_src: $('meta[name="twitter:image:src"]').attr('content'),
        // Get Facebook Values
        fb_appid: $('meta[property="fb:app_id"]').attr('content'),
        fb_pages: $('meta[property="fb:pages"]').attr('content')
      }
    }
  }
  return post
}
