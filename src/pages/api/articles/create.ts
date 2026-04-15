---
// API: 创建或更新文章
export const prerender = false;

export async function POST({ request, locals }) {
	const kv = locals.runtime.env.BLOG_STORE;
	
	if (!kv) {
		return new Response(JSON.stringify({ error: '存储未配置' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const body = await request.json();
		const { title, description, pubDate, heroImage, content } = body;

		if (!title || !description || !pubDate || !content) {
			return new Response(JSON.stringify({ error: '缺少必填字段' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// 生成文章 ID（使用标题拼音或时间戳）
		const id = generateId(title);
		const articleKey = `article:${id}`;

		const article = {
			title,
			description,
			pubDate,
			heroImage: heroImage || '',
			content,
			updatedDate: new Date().toISOString()
		};

		await kv.put(articleKey, JSON.stringify(article));

		return new Response(JSON.stringify({ id, success: true }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

export async function PUT({ request, locals }) {
	const kv = locals.runtime.env.BLOG_STORE;
	
	if (!kv) {
		return new Response(JSON.stringify({ error: '存储未配置' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const body = await request.json();
		const { id, title, description, pubDate, heroImage, content } = body;

		if (!id || !title || !description || !pubDate || !content) {
			return new Response(JSON.stringify({ error: '缺少必填字段' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const articleKey = `article:${id}`;
		const existing = await kv.get(articleKey, { type: 'json' });

		if (!existing) {
			return new Response(JSON.stringify({ error: '文章不存在' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const article = {
			title,
			description,
			pubDate,
			heroImage: heroImage || '',
			content,
			updatedDate: new Date().toISOString()
		};

		await kv.put(articleKey, JSON.stringify(article));

		return new Response(JSON.stringify({ success: true }), {
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

export async function DELETE({ request, locals }) {
	const kv = locals.runtime.env.BLOG_STORE;
	
	if (!kv) {
		return new Response(JSON.stringify({ error: '存储未配置' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const body = await request.json();
		const { id } = body;

		if (!id) {
			return new Response(JSON.stringify({ error: '缺少文章 ID' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const articleKey = `article:${id}`;
		await kv.delete(articleKey);

		return new Response(JSON.stringify({ success: true }), {
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

function generateId(title: string): string {
	// 简单生成 ID：使用时间戳 + 标题前缀
	const timestamp = Date.now().toString(36);
	const titlePrefix = title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '').substring(0, 10);
	return `${timestamp}-${titlePrefix}`;
}

---
