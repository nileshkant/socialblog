<template>
  <!-- <client-only placeholder="Loading..."> -->
  <div class="editor">
    <!-- <editor-menu-bubble
      v-slot="{ commands, isActive, getMarkAttrs, menu }"
      class="menububble"
      :editor="editor"
      @hide="hideLinkMenu"
    >
      <div
        class="menububble"
        :class="{ 'is-active': menu.isActive }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >
        <form
          v-if="linkMenuIsActive"
          class="menububble__form"
          @submit.prevent="setLinkUrl(commands.link, linkUrl)"
        >
          <input
            ref="linkInput"
            v-model="linkUrl"
            class="menububble__input"
            type="text"
            placeholder="https://"
            @keydown.esc="hideLinkMenu"
          />
          <v-btn type="button" icon @click="setLinkUrl(commands.link, null)">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </form>

        <template v-else>
          <v-btn @click="showLinkMenu(getMarkAttrs('link'))">
            <span>{{ isActive.link() ? 'Update Link' : 'Add Link' }}</span>
            <v-icon small>mdi-link</v-icon>
          </v-btn>
        </template>
      </div>
    </editor-menu-bubble> -->
    <v-row no-gutters class="pos-r" justify="end" align="end">
      <resize-observer />
      <v-col cols="2" md="1">
        <v-btn text x-small class="pa-0" @click="hideMenu = !hideMenu">
          <v-icon v-if="hideMenu">mdi-format-text</v-icon>
          <v-icon v-else>mdi-close</v-icon>
        </v-btn>
        <v-expand-x-transition>
          <div v-if="!hideMenu">
            <editor-menu-bar
              v-slot="{ commands, isActive }"
              :editor="editor"
              class="menuItemBar"
            >
              <div class="menubar is-focused">
                <v-btn
                  icon
                  small
                  title="Bold"
                  type="button"
                  class="menubar__button"
                  :class="{ 'is-active': isActive.bold() }"
                  @click="commands.bold"
                >
                  <icon name="bold" />
                </v-btn>

                <v-btn
                  icon
                  small
                  title="Italic"
                  type="button"
                  class="menubar__button"
                  :class="{ 'is-active': isActive.italic() }"
                  @click="commands.italic"
                >
                  <icon name="italic" />
                </v-btn>

                <v-btn
                  icon
                  small
                  title="Strike"
                  type="button"
                  class="menubar__button"
                  :class="{ 'is-active': isActive.strike() }"
                  @click="commands.strike"
                >
                  <icon name="strike" />
                </v-btn>
                <v-btn
                  icon
                  small
                  title="Code"
                  type="button"
                  class="menubar__button"
                  :class="{ 'is-active': isActive.code() }"
                  @click="commands.code"
                >
                  <icon name="code" />
                </v-btn>
                <v-btn
                  icon
                  small
                  title="List"
                  type="button"
                  class="menubar__button"
                  :class="{ 'is-active': isActive.bullet_list() }"
                  @click="commands.bullet_list"
                >
                  <icon name="ul" />
                </v-btn>
                <v-btn
                  icon
                  small
                  title="Quote"
                  type="button"
                  class="menubar__button"
                  :class="{ 'is-active': isActive.blockquote() }"
                  @click="commands.blockquote"
                >
                  <icon name="quote" />
                </v-btn>

                <v-btn
                  icon
                  small
                  title="Code block"
                  type="button"
                  class="menubar__button"
                  :class="{ 'is-active': isActive.code_block() }"
                  @click="commands.code_block"
                >
                  <span class="subtitle-1 font-weight-medium">[...]</span>
                </v-btn>
                <span
                  v-if="limitcharcount"
                  class="px-1 caption"
                  :class="{ 'error--text': charcount > limitcharcount }"
                >
                  {{ charcount }}/{{ limitcharcount }}
                </span>
              </div>
            </editor-menu-bar>
          </div>
        </v-expand-x-transition>
      </v-col>
      <v-col cols="10" md="11">
        <editor-content
          class="editor__content"
          :class="{ errorContent: charcount > limitcharcount }"
          :editor="editor"
        />
      </v-col>
    </v-row>
    <div
      v-if="charcount > limitcharcount"
      class="error--text caption"
      :class="errorTextClass"
    >
      You can't use more than {{ limitcharcount }} characters
    </div>
  </div>
  <!-- </client-only> -->
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  BulletList,
  CodeBlock,
  ListItem,
  OrderedList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  Placeholder
} from 'tiptap-extensions'
import Icon from './icons'
export default {
  components: {
    EditorContent,
    EditorMenuBar,
    Icon
    // EditorMenuBubble
  },
  props: {
    limitcharcount: {
      type: Number,
      default: 200
    },
    value: {
      type: String,
      default: null
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Add more details'
    },
    errorTextClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null,
      charcount: 0,
      linkUrl: null,
      hideMenu: true,
      linkMenuIsActive: false
    }
  },
  watch: {
    value(val) {
      // so cursor doesn't jump to start on typing
      if (this.editor && val !== this.value) {
        this.editor.setContent(val, true)
      }
      // if Content is clear in the parent
      if (!val) {
        this.editor.setContent(val, true)
      }
    },
    autofocus(newVal) {
      if (newVal) {
        this.editor.focus('end')
      }
    }
  },
  mounted() {
    this.$meta().refresh()
    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new ListItem(),
        new OrderedList(),
        new Link(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new Placeholder({
          emptyEditorClass: 'is-editor-empty',
          emptyNodeClass: 'is-empty',
          emptyNodeText: this.placeholder,
          showOnlyWhenEditable: true,
          showOnlyCurrent: true
        })
      ],
      onBlur: () => {
        if (this.autofocus) {
          this.$store.dispatch('commonState/autoFocusComment', false)
        }
      },
      content: this.value,
      onUpdate: ({ getHTML, transaction }) => {
        this.$emit(
          'charCount',
          transaction.doc && transaction.doc.textContent.length
        )
        this.charcount = transaction.doc && transaction.doc.textContent.length
        // get new content on update
        const newContent = getHTML()
        this.$emit('richContent', newContent)
      }
    })
    this.editor.setContent(this.value)
    // this.editor.focus('end')
  },
  methods: {
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
    hideLinkMenu() {
      this.linkUrl = null
      this.linkMenuIsActive = false
    },
    setLinkUrl(command, url) {
      const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/
      const regex = new RegExp(expression, 'g')
      if (regex.test(url)) {
        command({ href: url })
      }
      this.hideLinkMenu()
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style lang="scss" scoped>
$color-black: #000000;

// .menubar {
//   transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;

//   &.is-hidden {
//     visibility: hidden;
//     opacity: 0;
//   }

//   &.is-focused {
//     visibility: visible;
//     opacity: 1;
//     transition: visibility 0.2s, opacity 0.2s;
//   }

//   &__button {
//     font-weight: bold;
//     display: inline-flex;
//     background: transparent;
//     border: 0;
//     color: var(--v-colorTheme-base);
//     padding: 0.2rem 0.5rem;
//     margin-right: 0.2rem;
//     border-radius: 3px;
//     cursor: pointer;

//     &:hover {
//       background-color: var(--v-colorTheme-base);
//       color: var(--v-colorReverseTheme-base);
//       .iconColor {
//         color: var(--v-colorReverseTheme-base);
//       }
//     }

//     &.is-active {
//       background-color: var(--v-colorTheme-base);
//       color: var(--v-colorReverseTheme-base);
//       .iconColor {
//         color: var(--v-colorReverseTheme-base);
//       }
//     }
//   }

//   span#{&}__button {
//     font-size: 13.3333px;
//   }
// }

.editor__content {
  border-bottom: 1px solid var(--v-colorTheme-base);
}
.editor__content.errorContent {
  border-bottom: 1px solid var(--v-error-base) !important;
}

.editor__content ::v-deep p {
  margin: 0 !important;
}
.editor__content ::v-deep > .ProseMirror {
  outline: none;
}
.editor ::v-deep p.is-editor-empty:first-child::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
}
.iframe__embed {
  width: 100%;
  height: 15rem;
  border: 0;
}
.iframe__input {
  display: block;
  width: 100%;
  font: inherit;
  border: 0;
  border-radius: 5px;
  background-color: inherit;
  padding: 0.3rem 0.5rem;
  word-break: break-all;
}
.menububble {
  position: absolute;
  display: flex;
  z-index: 20;
  background: var(--v-colorReverseTheme-base);
  border-radius: 5px;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;

  &.is-active {
    opacity: 1;
    visibility: visible;
  }

  &__form {
    display: flex;
    align-items: center;
  }

  &__input {
    font: inherit;
    border: none;
    background-color: transparent;
    color: var(--v-colorTheme-base);
  }
}
.pos-r {
  position: relative;
}
.menuItemBar {
  position: absolute;
  width: 350px;
  top: -50px;
  left: 0;
  padding: 2px;
  background: var(--v-colorReverseTheme-base);
  z-index: 5;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}
@media (max-width: 960px) {
  .menuItemBar {
    max-width: 100vw;
  }
}
</style>
