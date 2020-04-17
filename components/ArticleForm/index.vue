<template>
  <client-only>
    <ValidationObserver ref="obs">
      <v-card
        slot-scope="{ invalid, validated }"
        :max-width="maxWidth"
        :min-width="maxWidth"
        :max-height="maxHeight"
        :min-height="minHeight"
      >
        <v-toolbar>
          <v-toolbar-title>Create Post</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <VTextFieldWithValidation
              v-model="heading"
              rules="required|min:5"
              label="Heading*"
            />

            <VTextFieldWithValidation
              rules="min:5"
              v-model="subheading"
              label="SubHeading"
            />

            <VTextFieldWithValidation
              rules="min:3"
              v-model="source"
              label="Source"
            />
            <RichtextEditor @richContent="richContent" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="clear">Clear</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="submit">Validate</v-btn>
          <v-btn
            color="primary"
            :disabled="invalid || !validated"
            @click="submit"
            >Sign Up</v-btn
          >
        </v-card-actions>
      </v-card>
    </ValidationObserver>
  </client-only>
</template>

<script>
import { ValidationObserver, extend } from 'vee-validate'
import { required, min, email } from 'vee-validate/dist/rules'
import { mapGetters } from 'vuex'
import VTextFieldWithValidation from '../FormComponents/Textfield'
import RichtextEditor from '../FormComponents/RichTextEditor'
extend('email', email)
extend('required', required)
extend('min', min)

export default {
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    RichtextEditor
  },
  data: () => ({
    items: ['', 'Foo', 'Bar'],
    heading: '',
    subheading: '',
    source: '',
    richText: ''
  }),
  computed: {
    ...mapGetters({
      windowWidth: 'commonState/windowWidth'
      // windowHeight: 'commonState/windowHeight'
    }),
    maxWidth() {
      return this.windowWidth > 768 ? '50vw' : '100vw'
    },
    maxHeight() {
      return this.windowWidth < 768 ? '100vh' : ''
    },
    minHeight() {
      return this.windowWidth < 768 ? '100vh' : ''
    }
  },
  methods: {
    clear() {
      this.name = this.email = ''
      this.$nextTick(() => {
        this.$refs.obs.reset()
      })
      this.$emit('closeModel')
    },
    richContent(content) {
      this.richText = content
    },
    async submit() {
      await this.$refs.obs.validate()
    }
  }
}
</script>
