import React from "react";
import { Helmet } from "react-helmet-async";
import { Book } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

const Blogs: React.FC = () => {
  const bookIcon = encodeURIComponent(renderToStaticMarkup(<Book />));
  const faviconUrl = `data:image/svg+xml,${bookIcon}`;

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Blogs</title>
        <link rel="canonical" href="http://mysite.com/example" />
        <link rel="icon" type="image/svg+xml" href={faviconUrl} />
      </Helmet>
      <h1>Blogs Page</h1>
      <p>This is the blogs page.</p>
    </div>
  );
};

export default Blogs;
