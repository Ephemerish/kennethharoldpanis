/** Paging for /blogs: page 1 is /blogs, page n is /blogs/page/n. */
import { lists } from "@data/settings";

export const POSTS_PER_PAGE = lists.postsPerPage;

export const pageHref = (page: number) => (page <= 1 ? "/blogs" : `/blogs/page/${page}`);

export const pageCount = (total: number) => Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
