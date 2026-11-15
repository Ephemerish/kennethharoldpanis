/** Paging for /blogs: page 1 is /blogs, page n is /blogs/page/n. */
export const POSTS_PER_PAGE = 6;

export const pageHref = (page: number) => (page <= 1 ? "/blogs" : `/blogs/page/${page}`);

export const pageCount = (total: number) => Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
