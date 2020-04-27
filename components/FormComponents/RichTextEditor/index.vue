<template>
  <!-- <client-only placeholder="Loading..."> -->
  <div class="editor py-3">
    <editor-menu-bar v-slot="{ commands, isActive }" :editor="editor">
      <div class="menubar is-focused">
        <button
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <icon name="bold" />
        </button>

        <button
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <icon name="italic" />
        </button>

        <button
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <icon name="strike" />
        </button>

        <button
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <icon name="underline" />
        </button>

        <button
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.code() }"
          @click="commands.code"
        >
          <icon name="code" />
        </button>

        <button
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.paragraph() }"
          @click="commands.paragraph"
        >
          <icon name="paragraph" />
        </button>
        <button
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <icon name="ul" />
        </button>

        <button
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <icon name="ol" />
        </button>

        <button
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <icon name="quote" />
        </button>

        <button
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.code_block() }"
          @click="commands.code_block"
        >
          <icon name="code" />
        </button>
        <span
          v-if="limitcharcount"
          class="px-3"
          :class="{ 'error--text': charcount > limitcharcount }"
        >
          {{ charcount }}/{{ limitcharcount }}
        </span>
      </div>
    </editor-menu-bar>

    <editor-content
      class="editor__content"
      :class="{ errorContent: charcount > limitcharcount }"
      :editor="editor"
    />
    <div v-if="charcount > limitcharcount" class="error--text caption">
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
  // Link,
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
  },
  props: {
    limitcharcount: {
      type: Number,
      default: 200
    },
    value: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      editor: null,
      charcount: 0
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
    }
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new ListItem(),
        new OrderedList(),
        // new Link(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new Placeholder({
          emptyEditorClass: 'is-editor-empty',
          emptyNodeClass: 'is-empty',
          emptyNodeText: 'Add more details',
          showOnlyWhenEditable: true,
          showOnlyCurrent: true
        })
      ],
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
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style lang="scss" scoped>
$color-black: #000000;

.menubar {
  margin-bottom: 1rem;
  transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;

  &.is-hidden {
    visibility: hidden;
    opacity: 0;
  }

  &.is-focused {
    visibility: visible;
    opacity: 1;
    transition: visibility 0.2s, opacity 0.2s;
  }

  &__button {
    font-weight: bold;
    display: inline-flex;
    background: transparent;
    border: 0;
    color: var(--v-colorTheme-base);
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      background-color: var(--v-colorTheme-base);
      color: var(--v-colorReverseTheme-base);
      .iconColor {
        color: var(--v-colorReverseTheme-base);
      }
    }

    &.is-active {
      background-color: var(--v-colorTheme-base);
      color: var(--v-colorReverseTheme-base);
      .iconColor {
        color: var(--v-colorReverseTheme-base);
      }
    }
  }

  span#{&}__button {
    font-size: 13.3333px;
  }
}

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
}
</style>
