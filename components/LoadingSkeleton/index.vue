<template>
  <client-only>
    <div>
      <div class="header">
        <v-skeleton-loader type="heading"></v-skeleton-loader>
      </div>
      <div
        :style="{
          'min-height': windowHeight - 66 + 'px',
          'max-height': windowHeight - 66 + 'px'
        }"
        class="overflowY-auto scrollBar"
      >
        <div v-if="pageType === 'allStory'">
          <v-row
            v-for="(card, index) in totalNumbers"
            :key="index"
            class="mx-0"
          >
            <v-col
              :key="index"
              cols="10"
              md="8"
              :class="{ 'ml-auto': index % 2 === 0 }"
            >
              <v-sheet>
                <v-skeleton-loader
                  :type="
                    cardType[
                      loadingCard === 'mixed' ? randomPick() : loadingCard
                    ].skeletonType
                  "
                >
                </v-skeleton-loader>
              </v-sheet>
            </v-col>
          </v-row>
        </div>
        <div v-if="pageType === 'detailStory'">
          <v-row
            v-for="(card, index) in totalNumbers"
            :key="index"
            class="mx-0"
          >
            <v-col
              :key="index"
              cols="10"
              md="8"
              :class="{ 'ml-auto': index % 2 !== 0 }"
            >
              <v-sheet>
                <v-skeleton-loader
                  :type="
                    cardType[
                      index === 0
                        ? loadingCard === 'mixed'
                          ? randomPick()
                          : loadingCard
                        : 'commentCard'
                    ].skeletonType
                  "
                >
                </v-skeleton-loader>
              </v-sheet>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    loadingCard: {
      validator: (value) => {
        // The value must match one of these strings
        return ['fullDetailsCard', 'quoteCard', 'mixed'].includes(value) !== -1
      },
      default: 'mixed'
    },
    totalNumbers: {
      type: Number,
      default: 3
    },
    pageType: {
      validator: (value) => {
        // The value must match one of these strings
        return ['allStory', 'detailStory'].includes(value) !== -1
      },
      default: 'allStory'
    }
  },
  data() {
    return {
      type: ['fullDetailsCard', 'quoteCard'],
      cardType: {
        fullDetailsCard: {
          skeletonType: 'card-avatar, article, actions'
        },
        quoteCard: {
          skeletonType: 'article, actions'
        },
        commentCard: {
          skeletonType: 'paragraph'
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      windowHeight: 'commonState/windowHeight'
    })
  },
  methods: {
    randomPick() {
      return this.type[Math.floor(Math.random() * this.type.length)]
    }
  }
}
</script>

<style scoped>
.overflowY-auto {
  overflow-y: auto;
}
.header {
  height: 66px;
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: 20px;
}
</style>
