export async function onRequestGet(context) {
  const { env } = context;

  const result = await env.DB
    .prepare(`
      SELECT
        b.id,
        b.title,
        b.content,
        b.published_at,
        b.views,
        b.created_at,
        COUNT(DISTINCT l.id) AS likes,
        COUNT(DISTINCT c.id) AS comments
      FROM blogs b
      LEFT JOIN likes l ON l.blog_id = b.id
      LEFT JOIN comments c ON c.blog_id = b.id
      GROUP BY b.id
      ORDER BY b.id ASC
    `)
    .all();

  return Response.json(result.results);
}
