import React from 'react';
import styles from './ArticleCard.module.css';

function ArticleCard({ article, onClick }) {
  // Safety check for article prop
  if (!article) {
    console.error('ArticleCard: article prop is required');
    return null;
  }

  const handleClick = () => {
    if (onClick) {
      onClick(article);
    }
  };

  const categoryColors = {
    nutrition: '#A8D8A8',
    exercise: '#FFB5A7',
    wellness: '#C8A8E9',
    preparation: '#F4A261'
  };

  const categoryColor = categoryColors[article.category] || '#F4A6CD';

  return (
    <div 
      className={styles.articleCard} 
      onClick={handleClick}
      style={{ '--category-color': categoryColor }}
    >
      {/* Article Image/Icon */}
      <div className={styles.articleImage}>
        <span className={styles.articleIcon}>{article.image}</span>
        <div className={styles.categoryBadge}>
          {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
        </div>
      </div>

      {/* Article Content */}
      <div className={styles.articleContent}>
        <h3 className={styles.articleTitle}>{article.title}</h3>
        <p className={styles.articleExcerpt}>{article.excerpt}</p>
        
        {/* Article Meta */}
        <div className={styles.articleMeta}>
          <span className={styles.author}>By {article.author}</span>
          <span className={styles.readTime}>{article.readTime}</span>
        </div>

        {/* Article Tags */}
        <div className={styles.articleTags}>
          {article.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Read More Button */}
      <div className={styles.readMoreSection}>
        <button className={styles.readMoreButton}>
          Read Article
          <span className={styles.readMoreIcon}>�</span>
        </button>
      </div>

      {/* Hover Effect */}
      <div className={styles.hoverOverlay} />
    </div>
  );
}

export default ArticleCard;