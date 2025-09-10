import React, { useState } from 'react';
import Button from '../../common/Button';
import ArticleCard from '../ArticleCard';
import styles from './ResourceLibrary.module.css';

const MOCK_ARTICLES = {
  'pregnancy-guide': [
    {
      id: 1,
      title: 'Your Complete Pregnancy Guide',
      excerpt: 'Everything you need to know about your pregnancy journey from conception to birth.',
      category: 'pregnancy-guide',
      readTime: '10 min read',
      author: 'Dr. Sarah Johnson, OB-GYN',
      image: '📚',
      tags: ['Pregnancy', 'Guide', 'Overview'],
      content: `
        <h2>Your Pregnancy Journey</h2>
        <p>Pregnancy is divided into three trimesters, each bringing unique changes and milestones.</p>
        
        <h3>First Trimester (Weeks 1-12)</h3>
        <p>Your body begins adapting to pregnancy. Morning sickness, fatigue, and breast tenderness are common.</p>
        
        <h3>Second Trimester (Weeks 13-26)</h3>
        <p>Often called the "golden period" - energy returns and you'll feel your baby's first movements.</p>
        
        <h3>Third Trimester (Weeks 27-40)</h3>
        <p>Your baby grows rapidly and you prepare for labor and delivery.</p>
        
        <h3>Important Appointments</h3>
        <p>Regular prenatal checkups, ultrasounds, and screening tests help monitor your baby's health.</p>
      `
    },
    {
      id: 2,
      title: 'Pregnancy Symptoms Week by Week',
      excerpt: 'Understand what to expect during each week of your pregnancy journey.',
      category: 'pregnancy-guide',
      readTime: '8 min read',
      author: 'Dr. Maria Rodriguez',
      image: '📅',
      tags: ['Symptoms', 'Weekly', 'Changes'],
      content: `
        <h2>Common Pregnancy Symptoms</h2>
        <p>Every pregnancy is unique, but here are common experiences throughout each trimester.</p>
        
        <h3>Early Pregnancy (Weeks 1-12)</h3>
        <p>Morning sickness, breast tenderness, fatigue, frequent urination, food aversions.</p>
        
        <h3>Mid Pregnancy (Weeks 13-26)</h3>
        <p>Increased energy, growing belly, baby movements, possible heartburn and back pain.</p>
        
        <h3>Late Pregnancy (Weeks 27-40)</h3>
        <p>Stronger baby movements, shortness of breath, swelling, Braxton Hicks contractions.</p>
      `
    }
  ],
  'baby-development': [
    {
      id: 3,
      title: 'Baby Development by Trimester',
      excerpt: 'Track your baby\'s amazing growth and development throughout pregnancy.',
      category: 'baby-development',
      readTime: '12 min read',
      author: 'Pediatric Specialist Dr. Emily Chen',
      image: '👶',
      tags: ['Development', 'Growth', 'Milestones'],
      content: `
        <h2>Your Baby's Development Journey</h2>
        <p>From a tiny cluster of cells to a fully formed baby - track the incredible transformation.</p>
        
        <h3>First Trimester Development</h3>
        <p>Week 4: Heart begins beating. Week 8: All major organs form. Week 12: Reflexes develop.</p>
        
        <h3>Second Trimester Development</h3>
        <p>Week 16: Gender can be determined. Week 20: You can feel movements. Week 24: Brain development accelerates.</p>
        
        <h3>Third Trimester Development</h3>
        <p>Week 28: Eyes can open and close. Week 32: Bones harden. Week 36: Lungs mature.</p>
      `
    },
    {
      id: 4,
      title: 'Baby Size Comparisons',
      excerpt: 'See how your baby grows from a poppy seed to a watermelon size.',
      category: 'baby-development',
      readTime: '5 min read',
      author: 'Pregnancy Educator Lisa Wang',
      image: '📏',
      tags: ['Size', 'Growth', 'Comparisons'],
      content: `
        <h2>Baby Size by Week</h2>
        <p>Understanding your baby's size helps you visualize their growth journey.</p>
        
        <h3>First Trimester Sizes</h3>
        <p>Week 4: Poppy seed. Week 8: Raspberry. Week 12: Lime.</p>
        
        <h3>Second Trimester Sizes</h3>
        <p>Week 16: Avocado. Week 20: Banana. Week 24: Corn on the cob.</p>
        
        <h3>Third Trimester Sizes</h3>
        <p>Week 28: Eggplant. Week 32: Pineapple. Week 36: Honeydew. Week 40: Watermelon.</p>
      `
    }
  ],
  'nutrition-tips': [
    {
      id: 5,
      title: 'Essential Pregnancy Nutrition',
      excerpt: 'Key nutrients and healthy eating guidelines for you and your growing baby.',
      category: 'nutrition-tips',
      readTime: '8 min read',
      author: 'Registered Dietitian Amanda Foster',
      image: '🥗',
      tags: ['Nutrition', 'Diet', 'Health'],
      content: `
        <h2>Eating for Two: Pregnancy Nutrition</h2>
        <p>Proper nutrition supports your baby's development and keeps you healthy.</p>
        
        <h3>Essential Nutrients</h3>
        <p>Folic acid (400-600mcg), Iron (27mg), Calcium (1000mg), Protein (71g), Omega-3s.</p>
        
        <h3>Healthy Foods to Emphasize</h3>
        <p>Leafy greens, lean proteins, whole grains, dairy, colorful fruits and vegetables.</p>
        
        <h3>Foods to Limit or Avoid</h3>
        <p>High-mercury fish, raw foods, alcohol, excessive caffeine, processed foods.</p>
      `
    },
    {
      id: 6,
      title: 'Pregnancy Meal Planning',
      excerpt: 'Simple, nutritious meal ideas and planning tips for busy expecting mothers.',
      category: 'nutrition-tips',
      readTime: '6 min read',
      author: 'Chef nutritionista Maria Santos',
      image: '🍽️',
      tags: ['Meal Planning', 'Recipes', 'Nutrition'],
      content: `
        <h2>Easy Pregnancy Meal Planning</h2>
        <p>Planning ahead helps ensure you get the nutrients you need without stress.</p>
        
        <h3>Breakfast Ideas</h3>
        <p>Fortified cereal with berries, Greek yogurt parfait, whole grain toast with avocado.</p>
        
        <h3>Lunch Options</h3>
        <p>Quinoa salad with vegetables, lentil soup, turkey and spinach wrap.</p>
        
        <h3>Dinner Solutions</h3>
        <p>Baked salmon with sweet potato, lean beef stir-fry, vegetarian pasta with lots of veggies.</p>
      `
    }
  ],
  'exercise-safe': [
    {
      id: 7,
      title: 'Safe Pregnancy Exercises',
      excerpt: 'Stay active and healthy with pregnancy-safe workouts and modifications.',
      category: 'exercise-safe',
      readTime: '10 min read',
      author: 'Prenatal Fitness Expert Lisa Chen',
      image: '🏃‍♀️',
      tags: ['Exercise', 'Fitness', 'Safety'],
      content: `
        <h2>Staying Active During Pregnancy</h2>
        <p>Regular exercise benefits both you and your baby when done safely.</p>
        
        <h3>Safe Exercise Options</h3>
        <p>Walking, swimming, prenatal yoga, stationary cycling, low-impact aerobics.</p>
        
        <h3>Exercises to Avoid</h3>
        <p>Contact sports, high-impact activities, exercises lying on your back after first trimester.</p>
        
        <h3>Warning Signs to Stop</h3>
        <p>Chest pain, dizziness, headache, muscle weakness, shortness of breath, vaginal bleeding.</p>
      `
    },
    {
      id: 8,
      title: 'Prenatal Yoga Guide',
      excerpt: 'Gentle yoga poses and stretches perfect for pregnancy wellness.',
      category: 'exercise-safe',
      readTime: '7 min read',
      author: 'Certified Prenatal Yoga Instructor Rebecca Miller',
      image: '🧘‍♀️',
      tags: ['Yoga', 'Flexibility', 'Relaxation'],
      content: `
        <h2>Prenatal Yoga Benefits</h2>
        <p>Yoga helps with flexibility, strength, breathing, and relaxation during pregnancy.</p>
        
        <h3>Safe Poses for Each Trimester</h3>
        <p>First trimester: All poses okay. Second: Avoid deep twists. Third: Use props for support.</p>
        
        <h3>Poses to Avoid</h3>
        <p>Deep backbends, intense twists, poses on your back, hot yoga, and inversions.</p>
        
        <h3>Breathing Techniques</h3>
        <p>Practice deep breathing for labor preparation and stress relief.</p>
      `
    }
  ],
  'mental-health': [
    {
      id: 9,
      title: 'Managing Pregnancy Anxiety',
      excerpt: 'Healthy ways to cope with pregnancy worries and emotional changes.',
      category: 'mental-health',
      readTime: '9 min read',
      author: 'Perinatal Psychologist Dr. Amanda Foster',
      image: '🧘‍♀️',
      tags: ['Mental Health', 'Anxiety', 'Wellness'],
      content: `
        <h2>Emotional Wellness During Pregnancy</h2>
        <p>It's normal to experience anxiety and mood changes during pregnancy.</p>
        
        <h3>Common Pregnancy Concerns</h3>
        <p>Baby's health, body changes, parenting readiness, financial worries, labor fears.</p>
        
        <h3>Coping Strategies</h3>
        <p>Mindfulness meditation, regular exercise, adequate sleep, social support, professional counseling.</p>
        
        <h3>When to Seek Help</h3>
        <p>Persistent sadness, extreme anxiety, panic attacks, difficulty functioning, thoughts of self-harm.</p>
      `
    },
    {
      id: 10,
      title: 'Sleep and Rest During Pregnancy',
      excerpt: 'Tips for getting quality sleep and managing pregnancy-related sleep challenges.',
      category: 'mental-health',
      readTime: '6 min read',
      author: 'Sleep Specialist Dr. James Park',
      image: '😴',
      tags: ['Sleep', 'Rest', 'Wellness'],
      content: `
        <h2>Better Sleep During Pregnancy</h2>
        <p>Quality sleep is essential for your health and your baby's development.</p>
        
        <h3>Sleep Position Guidelines</h3>
        <p>Sleep on your left side for better blood flow. Use pillows for support and comfort.</p>
        
        <h3>Common Sleep Issues</h3>
        <p>Frequent urination, heartburn, leg cramps, restless legs, anxiety keeping you awake.</p>
        
        <h3>Sleep Hygiene Tips</h3>
        <p>Consistent bedtime routine, comfortable room temperature, limit screen time before bed.</p>
      `
    }
  ],
  'birth-planning': [
    {
      id: 11,
      title: 'Creating Your Birth Plan',
      excerpt: 'Plan your ideal birth experience while staying flexible for the unexpected.',
      category: 'birth-planning',
      readTime: '12 min read',
      author: 'Certified Midwife Carol Thompson',
      image: '📋',
      tags: ['Birth Plan', 'Labor', 'Delivery'],
      content: `
        <h2>Birth Plan Essentials</h2>
        <p>A birth plan helps communicate your preferences while maintaining flexibility.</p>
        
        <h3>Key Decisions to Consider</h3>
        <p>Pain management options, labor positions, who's present during delivery, cord clamping preferences.</p>
        
        <h3>Pain Management Options</h3>
        <p>Natural methods, epidural, nitrous oxide, water birth, massage and movement.</p>
        
        <h3>Staying Flexible</h3>
        <p>Remember that birth plans may need to change for safety reasons. Focus on your priorities.</p>
      `
    },
    {
      id: 12,
      title: 'Hospital Bag Checklist',
      excerpt: 'Everything you need to pack for a comfortable hospital stay during labor.',
      category: 'birth-planning',
      readTime: '5 min read',
      author: 'Labor & Delivery Nurse Jennifer Walsh',
      image: '🎒',
      tags: ['Hospital', 'Preparation', 'Checklist'],
      content: `
        <h2>Hospital Bag Essentials</h2>
        <p>Pack your bag around 36 weeks to be ready when labor begins.</p>
        
        <h3>For Labor and Delivery</h3>
        <p>Comfortable gown, hair ties, lip balm, phone charger, music playlist, comfortable slippers.</p>
        
        <h3>For After Birth</h3>
        <p>Nursing bras, comfortable pajamas, maternity pads, going-home outfit in two sizes.</p>
        
        <h3>For Baby</h3>
        <p>Going-home outfit (newborn and 0-3 month sizes), car seat properly installed, receiving blanket.</p>
        
        <h3>Important Documents</h3>
        <p>ID, insurance cards, birth plan copies, hospital registration forms, emergency contacts.</p>
      `
    }
  ]
};

