export const prerender = false;

const session = Astro.cookies.get('admin')?.value;
if (session !== 'yes') {
	return new Response(JSON.stringify({ error: '未登录' }), {
		status: 401,
		headers: { 'Content-Type': 'application/json' }
	});
}

if (Astro.request.method !== 'POST') {
	return new Response(JSON.stringify({ error: 'Method not allowed' }), {
		status: 405,
		headers: { 'Content-Type': 'application/json' }
	});
}

try {
	const data = await Astro.request.json();
	const { id } = data;
	
	if (!id) {
		return new Response(JSON.stringify({ error: '文章 ID 必填' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const kv = (Astro.locals.runtime as any)?.env?.BLOG_STORE;
	if (!kv) {
		return new Response(JSON.stringify({ error: 'KV 存储未配置' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	await kv.delete('article:' + id);
	
	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
} catch (e: any) {
	return new Response(JSON.stringify({ error: e.message }), {
		status: 500,
		headers: { 'Content-Type': 'application/json' }
	});
}
