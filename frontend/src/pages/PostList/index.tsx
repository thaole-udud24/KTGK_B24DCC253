import NavBar from "../../components/Navbar";
import styles from "./styles.module.scss";
import articlesData from "../../assets/data/articles.json";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Article = {
  id: string | number;
  title: string;
  author: string;
  publishedAt: string;
  thumbnail: string;
  shortDescription: string;
  content?: string;
  category?: string;
};

export default function PostsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Tải toàn bộ danh sách
    setArticles(articlesData as Article[]);
  }, []);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return articles;
    return articles.filter((a) => a.title.toLowerCase().includes(k));
  }, [q, articles]);

  return (
    <div className={styles.container}>
      <NavBar />

      <div className={styles.header}>
        <div>
          <h1>Tất cả bài viết</h1>
          <p className={styles.sub}>Tổng số: {filtered.length} bài</p>
        </div>

        <div className={styles.actions}>
          <input
            className={styles.search}
            placeholder="Tìm theo tiêu đề…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className={styles.addBtn} onClick={() => navigate("/create")}>
            + Thêm bài
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((a) => (
          <article key={a.id} className={styles.card}>
            <div className={styles.thumbWrap}>
              <img src={a.thumbnail} alt={a.title} />
              <span className={styles.badge}>{a.category ?? "Bài viết"}</span>
            </div>

            <div className={styles.body}>
              <h3 className={styles.title}>{a.title}</h3>
              <p className={styles.meta}>
                {a.author} • {a.publishedAt}
              </p>
              <p className={styles.desc}>{a.shortDescription}…</p>

              <div className={styles.btnRow}>
                <Link to={`/posts/${a.id}`} className={styles.detailBtn}>
                  Xem chi tiết
                </Link>

                <button
                  className={styles.editBtn}
                  onClick={() => navigate(`/posts/edit/${a.id}`)}
                >
                  Sửa
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>Không có bài viết nào phù hợp.</div>
      )}
    </div>
  );
}
