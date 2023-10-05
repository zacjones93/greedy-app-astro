import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from '@astrojs/vercel/serverless';
import { resolve } from "path";


// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [tailwind(), react()],
  adapter: vercel(),
  build:{
    outDir: "build",
    rollupOptions: {
      external: [
          "react", // ignore react stuff
          "react-dom",
      ],
  }
  }
});