const CATEGORIES = {
  all: { label: 'All Resources', icon: '📚', color: '#F4A6CD' },
  'pregnancy-guide': { label: 'Pregnancy Guide', icon: '📚', color: '#F4A6CD' },
  'baby-development': { label: 'Baby Development', icon: '👶', color: '#FFB5A7' },
  'nutrition-tips': { label: 'Nutrition Tips', icon: '🥗', color: '#A8D8A8' },
  'exercise-safe': { label: 'Exercise Safe', icon: '🏃‍♀️', color: '#FFB5A7' },
  'mental-health': { label: 'Mental Health', icon: '🧘‍♀️', color: '#C8A8E9' },
  'birth-planning': { label: 'Birth Planning', icon: '📋', color: '#F4A261' }
};

function ResourceLibrary({ weekSpecific = false, currentWeek = 1 }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const getFilteredArticles = () => {
    try {
      if (selectedCategory === 'all') {
        return Object.values(MOCK_ARTICLES).flat();
      }
      return MOCK_ARTICLES[selectedCategory] || [];
    } catch (error) {
      console.error('Error filtering articles:', error);
      return [];
    }
  };

  const getWeekSpecificArticles = () => {
    try {
      // Return articles relevant to current pregnancy week
      if (currentWeek <= 12) {
        return MOCK_ARTICLES['pregnancy-guide'].slice(0, 1).concat(MOCK_ARTICLES['nutrition-tips'].slice(0, 1));
      } else if (currentWeek <= 24) {
        return MOCK_ARTICLES['baby-development'].concat(MOCK_ARTICLES['exercise-safe'].slice(0, 1));
      } else if (currentWeek <= 36) {
        return MOCK_ARTICLES['mental-health'].concat(MOCK_ARTICLES['birth-planning'].slice(0, 1));
      } else {
        return MOCK_ARTICLES['birth-planning'];
      }
    } catch (error) {
      console.error('Error getting week-specific articles:', error);
      return [];
    }
  };

  const articlesToShow = weekSpecific ? getWeekSpecificArticles() : getFilteredArticles();

  const openArticle = (article) => {
    if (!article) {
      console.error('ResourceLibrary: Attempted to open article with no data');
      return;
    }
    setSelectedArticle(article);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  return (
    <div className={styles.resourceLibrary}>
      {!weekSpecific && (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>📚 Pregnancy Resources</h2>
            <p className={styles.subtitle}>Expert advice and information for your pregnancy journey</p>
          </div>

          {/* Category Filter */}
          <div className={styles.categoryFilter}>
            {Object.entries(CATEGORIES).map(([key, category]) => (
              <button
                key={key}
                className={`${styles.categoryButton} ${selectedCategory === key ? styles.active : ''}`}
                onClick={() => setSelectedCategory(key)}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryLabel}>{category.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Articles Grid */}
      <div className={styles.articlesGrid}>
        {articlesToShow.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => openArticle(article)}
          />
        ))}
      </div>

      {articlesToShow.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h3>No articles found</h3>
          <p>Try selecting a different category</p>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className={styles.modalOverlay} onClick={closeArticle}>
          <div className={styles.articleModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.articleMeta}>
                <span className={styles.articleIcon}>{selectedArticle.image}</span>
                <div>
                  <h2 className={styles.articleTitle}>{selectedArticle.title}</h2>
                  <div className={styles.articleInfo}>
                    <span className={styles.author}>By {selectedArticle.author}</span>
                    <span className={styles.readTime}>{selectedArticle.readTime}</span>
                  </div>
                </div>
              </div>
              <button className={styles.closeButton} onClick={closeArticle}>✕</button>
            </div>
            
            <div className={styles.modalContent}>
              <div 
                className={styles.articleContent}
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
              
              <div className={styles.articleTags}>
                {selectedArticle.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourceLibrary;