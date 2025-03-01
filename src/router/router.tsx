import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/home/home";
import Projects from "../pages/projects/projects";
import Blogs from "../pages/blogs/blogs";
import Contact from "../pages/contact/contact";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/projects" Component={Projects} />
      <Route path="/blogs" Component={Blogs} />
      <Route path="/contact" Component={Contact} />
    </Routes>
  );
};

export default AppRouter;
