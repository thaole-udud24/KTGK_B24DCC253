import NavBar from "../../components/Navbar";
import PostForm, { type PostFormValues } from "../../components/PostForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import articlesData from "../../assets/data/articles.json";

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

  // load 1 lần
  const all = useMemo(() => getArticles(), []);
  const isEdit = Boolean(id);

  // nếu là edit, tìm bài
  const [article, setArticle] = useState<Article | null>(null);
  useEffect(() => {
    if (isEdit) {
      const found = all.find((a) => String(a.id) === String(id)) || null;
      if (!found) {
        alert("Không tìm thấy bài viết");
        navigate("/posts");
        return;
      }
      setArticle(found);
    }
  }, [isEdit, id, all, navigate]);

  // create hoặc update
  const handleSubmit = async (values: PostFormValues) => {
    if (!isEdit) {
      // CREATE
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
      // UPDATE
      const next = all.map((a) =>
        String(a.id) === String(id)
          ? {
              ...a,
              ...values,
              shortDescription: values.content.slice(0, 100),
              // publishedAt: a.publishedAt // giữ nguyên ngày cũ (tuỳ bạn)
            }
          : a
      );
      saveArticles(next);
      alert("Cập nhật thành công!");
      navigate(`/posts/${id}`);
    }
  };

  // delete chỉ khi edit
  const handleDelete = async () => {
    if (!isEdit) return;
    const ok = confirm("Bạn có chắc muốn xóa bài viết này?");
    if (!ok) return;
    const next = all.filter((a) => String(a.id) !== String(id));
    saveArticles(next);
    alert("Đã xóa bài viết!");
    navigate("/posts");
  };

  return (
    <>
      <NavBar />
      <PostForm
        mode={isEdit ? "edit" : "create"}
        initialValues={
          isEdit && article
            ? {
                title: article.title,
                author: article.author,
                thumbnail: article.thumbnail,
                content: article.content,
                category: article.category as any,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onDelete={isEdit ? handleDelete : undefined}
        onCancel={() => (isEdit ? navigate(`/posts/${id}`) : navigate(-1))}
      />
    </>
  );
}
