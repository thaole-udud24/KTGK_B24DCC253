import NavBar from "../../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import articlesData from "../../assets/data/articles.json";
import styles from "./postUpsert.module.css";

type Article = {
  id: string | number;
  title: string;
  author: string;
  publishedAt: string;
  thumbnail: string;
  shortDescription: string;
  content: string;
  category: string;
};

const LS_KEY = "articles";

// Helpers: đọc/ghi localStorage (fallback về articles.json)
const getArticles = (): Article[] => {
  const raw = localStorage.getItem(LS_KEY);
  return raw ? JSON.parse(raw) : (articlesData as Article[]);
};
const saveArticles = (next: Article[]) =>
  localStorage.setItem(LS_KEY, JSON.stringify(next));

export default function PostUpsertPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const all = useMemo(() => getArticles(), []);
  const isEdit = Boolean(id);

  const [article, setArticle] = useState<Article | null>(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    thumbnail: "",
    content: "",
    category: "",
  });

  useEffect(() => {
    if (isEdit) {
      const found = all.find((a) => String(a.id) === String(id)) || null;
      if (!found) {
        alert("Không tìm thấy bài viết");
        navigate("/posts");
        return;
      }
      setArticle(found);
      setForm({
        title: found.title,
        author: found.author,
        thumbnail: found.thumbnail,
        content: found.content,
        category: found.category,
      });
    }
  }, [isEdit, id, all, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values = form;

    if (!values.title || !values.author || !values.content) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!isEdit) {
      const newItem: Article = {
        id: Date.now(),
        title: values.title,
        author: values.author,
        thumbnail: values.thumbnail,
        content: values.content,
        shortDescription: values.content.slice(0, 100),
        category: values.category,
        publishedAt: new Date().toLocaleDateString("vi-VN"),
      };
      const next = [newItem, ...all];
      saveArticles(next);
      alert("Đăng bài thành công!");
      navigate("/posts");
    } else {
      const next = all.map((a) =>
        String(a.id) === String(id)
          ? {
              ...a,
              ...values,
              shortDescription: values.content.slice(0, 100),
            }
          : a
      );
      saveArticles(next);
      alert("Cập nhật thành công!");
      navigate(`/posts/${id}`);
    }
  };

  const handleDelete = () => {
    if (!isEdit) return;
    const ok = confirm("Bạn có chắc muốn xóa bài viết này?");
    if (!ok) return;
    const next = all.filter((a) => String(a.id) !== String(id));
    saveArticles(next);
    alert("Đã xóa bài viết!");
    navigate("/posts");
  };

  return (
    <div className={styles.page}>
      <NavBar />

      <div className={styles.formContainer}>
        <h1>{isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Tiêu đề</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề bài viết"
            />
          </div>

          <div className={styles.field}>
            <label>Tác giả</label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Tên tác giả"
            />
          </div>

          <div className={styles.field}>
            <label>Danh mục</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Ví dụ: Tâm lý, Khoa học, Kinh tế..."
            />
          </div>

          <div className={styles.field}>
            <label>Ảnh bìa (URL)</label>
            <input
              type="text"
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              placeholder="Dán link ảnh bìa..."
            />
          </div>

          <div className={styles.field}>
            <label>Nội dung</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={8}
              placeholder="Nhập nội dung bài viết..."
            ></textarea>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.btnPrimary}>
              {isEdit ? "Cập nhật" : "Đăng bài"}
            </button>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => navigate(-1)}
            >
              Hủy
            </button>
            {isEdit && (
              <button
                type="button"
                className={styles.btnDanger}
                onClick={handleDelete}
              >
                Xóa
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
