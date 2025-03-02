import React from "react";
import { Helmet } from "react-helmet-async";

const Contact: React.FC = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Contact</title>
      </Helmet>
      <h1>Contact Page</h1>
      <p>This is the contact page.</p>
    </div>
  );
};

export default Contact;
