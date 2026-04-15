---
// API: 获取博客文章内容（用于动态渲染）
export const prerender = false;

export async function GET({ params, locals }) {
	const kv = locals.runtime.env.BLOG_STORE;
	
	if (!kv) {
		return new Response(JSON.stringify({ error: '存储未配置' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const { slug } = params;
		const articleKey = `article:${slug}`;
		const article = await kv.get(articleKey, { type: 'json' });

		if (!article) {
			return new Response(JSON.stringify({ error: '文章不存在' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return new Response(JSON.stringify({ slug, ...article }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

---
