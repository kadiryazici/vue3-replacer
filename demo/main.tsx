import { createApp, defineComponent } from 'vue';

import styled from 'vue3-styled-components';
import { Handler, Replacer } from '../src/lib';

const sampleText =
   'Hello (bruh moment) this is reguler text `with block` with @mention and #hashtag but can also contain https://links.com';

const Mention = styled.span`
   padding: 3px;
   border-radius: 3px;
   vertical-align: middle;
   background-color: rgb(13, 95, 118);
   color: rgb(255, 255, 255);
   font-family: Arial, Helvetica, sans-serif;
   font-size: 13px;
`;

const Link = styled.a`
   color: rgb(13, 95, 118);
   text-decoration: underline;
   font-family: Arial, Helvetica, sans-serif;
   font-size: 13px;
   font-weight: bold;

   &:hover {
      color: rgb(15, 72, 88);
   }
`;

const Hashtag = styled.span`
   vertical-align: middle;
   color: #347fa0;
   text-shadow: 0px 0px 1px #347fa0;
   font-size: 13px;
`;

const Brackets = styled.span`
   display: inline-block;
   color: #e2611b;
   font-size: 15px;
   font-weight: bold;
   background-color: black;
   padding: 2px;
`;

const addCharacterToLastElement = (array: string[], character: string) => {
   if (typeof array[array.length - 1] === 'string') {
      // eslint-disable-next-line no-param-reassign
      array[array.length - 1] += character;
      return;
   }

   array.push(character);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bracketsSplitter = (text: string) => {
   const splittedFromBrackets = [...text].reduce((acc, character) => {
      if (character === '(') {
         acc.push('(');
      } else if (character === ')') {
         addCharacterToLastElement(acc, ')');
         acc.push('');
      } else {
         addCharacterToLastElement(acc, character);
      }

      return acc;
   }, [] as string[]);

   return splittedFromBrackets.filter(Boolean);
};

const customHandlers: Handler[] = [
   {
      name: 'brackets',
      check: (text) => text.startsWith('(') && text.endsWith(')'),
   },
];

const url = (text: string) => <Link href={text}>{text}</Link>;
const mention = (text: string) => <Mention>{text}</Mention>;
const hashtag = (text: string) => <Hashtag>{text}</Hashtag>;
const brackets = (text: string) => <Brackets>{text}</Brackets>;

const App = defineComponent({
   render() {
      return (
         <div>
            <Replacer
               // splitter={bracesSplitter}
               customHandlers={customHandlers}
               v-slots={{ url, mention, hashtag, brackets }}
               text={sampleText}
            />
         </div>
      );
   },
});

const app = createApp(App);
app.mount('#app');
