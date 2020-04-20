<template>
  <!-- <client-only placeholder="Loading..."> -->
  <div class="editor">
    <editor-menu-bar v-slot="{ commands, isActive, focused }" :editor="editor">
      <div class="menubar is-hidden" :class="{ 'is-focused': focused }">
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
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </button>

        <button
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </button>

        <button
          type="button"
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          H3
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
  </div>
  <!-- </client-only> -->
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  BulletList,
  CodeBlock,
  HardBreak,
  Heading,
  ListItem,
  OrderedList,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
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
    }
  },
  data() {
    return {
      editor: null,
      charcount: 0
    }
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Link(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
        new Placeholder({
          emptyEditorClass: 'is-editor-empty',
          emptyNodeClass: 'is-empty',
          emptyNodeText: 'Start chat with little details',
          showOnlyWhenEditable: true,
          showOnlyCurrent: true
        })
      ],
      content: '',
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
</style>
