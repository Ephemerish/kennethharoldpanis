// import Topbar from "./layout/topbar/topbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/home";
import Projects from "./pages/projects/projects";
import Blogs from "./pages/blogs/blogs";
import Contact from "./pages/contact/contact";
import Navbar from "./layout/navbar/navbar";

function App() {
  return (
    <div className="h-full">
      <Navbar />
      <div className="items-center justify-center flex flex-col h-full">
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/projects" Component={Projects} />
          <Route path="/blogs" Component={Blogs} />
          <Route path="/contact" Component={Contact} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
