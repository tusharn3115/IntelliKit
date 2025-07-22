import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import BlogTitle from "./pages/BlogTitle";
import WriteArticle from "./pages/WriteArticle";
import ReviewResume from "./pages/ReviewResume";
import GenerateImg from "./pages/GenerateImg";
import RemoveBg from "./pages/RemoveBg";
import RemoveObject from "./pages/RemoveObject";
import Community from "./pages/Community";

import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route path="/ai" element={<Dashboard />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-title" element={<BlogTitle />} />
          <Route path="generate-img" element={<GenerateImg />} />
          <Route path="remove-bg" element={<RemoveBg />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="community" element={<Community />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
