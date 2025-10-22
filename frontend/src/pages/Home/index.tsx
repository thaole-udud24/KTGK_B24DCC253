import NavBar from "../../components/Navbar";
import styles from "./styles.module.scss";
import articlesData from "../../assets/data/articles.json";
import { useEffect, useState } from "react";

export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    setArticles(articlesData.slice(0, 3));
  }, []);

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.subContainer}>
        <h1>Bài viết mới</h1>

        <div className={styles.cardWrapper}>
          {articles.map((article) => (
            <div key={article.id} className={styles.card}>
              <img src={article.thumbnail} alt={article.title} />
              <div className={styles.cardBody}>
                <h3>{article.title}</h3>
                <p className={styles.meta}>
                  {article.author} • {article.publishedAt}
                </p>
                <p>{article.shortDescription}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
