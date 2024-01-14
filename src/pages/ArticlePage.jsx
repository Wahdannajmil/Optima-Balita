import React, { useContext } from "react";
import { ArticleContext } from "../contexts/ArticleContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { Link } from "react-router-dom";

const ArticlePage = () => {
  const { articles, isLoading, randomArticles } = useContext(ArticleContext);
  const breadcrumbItems = [
    {
      title: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
        </svg>
      ),
      url: "/",
    },
    { title: "Article" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!Array.isArray(articles.data) || articles.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        Artikel tidak tersedia
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-8 sm:px-24">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-2xl font-bold mb-8">Artikel Pilihan</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="col-span-1">
            {articles.data.slice(0, 1).map((article) => (
              <div key={article.id} className="mb-5">
                <div className="max-w-3xl space-y-4">
                  <div className="relative">
                    <Link to={`/article/${article.id}`}>
                      <img
                        src={article.image}
                        alt={`article pilihan ${article.id}`}
                        className="rounded-lg transition-transform duration-300 transform hover:scale-105"
                      />
                      <h2 className="absolute bottom-0 rounded-b-lg bg-gradient-to-t from-black bg-opacity-40 left-0 w-full px-4 py-4 text-white text-lg font-semibold sm:text-2xl">
                        {article.title}
                      </h2>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="overflow-y-auto h-96 overflow-x-hidden">
            <div>
              {articles.data.map((article) => (
                <div key={article.id} className="mb-4">
                  <Link to={`/article/${article.id}`}>
                    <div className="max-w-xl flex gap-3">
                      <img
                        src={article.image}
                        alt={`article pilihan ${article.id}`}
                        className="max-w-lg w-36 rounded-lg transition-transform duration-300 transform hover:scale-105"
                      />
                      <div>
                        <h2 className="text-lg font-medium">{article.title}</h2>
                        <span className="text-md text-slate-500">
                          {article.created_at}
                        </span>
                        <br />
                        <span className="text-md text-slate-500">
                          {article.author}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="p-8 sm:px-24">
        <h1 className="text-2xl font-bold mb-8 mt-12">Artikel Terbaru</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          {randomArticles?.data?.map((article) => (
            <div
              key={article.id}
              className="max-w-md border-slate-300 border-2 rounded-lg gap-3 shadow-lg hover:shadow-xl transition duration-300"
            >
              <Link to={`/article/${article.id}`}>
                <img
                  src={article.image}
                  alt={`article terbaru ${article.id}`}
                  className="rounded-t-md transition-transform duration-300 transform hover:scale-105"
                />
                <div className="m-2">
                  <h2 className="text-lg font-medium line-clamp-3">
                    {article.title}
                  </h2>
                  <span className="text-md text-slate-500">
                    {article.created_at}
                  </span>
                  <p className="line-clamp-2">{article.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ArticlePage;

