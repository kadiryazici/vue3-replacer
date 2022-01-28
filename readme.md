A text replacer component for Vue 3.

Requires Vue 3 as peer-dependency.

# Installation
Install it from npm.
```
npm install vue3-replacer
```
```
pnpm add vue3-replacer
```
```
yarn add vue3-replacer
```

# Usage
Import the component and use it. 

By default `Replacer` splits given text from white spaces (keeps whitespaces) to a `string[]`, and by default `Replacer` understands `mention (@someone)`, `url (https://url.com)` and `hashtags (#JusticeForSomeone)`.

```html
<script setup>
import { Replacer } from 'vue3-replacer';

import Mention from './components/Mention.vue';
import Hashtag from './components/Hashtag.vue';
</script>

<template>
   <Replacer
      text="Sample text https://yandex.com https://google.com @hello #JusticeForSomething"
   >
      <!-- Text will resolve #JusticeForSomething> -->
      <template #mention="text">
         <Mention>{{ text }}</Mention>
      </template>

      <!-- text will resolve https://yandex.com and then https://google.com> -->
      <template #url="text">
         <RouterLink :to="text">{{ text.slice(0, 12) }}</RouterLink>
      </template>

      <!-- text will resolve #JusticeForSomething -->
      <template #hashtag="text">
         <Hashtag>{{ text }}</Hashtag>
      </template>

      <!-- 
         If you want to resolve plain text a.k.a unmatched texts, you can 
         text can be whitespace too, ' '.
      -->
      <template #text>
         <span style="font-weight: bold">{{ text }}</span>
      </template>
   </Replacer>
</template>
```

# How it works
If you give `Hi welcome to @vue3-replacer https://github.com/kadiryazici/vue3-replacer #reallyGood` text, `Replacer` will convert it to array of strings.

```ts
const given = 'Hi welcome to @vue3-replacer https://github.com/kadiryazici/vue3-replacer #reallyGood';

const out = [
   'Hi',
   ' ',
   'welcome',
   ' ',
   'to',
   ' ',
   '@vue3-replacer',
   ' ',
   'https://github.com/kadiryazici/vue3-replacer',
   ' ',
   '#reallyGood'
]
```
and then runs handlers for each text (stops at first match per text). If you have 2 matchers for single text first one will succeed. Queue matters.

Replacer will generate a simple schema like this to resolve texts with slots:
```ts
const out = [
   ['Hi', 'text'],
   [' ', 'text'],
   ['welcome', 'text'],
   [' ', 'text'],
   ['to', 'text'],
   [' ', 'text'],
   ['@vue3-replacer', 'mention'],
   [' ', 'text'],
   ['https://github.com/kadiryazici/vue3-replacer', 'url'],
   [' ', 'text'],
   ['#reallyGood', 'hashtag']
]
```

# Extending handlers and splitter.
You can add your own handlers and can change splitters' behavior.

Let's write our own the splliter that only splits by brackets.

```html
<script setup>
import { Replacer } from 'vue3-replacer'
import type { Handler } from 'vue3-replacer';

const addCharacterToLastElement = (array, character) => {
   if(typeof array[array.length - 1] === 'string') {
      array[array.length - 1] += character;
      return;
   }

   array.push(character)
}

/**
 * @param { string } text / this will be given text prop.
 * @returns { string[] } splliter has to return string[] to run handlers per each word/split.
 */
const handleSplit = (text) => {
   /**
      Lets iterate over character by character.
      Create a new string element for brackets and push characters inside the bracket to that
      element. Push an empty string to array when you exit bracket.
   */
   const splittedByBrackets = [...text].reduce((acc, character) => {
      if (character === '(') {
         acc.push('(');
      } 
      else if (character === ')') {
         addCharacterToLastElement(acc, ')');
         acc.push('');
      }
      else {
         addCharacterToLastElement(acc, character);
      }

      return acc;
   }, [])

   /*
      We got: ['Hi how are you? ', '(sad)', ' ', '(happy)', ''], we need to get rid of empty strings.
   */
   return splittedByBrackets.filter(Boolean);
}

// Let's write our own handler for brackets.
// Custom handlers should be an array.
const customHandlers: Handler[] = [
   {
      name: 'brackets', // we will use this name as slot name.
      /*
         we will get each element of the array, we need to return `true` or `false`
         to let Replacer know what it is.

         You can use whatever you want as long as you return boolean.
      */
      check(text) {
         return text.startsWith('(') && text.endsWith(')')
      }
   }
]

</script>

<template>
   <Replacer
      text="Hi how are you? (sad) (happy)"
      :splitter="handleSplit"
      :customHandlers="customHandlers"
   >
      <!-- Lets resolve our brackets -->
      <template #brackets="text">
         <span style="color: purple">{{ text }} </span>
      </template>
   </Replacer>
</template>
```

# Overriding default handlers
By default `Replacer` has `mention | url | hashtag` handlers. If you want override these handlers, just call your handler's name with existing ones.

```html
<script>
import { Replacer } from 'vue3-replacer'
import type { Handler } from 'vue3-replacer'

const customHandlers: Handler[] = {
   // Default hashtag is overwritten;
   {
      name: 'hashtag',
      check(text) {
         return text.startsWith('#')
      }
   }
}
</script>

<template>
   <Replacer text="hi mom #good", :customHandlers="customHandlers">
      <template #hashtag="text"> {{ text }} </template>
   </Replacer>
</template>
```