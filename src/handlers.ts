import { regexHashtag, regexMention, regexURL } from './regex';

import { MatchType } from './matchType';

export type Handler = {
   name: string;
   execute: (text: string) => boolean;
};

export const handlers: Handler[] = [
   {
      name: MatchType.Mention,
      execute: (text) => regexMention.test(text),
   },
   {
      name: MatchType.URL,
      execute: (text) => regexURL.test(text),
   },
   {
      name: MatchType.Hashtag,
      execute: (text) => regexHashtag.test(text),
   },
];
