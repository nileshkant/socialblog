<template>
  <div v-if="covidSummary" class="mt-4">
    <v-card>
      <div class="body-1 px-3 py-1">
        Covid 19 Overview (WorldWide)
        <div class="caption text--disabled">
          Updated
          {{
            $dateFns.formatDistanceToNow(new Date(covidSummary.Date), {
              addSuffix: true
            })
          }}
        </div>
      </div>
      <v-row no-gutters>
        <v-col cols="6">
          <v-card flat class="ma-1 pa-2 confirmed-background">
            <div class="mb-1 body-2 confirmed">Confirmed</div>
            {{ covidSummary.Global.TotalConfirmed | numberWithCommas }}
            <div class="caption confirmed-increase font-weight-bold">
              + {{ covidSummary.Global.NewConfirmed | numberWithCommas }}
            </div>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card flat class=" ma-1 pa-2 activeCase-background">
            <div class="mb-1 body-2 activeCase">Active</div>
            {{
              (covidSummary.Global.TotalConfirmed -
                covidSummary.Global.TotalRecovered)
                | numberWithCommas
            }}
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card flat class="ma-1 pa-2 recovered-background">
            <div class="mb-1 body-2 recovered">Recovered</div>
            {{ covidSummary.Global.TotalRecovered | numberWithCommas }}
            <div class="caption recovered-increase font-weight-bold">
              + {{ covidSummary.Global.NewRecovered | numberWithCommas }}
            </div>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card flat class="ma-1 pa-2 deceased-background">
            <div
              class="mb-1 deceased body-2
"
            >
              Total Deaths
            </div>
            {{ covidSummary.Global.TotalDeaths | numberWithCommas }}
            <div class="caption deceased font-weight-bold">
              + {{ covidSummary.Global.NewDeaths | numberWithCommas }}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  filters: {
    numberWithCommas: (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  computed: {
    ...mapGetters({
      covidSummary: 'covid19/covidSummary'
    }),
    formatDate(x) {
      return this.$dateFns.distanceInWordsToNow(new Date(x), {
        addSuffix: true
      })
    }
  }
}
</script>

<style scoped>
.confirmed {
  color: #ff073a;
}
.confirmed-background {
  min-height: 85px;
  background: rgba(255, 7, 58, 0.1);
}
.confirmed-increase {
  color: rgba(255, 7, 58, 0.6);
}
.activeCase {
  color: #007bff;
}
.activeCase-background {
  min-height: 85px;
  background: rgba(0, 123, 255, 0.1);
}
.activeCase-increase {
  color: rgba(0, 123, 255, 0.6);
}
.recovered {
  color: #28a745;
}
.recovered-background {
  min-height: 85px;
  background: rgba(40, 167, 69, 0.1);
}
.recovered-increase {
  color: rgba(40, 167, 69, 0.6);
}
.deceased {
  color: #6c757d;
}
.deceased-background {
  min-height: 85px;
  background: rgba(108, 117, 125, 0.1);
}
.deceased-increase {
  color: rgba(108, 117, 125, 0.6);
}
</style>
