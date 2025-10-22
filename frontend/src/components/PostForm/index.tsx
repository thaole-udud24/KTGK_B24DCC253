import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";

export type Category =
  | "Công nghệ"
  | "Du lịch"
  | "Ẩm thực"
  | "Đời sống"
  | "Khác";

export type PostFormValues = {
  title: string;
  author: string;
  thumbnail: string;
  content: string;
  category: Category;
};

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  initialValues?: Partial<PostFormValues>;
  onSubmit: (values: PostFormValues) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  onCancel: () => void;
};

const CATEGORIES: Category[] = [
  "Công nghệ",
  "Du lịch",
  "Ẩm thực",
  "Đời sống",
  "Khác",
];

export default function PostForm({
  mode,
  initialValues,
  onSubmit,
  onDelete,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [author, setAuthor] = useState(initialValues?.author ?? "");
  const [thumbnail, setThumbnail] = useState(initialValues?.thumbnail ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [category, setCategory] = useState<Category>(
    (initialValues?.category as Category) ?? "Công nghệ"
  );

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!initialValues) return;
    setTitle(initialValues.title ?? "");
    setAuthor(initialValues.author ?? "");
    setThumbnail(initialValues.thumbnail ?? "");
    setContent(initialValues.content ?? "");
    setCategory((initialValues.category as Category) ?? "Công nghệ");
  }, [initialValues]);

  const isEdit = mode === "edit";

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 10)
      e.title = "Tiêu đề bắt buộc, tối thiểu 10 ký tự.";
    if (!author.trim() || author.trim().length < 3)
      e.author = "Tác giả bắt buộc, tối thiểu 3 ký tự.";
    if (!content.trim() || content.trim().length < 50)
      e.content = "Nội dung bắt buộc, tối thiểu 50 ký tự.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const disabled = useMemo(() => submitting, [submitting]);

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        author: author.trim(),
        thumbnail: thumbnail.trim(),
        content: content.trim(),
        category,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    const ok = confirm("Bạn có chắc muốn xóa bài viết này?");
    if (!ok) return;
    setSubmitting(true);
    try {
      await onDelete();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>
        {isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết"}
      </h2>

      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>
            Tiêu đề <span>*</span>
          </label>
          <input
            className={`${styles.input} ${errors.title ? styles.invalid : ""}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề (≥ 10 ký tự)"
          />
          {errors.title && <p className={styles.error}>{errors.title}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Tác giả <span>*</span>
          </label>
          <input
            className={`${styles.input} ${errors.author ? styles.invalid : ""}`}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Nhập tên tác giả (≥ 3 ký tự)"
          />
          {errors.author && <p className={styles.error}>{errors.author}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>URL ảnh thumbnail</label>
          <input
            className={styles.input}
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://..."
          />
          {thumbnail && (
            <div className={styles.preview}>
              <img src={thumbnail} alt="Thumbnail preview" />
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Thể loại</label>
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Nội dung <span>*</span>
          </label>
          <textarea
            className={`${styles.textarea} ${
              errors.content ? styles.invalid : ""
            }`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết nội dung (≥ 50 ký tự)"
            rows={12}
          />
          {errors.content && <p className={styles.error}>{errors.content}</p>}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.primary}
            onClick={handleSubmit}
            disabled={disabled}
          >
            {isEdit ? "Cập nhật" : "Đăng bài"}
          </button>

          <button
            className={styles.ghost}
            onClick={onCancel}
            disabled={disabled}
          >
            Hủy
          </button>

          {isEdit && onDelete && (
            <button
              className={styles.danger}
              onClick={handleDelete}
              disabled={disabled}
            >
              Xóa bài viết
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
