---
// API: 管理员登录
export const prerender = false;

// TODO: 修改为你的管理员密码
const ADMIN_PASSWORD = 'admin123';

export async function POST({ request, cookies }) {
	try {
		const body = await request.json();
		const { password } = body;

		if (password === ADMIN_PASSWORD) {
			// 设置简单的 session cookie（实际使用建议用 JWT）
			cookies.set('admin_session', 'authenticated', {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7, // 7 天
				path: '/'
			});

			return new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});
		} else {
			return new Response(JSON.stringify({ error: '密码错误' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

---
