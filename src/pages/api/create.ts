export const prerender = false;

export async function POST({ request, locals }: any) {
	try {
		const data = await request.json();
		const { title, description, pubDate, heroImage, content } = data;
		
		if (!title || !description || !pubDate || !content) {
			return new Response(JSON.stringify({ error: '缺少必填字段' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const kv = locals.runtime?.env?.BLOG_STORE;
		if (kv) {
			const id = Date.now().toString(36) + '-' + title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '').substring(0, 10);
			const article = {
				title,
				description,
				pubDate,
				heroImage: heroImage || '',
				content,
				updatedDate: new Date().toISOString()
			};
			
			await kv.put('article:' + id, JSON.stringify(article));
			
			return new Response(JSON.stringify({ success: true, id }), {
				status: 201,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		return new Response(JSON.stringify({ error: '存储未配置' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e: any) {
		return new Response(JSON.stringify({ error: e.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
