// API: 获取所有文章列表
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
	const kv = (locals as any).runtime?.env?.BLOG_STORE;
	
	if (!kv) {
		return new Response(JSON.stringify({ error: '存储未配置' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const keys = await kv.list();
		const articles: any[] = [];

		for (const key of (keys.keys || [])) {
			if (key.name.startsWith('article:')) {
				const article = await kv.get(key.name, { type: 'json' });
				if (article) {
					articles.push({
						id: key.name.replace('article:', ''),
						...article
					});
				}
			}
		}

		// 按发布日期倒序排序
		articles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

		return new Response(JSON.stringify(articles), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err: any) {
		return new Response(JSON.stringify({ error: err.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
