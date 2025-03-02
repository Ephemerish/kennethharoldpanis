import React from "react";
import { Helmet } from "react-helmet-async";

const Blogs: React.FC = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Blogs</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <h1>Blogs Page</h1>
      <p>This is the blogs page.</p>
    </div>
  );
};

export default Blogs;
