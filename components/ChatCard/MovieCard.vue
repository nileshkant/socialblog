<template>
  <div
    :class="
      $route.name === 'index-article-id' ||
      (cardcontent && socialShare === cardcontent._id)
        ? ''
        : 'cursor-pointer'
    "
    @click="linkToPost"
  >
    <v-card class="mt-4 mx-auto">
      <div v-if="cardcontent.movieReviewCard">
        <v-row class="ma-0">
          <v-col cols="6">
            <div class="title">
              {{ cardcontent.movieReviewCard.Title }}
              <span class="text--secondary caption">
                {{ cardcontent.movieReviewCard.Year }}
              </span>
            </div>
            <div class="caption text-capitalize">
              {{ cardcontent.movieReviewCard.Type }} -
              {{ cardcontent.movieReviewCard.Language }}
            </div>
            <div class="caption font-weight-bold mt-1">
              Genre
            </div>
            <div class="caption">
              <!-- <v-chip
            v-for="genre in cardcontent.movieReviewCard.Genre.split(',')"
            :key="genre"
            small
            class="mr-1 mb-1"
          >
            {{ genre }}
          </v-chip> -->
              {{ cardcontent.movieReviewCard.Genre }}
            </div>
            <div class="caption font-weight-bold mt-1">
              Casts
            </div>
            <div class="caption">
              {{ cardcontent.movieReviewCard.Actors }}
            </div>
            <!-- <div class="caption font-weight-bold mt-1">
            TOS users' rating
          </div>
          <div>
            <v-rating
              v-model="cardcontent.movieReviewCard.OurRating"
              half-increments
            ></v-rating>
          </div> -->
          </v-col>
          <v-col cols="6">
            <v-sheet
              elevation="12"
              class="v-sheet--offset mx-auto rounded-image"
            >
              <v-img
                class="rounded-image"
                height="230"
                :src="cardcontent.movieReviewCard.Poster"
              >
              </v-img>
            </v-sheet>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row class="mx-0">
          <v-col
            v-for="rating in cardcontent.movieReviewCard.Ratings"
            :key="rating.Source"
          >
            <div class="font-weight-bold">
              {{ rating.Value }}
            </div>
            <div class="caption">
              {{ ratingSource(rating.Source) }}
            </div>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row class="mx-0">
          <v-col>
            <div class="caption font-weight-bold">
              Summary
            </div>
            <div class="caption font-weight-regular">
              {{ cardcontent.movieReviewCard.Plot }}
            </div>
          </v-col>
        </v-row>
        <CardAction
          :cardcontent="cardcontent"
          :share-data="cardcontent._id && shareData()"
          @socialShare="socialModal"
        >
        </CardAction>
      </div>
      <div v-else>
        <MovieReviewSkeleton />
      </div>
    </v-card>
  </div>
</template>
<script>
import MovieReviewSkeleton from '../LoadingSkeleton/movieSkeleton'
import CardAction from './commonAction/cardAction'

export default {
  components: {
    CardAction,
    MovieReviewSkeleton
  },
  props: {
    cardcontent: {
      type: Object,
      default: () => ({
        Title: '1917',
        Year: '2019',
        Rated: 'R',
        Released: '10 Jan 2020',
        Runtime: '119 min',
        Genre: 'Drama, War',
        Director: 'Sam Mendes',
        Writer: 'Sam Mendes, Krysty Wilson-Cairns',
        Actors: 'Dean-Charles Chapman, George MacKay, Daniel Mays, Colin Firth',
        Plot:
          'April 6th, 1917. As a regiment assembles to wage war deep in enemy territory, two soldiers are assigned to race against time and deliver a message that will stop 1,600 men from walking straight into a deadly trap.',
        Language: 'English, French, German',
        Country: 'USA, UK, India, Spain, Canada',
        Awards: 'Won 3 Oscars. Another 110 wins & 161 nominations.',
        Poster:
          'https://m.media-amazon.com/images/M/MV5BOTdmNTFjNDEtNzg0My00ZjkxLTg1ZDAtZTdkMDc2ZmFiNWQ1XkEyXkFqcGdeQXVyNTAzNzgwNTg@._V1_SX300.jpg',
        Ratings: [
          {
            Source: 'Internet Movie Database',
            Value: '8.3/10'
          },
          {
            Source: 'Rotten Tomatoes',
            Value: '89%'
          },
          {
            Source: 'Metacritic',
            Value: '78/100'
          }
        ],
        Metascore: '78',
        imdbRating: '8.3',
        imdbVotes: '327,805',
        imdbID: 'tt8579674',
        Type: 'movie',
        DVD: '10 Mar 2020',
        BoxOffice: 'N/A',
        Production: 'Universal Pictures',
        Website: 'N/A',
        Response: 'True'
      })
    }
  },
  data() {
    return {
      socialShare: false
    }
  },
  methods: {
    ratingSource(name) {
      if (name === 'Internet Movie Database') {
        return 'IMDb'
      } else if (name === 'Rotten Tomatoes') {
        return 'RT'
      } else {
        return name
      }
    },
    shareData() {
      const data = {
        url: '/article/' + this.cardcontent._id,
        title: `Check out the cool review of - ${this.cardcontent.movieReviewCard.Title} - ${this.cardcontent.movieReviewCard.Year}`,
        description: `Check out the awesome rewiews of - ${this.cardcontent.movieReviewCard.Title} ${this.cardcontent.movieReviewCard.Year}`,
        quote: `${this.cardcontent.movieReviewCard.Title} - ${this.cardcontent.movieReviewCard.Year}`,
        hashtags: this.createHashtag()
      }
      return data
    },
    createHashtag() {
      const hashtag = this.cardcontent.movieReviewCard.Title.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join('')
      return `${hashtag},theopenstories`
    },
    socialModal(data) {
      this.socialShare = data
    },
    linkToPost() {
      if (
        this.$route.name !== 'index-article-id' &&
        this.cardcontent &&
        this.socialShare !== this.cardcontent._id
      ) {
        this.$router.push(
          `/article/${this.cardcontent._id}?title=${
            this.cardcontent._id &&
            this.cardcontent.movieReviewCard &&
            this.cardcontent.movieReviewCard.Title
              ? this.cardcontent.movieReviewCard.Title
              : ''
          }`
        )
      }
    }
  }
}
</script>

<style scoped>
.v-sheet--offset {
  top: -30px;
  position: relative;
}
.rounded-image {
  border-radius: 8px;
}
.link {
  text-decoration: none;
  background-image: linear-gradient(#37b2b2 50%, #37b2b2 50%);
  background-size: 10000px 1px;
  background-repeat: no-repeat;
  background-position: 0 1em;
  background-position: -10000px 1em;
  cursor: pointer;
}
.in-color {
  color: inherit;
}
.disable-click {
  pointer-events: none;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
