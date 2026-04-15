import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
	site: "https://astro-blog-starter-template.3495476324.workers.dev",
	integrations: [mdx(), sitemap()],
	output: 'server',
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
});
