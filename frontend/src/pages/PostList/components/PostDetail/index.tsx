import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../../../../components/Navbar";
import styles from "./styles.module.scss";
import articlesData from "../../../../assets/data/articles.json";

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

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const found = (articlesData as Article[]).find(
      (a) => String(a.id) === String(id)
    );
    if (found) {
      setArticle(found);
    } else {
      alert("Không tìm thấy bài viết!");
      navigate("/posts");
    }
  }, [id, navigate]);

  if (!article) return null;

  const handleDelete = () => {
    if (confirm("Bạn có chắc muốn xóa bài viết này?")) {
      // TODO: thực hiện xóa (nếu có context / API)
      alert("Đã xóa bài viết!");
      navigate("/posts");
    }
  };

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.wrapper}>
        <button className={styles.backBtn} onClick={() => navigate("/posts")}>
          ← Quay lại
        </button>

        <div className={styles.article}>
          <img
            src={article.thumbnail}
            alt={article.title}
            className={styles.thumbnail}
          />

          <h1 className={styles.title}>{article.title}</h1>
          <p className={styles.meta}>
            {article.author} • {article.publishedAt}
          </p>
          <span className={styles.category}>
            {article.category ?? "Bài viết"}
          </span>

          <p className={styles.short}>{article.shortDescription}</p>

          <div className={styles.content}>
            {article.content ?? "Nội dung bài viết đang được cập nhật..."}
          </div>

          <div className={styles.actions}>
            <button
              className={styles.editBtn}
              onClick={() => navigate(`/posts/edit/${article.id}`)}
            >
              ✏️ Chỉnh sửa
            </button>
            <button className={styles.deleteBtn} onClick={handleDelete}>
              🗑️ Xóa bài viết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
