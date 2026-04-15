export const prerender = false;

export async function onRequestGet({ params, locals }: any) {
	const { slug } = params;

	if (!slug) {
		return new Response(JSON.stringify({ error: '文章不存在' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const kv = locals.runtime?.env?.BLOG_STORE;
		
		if (kv) {
			const article = await kv.get('article:' + slug, { type: 'json' });
			if (article) {
				return new Response(JSON.stringify(article), {
					status: 200,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}
		
		return new Response(JSON.stringify({ error: '文章不存在' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e: any) {
		return new Response(JSON.stringify({ error: e.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

export async function onRequestPost() {
	return new Response(JSON.stringify({ error: 'Method not allowed' }), {
		status: 405,
		headers: { 'Content-Type': 'application/json' }
	});
}
