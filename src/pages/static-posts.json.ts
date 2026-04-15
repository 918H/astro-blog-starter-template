---
// 导出静态文章为 JSON，供前端调用
export const prerender = true;

import { getCollection } from 'astro:content';

const posts = await getCollection('blog');

await Astro.emitAsset(
	'static-posts.json',
	JSON.stringify(posts.map(post => ({
		id: post.id,
		data: {
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate.toISOString(),
			heroImage: post.data.heroImage || ''
		}
	})))
);
---
