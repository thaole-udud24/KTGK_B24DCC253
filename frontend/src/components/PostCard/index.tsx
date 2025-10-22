export default function ArticleCard({ article }) {
  return (
    <div className="card">
      <img
        src={article.thumbnail}
        alt={article.title}
        className="card-thumbnail"
      />
      <div className="card-content">
        <h3>{article.title}</h3>
        <p className="meta">
          {article.author} • {article.publishedAt}
        </p>
        <p>{article.shortDescription}...</p>
      </div>
    </div>
  );
}
