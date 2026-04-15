export const prerender = false;

export async function POST({ request, locals }: any) {
	try {
		const data = await request.json();
		const { id } = data;
		
		if (!id) {
			return new Response(JSON.stringify({ error: '缺少 ID' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const kv = locals.runtime?.env?.BLOG_STORE;
		if (kv) {
			await kv.delete('article:' + id);
			return new Response(JSON.stringify({ success: true }), {
				status: 200,
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
