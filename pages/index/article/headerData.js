const storyHeader = (article) => {
  let header = {}
  switch (article.articleType) {
    case 'quoteCard':
      header = {
        titleTemplate: article.quoteCard.title,
        meta: [
          {
            hid: 'og:title',
            name: 'og:title',
            content: article.quoteCard.title
          },
          {
            hid: 'description',
            name: 'description',
            content: article.quoteCard.quote
          },
          {
            hid: 'og:description',
            name: 'og:description',
            content: article.quoteCard.quote
          },
          {
            hid: 'og:image',
            name: 'og:image',
            content: ''
          }
        ]
      }
      break
    case 'fullDetailsCard':
      header = {
        titleTemplate: article.fullDetailsCard.title,
        meta: [
          {
            hid: 'og:title',
            name: 'og:title',
            content: article.fullDetailsCard.title
          },
          {
            hid: 'description',
            name: 'description',
            content: article.fullDetailsCard.quote
          },
          {
            hid: 'og:description',
            name: 'og:description',
            content: article.fullDetailsCard.quote
          },
          {
            hid: 'og:image',
            name: 'og:image',
            content: article.fullDetailsCard.mediaUrl || ''
          }
        ]
      }
      break
    case 'movieReviewCard':
      header = {
        titleTemplate: article.movieReviewCard.Title,
        meta: [
          {
            hid: 'og:title',
            name: 'og:title',
            content: article.movieReviewCard.Title
          },
          {
            hid: 'description',
            name: 'description',
            content: article.movieReviewCard.Plot
          },
          {
            hid: 'og:description',
            name: 'og:description',
            content: article.movieReviewCard.Plot
          },
          {
            hid: 'og:image',
            name: 'og:image',
            content: article.movieReviewCard.Poster
          }
        ]
      }
      break
    default:
      header = {}
      break
  }
  console.log('header', header)

  return header
}

export default storyHeader
