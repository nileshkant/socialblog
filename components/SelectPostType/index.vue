<template>
  <v-row align="center" justify="center">
    <v-col cols="12">
      <div class="text-center title text-secondary">
        Select Story Type
      </div>
    </v-col>
    <v-col v-for="(card, index) in cardType" :key="index" cols="12" md="4">
      <v-hover>
        <template v-slot:default="{ hover }">
          <v-card>
            <div class="no-event">
              <ArticleCard
                v-if="card === 'fullDetailsCard'"
                :cardcontent="cardcontent"
                showfullcard
              />
              <QuoteCard v-else :cardcontent="cardcontent" />
            </div>
            <v-fade-transition>
              <v-overlay v-if="hover" absolute>
                <v-btn type="button" @click="selectedCard(card)">
                  Create Story
                </v-btn>
              </v-overlay>
            </v-fade-transition>
          </v-card>
        </template>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script>
import ArticleCard from '../ChatCard'
import QuoteCard from '../ChatCard/QuoteCard'

export default {
  components: {
    ArticleCard,
    QuoteCard
  },
  data() {
    return {
      cardType: ['fullDetailsCard', 'quoteCard'],
      cardcontent: {
        fullDetailsCard: {
          title: 'This is detailed story',
          subtitle:
            'This story relates my favorite things in this world. Something about my life, alright I will explain you!',
          mediaUrl:
            'https://res.cloudinary.com/dec1s4jip/image/upload/v1591649718/photo-1516414447565-b14be0adf13e_ystkdu.jpg',
          file: null,
          articleBody: `Explain your Story may be the best at something in school or at work, at a sport or some other passion.`,
          source: "My life's Story"
        },
        quoteCard: {
          title: 'Two things are infinite',
          quote:
            "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
          source: 'Albert Einstein',
          color: '#cccccc'
        }
      }
    }
  },
  methods: {
    selectedCard(card) {
      this.$emit('selectedCard', card)
    }
  }
}
</script>

<style scoped>
.pos-r {
  position: relative;
}
.no-event {
  pointer-events: none;
}
</style>
