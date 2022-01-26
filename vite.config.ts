import DTS from 'vite-plugin-dts';
import VueJSX from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import path from 'path';

const root = process.cwd();
const mode = process.env.MODE as 'production' | 'demo';

const productionConfig = defineConfig({
   plugins: [
      VueJSX(),
      DTS({
         outputDir: 'dist',
      }),
   ],
   build: {
      target: 'es2020',
      lib: {
         entry: path.resolve(root, 'src', 'lib.tsx'),
         name: 'vue3-replacer',
         formats: ['es', 'umd'],
      },
      rollupOptions: {
         external: ['vue'],
         output: {
            globals: {
               vue: 'Vue',
            },
         },
      },
   },
});

const demoConfig = defineConfig({
   root: path.join(root, 'demo'),
   plugins: [VueJSX()],
   build: {
      emptyOutDir: true,
      outDir: path.join(root, 'dist-demo'),
   },
});

export default mode === 'demo' ? demoConfig : productionConfig;
