import { createApp, defineComponent } from 'vue';

import styled from 'vue3-styled-components';
import { Replacer } from '../src/lib';

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

const url = (text: string) => <Link href={text}>{text}</Link>;
const mention = (text: string) => <Mention>{text}</Mention>;
const hashtag = (text: string) => <Hashtag>{text}</Hashtag>;
const brackets = (text: string) => <Brackets>{text}</Brackets>;

const App = defineComponent({
   render() {
      return (
         <div>
            <Replacer
               splitter={(text) => {
                  const texts = [];

                  const modifyLast = (character: string) => {
                     const lastIndex = texts.length - 1;
                     const lastEl = texts[lastIndex];
                     if (typeof lastEl === 'string') {
                        texts[lastIndex] += character;
                     } else {
                        texts.push(character);
                     }
                  };

                  [...text].forEach((character) => {
                     if (character === '(') {
                        texts.push('(');
                        return;
                     }
                     if (character === ')') {
                        modifyLast(')');
                        texts.push('');
                        return;
                     }
                     modifyLast(character);
                  });
                  return texts;
               }}
               handlers={[
                  {
                     name: 'brackets',
                     execute: (text) => text.slice(0, 1) === '[' && text.slice(-1) === ']',
                  },
               ]}
               v-slots={{ url, mention, hashtag, brackets }}
               text={sampleText}
            />
         </div>
      );
   },
});

const app = createApp(App);
app.mount('#app');
