import React from "react";
import { Helmet } from "react-helmet-async";

const Projects: React.FC = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Project</title>
      </Helmet>
      <h1>Projects Page</h1>
      <p>This is the projects page.</p>
    </div>
  );
};

export default Projects;
