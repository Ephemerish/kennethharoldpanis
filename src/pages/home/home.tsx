import React from "react";
import Header from "./header/header";
import { Helmet } from "react-helmet-async";

const Home: React.FC = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Kenneth Harold Panis</title>
      </Helmet>
      <Header />
    </div>
  );
};

export default Home;
