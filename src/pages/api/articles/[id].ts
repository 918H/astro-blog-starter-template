// API: 获取单篇文章详情
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
	const kv = (locals as any).runtime?.env?.BLOG_STORE;
	
	if (!kv) {
		return new Response(JSON.stringify({ error: '存储未配置' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const { id } = params;
		const articleKey = `article:${id}`;
		const article = await kv.get(articleKey, { type: 'json' });

		if (!article) {
			return new Response(JSON.stringify({ error: '文章不存在' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return new Response(JSON.stringify({ id, ...article }), {
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
