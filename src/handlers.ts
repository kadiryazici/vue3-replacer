import { regexHashtag, regexMention, regexURL } from './regex';

import { MatchType } from './matchType';

export type Handler = {
   name: string;
   check: (text: string) => boolean;
};

export const handlers: Handler[] = [
   {
      name: MatchType.Mention,
      check: (text) => regexMention.test(text),
   },
   {
      name: MatchType.URL,
      check: (text) => regexURL.test(text),
   },
   {
      name: MatchType.Hashtag,
      check: (text) => regexHashtag.test(text),
   },
];
