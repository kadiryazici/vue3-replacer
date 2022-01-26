import { PropType, computed, defineComponent } from 'vue';

import { MatchType } from './matchType';
import { Handler, handlers } from './handlers';

export type { Handler } from './handlers';

export const Replacer = defineComponent({
   name: 'Replacer',
   props: {
      text: {
         type: String as PropType<string>,
         required: true,
      },
      handlers: {
         type: Array as PropType<Handler[]>,
         default: () => [],
      },
      splitter: {
         type: Function as PropType<(text: string) => string[]>,
         default: (text: string) => text.split(/(\s+)/),
      },
   },
   setup(props) {
      const texts = computed(() => props.splitter(props.text));

      // Merge default handlers with given ones. Always keep last handler by name, remove duplicates.
      const mergedHandlers = computed(() => {
         const allHandlers = [...handlers, ...props.handlers];

         return allHandlers.filter((handler, index) => {
            const lastIndexOfHandlerByName = allHandlers.map(({ name }) => handler.name === name).lastIndexOf(true);
            return index === lastIndexOfHandlerByName;
         });
      });

      const matches = computed(() =>
         texts.value.map((text) => {
            let match: string = MatchType.Text;

            for (
               let index = 0; // break this shit prettier
               index < mergedHandlers.value.length;
               index += 1
            ) {
               const handler = mergedHandlers.value[index];
               const didMatch = handler.execute(text);
               if (didMatch) {
                  match = handler.name;
                  // don't care about other matches when you find one. Queue matters dude.
                  break;
               }
            }

            return [text, match] as const;
         }),
      );

      return {
         matches,
         mergedHandlers,
      };
   },
   render() {
      return this.matches.map(([text, type]) => {
         if (type in this.$slots) {
            return this.$slots[type]!(text);
         }
         return text;
      });
   },
});
