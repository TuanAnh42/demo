// data.js
export async function fetchPostsByCategorySlug(slug, count = 5) {
  try {
    const catRes = await fetch(`https://up5sure.com/wp-json/wp/v2/categories?slug=${slug}`);
    const catData = await catRes.json();
    if (!catData.length) return [];

    const catId = catData[0].id;
    const postRes = await fetch(`https://up5sure.com/wp-json/wp/v2/posts?categories=${catId}&_embed&per_page=${count}`);
    const posts = await postRes.json();

    return posts.map(post => ({
      id: post.id,
      title: post.title.rendered,
      link: post.link,
      img: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'img/placeholder.png',
      excerpt: post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, ""),
      categorySlug: slug
    }));
  } catch (error) {
    console.error("Lỗi khi fetch posts:", error);
    return [];
  }
}

export async function fetchAllCategories() {
  try {
    const res = await fetch('https://up5sure.com/wp-json/wp/v2/categories?per_page=100');
    const categories = await res.json();
    return categories.filter(cat => cat.count > 0).map(cat => cat.slug);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách categories:', error);
    return [];
  }
}

export function shuffleAndPick(array, count) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

