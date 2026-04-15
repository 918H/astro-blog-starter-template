export const prerender = false;

interface ArticleData {
	title: string;
	description?: string;
	content: string;
}

export async function onRequestPost({ request, locals, cookies, params }: any) {
	const session = cookies.get('admin')?.value;
	if (session !== 'yes') {
		return new Response(JSON.stringify({ error: '未登录' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	if (request.method !== 'POST') {
		return new Response(JSON.stringify({ error: 'Method not allowed' }), {
			status: 405,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const data = await request.json();
		const { title, description, content } = data;
		
		if (!title || !content) {
			return new Response(JSON.stringify({ error: '标题和内容必填' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const kv = locals.runtime?.env?.BLOG_STORE;
		if (!kv) {
			return new Response(JSON.stringify({ error: 'KV 存储未配置' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const id = Date.now().toString(36);
		const article = {
			title,
			description: description || title.substring(0, 50),
			content,
			pubDate: new Date().toISOString(),
			type: 'blog'
		};
		await kv.put('article:' + id, JSON.stringify(article));
		
		return new Response(JSON.stringify({ success: true, id }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e: any) {
		return new Response(JSON.stringify({ error: e.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

export async function onRequestGet() {
	return new Response(JSON.stringify({ error: 'Method not allowed' }), {
		status: 405,
		headers: { 'Content-Type': 'application/json' }
	});
}
