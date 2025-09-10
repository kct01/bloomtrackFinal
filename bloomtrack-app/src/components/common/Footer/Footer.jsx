// File: src/components/common/Footer/Footer.jsx

import React from 'react';
import styles from './Footer.module.css';

const Footer = ({ 
  showResourceLinks = true, 
  showSupportInfo = true,
  showNewsletter = true,
  compact = false 
}) => {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    alert('Thank you for subscribing! 💕');
    e.target.reset();
  };

  const emergencyContacts = [
    { 
      name: 'Crisis Pregnancy Line', 
      number: '1-800-712-4357',
      description: '24/7 support and counseling'
    },
    { 
      name: 'Postpartum Support', 
      number: '1-800-944-4773',
      description: 'Help for depression and anxiety'
    },
    { 
      name: 'Pregnancy Emergency', 
      number: '911',
      description: 'For immediate medical emergencies'
    }
  ];

  const resourceLinks = [
    { title: 'Pregnancy Guide', href: '/guide', icon: '📖' },
    { title: 'Baby Development', href: '/development', icon: '👶' },
    { title: 'Nutrition Tips', href: '/nutrition', icon: '🥗' },
    { title: 'Exercise Safe', href: '/exercise', icon: '🤰' },
    { title: 'Mental Health', href: '/mental-health', icon: '💆‍♀️' },
    { title: 'Birth Planning', href: '/birth-plan', icon: '🏥' }
  ];

  const communityLinks = [
    { title: 'Support Groups', href: '/groups', icon: '👥' },
    { title: 'Forums', href: '/forums', icon: '💬' },
    { title: 'Success Stories', href: '/stories', icon: '✨' },
    { title: 'Expert Q&A', href: '/experts', icon: '👩‍⚕️' },
    { title: 'Local Events', href: '/events', icon: '📅' },
    { title: 'Partner Support', href: '/partners', icon: '💑' }
  ];

  const appLinks = [
    { title: 'About BloomTrack', href: '/about', icon: '🌸' },
    { title: 'Privacy Policy', href: '/privacy', icon: '🔒' },
    { title: 'Terms of Service', href: '/terms', icon: '📋' },
    { title: 'Contact Us', href: '/contact', icon: '📧' },
    { title: 'Help Center', href: '/help', icon: '❓' },
    { title: 'Feedback', href: '/feedback', icon: '💌' }
  ];

  if (compact) {
    return (
      <footer className={`${styles.footer} ${styles.compact}`}>
        <div className={styles.footerContainer}>
          <div className={styles.compactContent}>
            <div className={styles.compactLogo}>
              <span className={styles.logoEmoji}>🌸</span>
              <span className={styles.brandName}>BloomTrack</span>
            </div>
            <div className={styles.compactLinks}>
              <a href="/about">About</a>
              <a href="/privacy">Privacy</a>
              <a href="/help">Help</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
          <div className={styles.compactBottom}>
            <p>&copy; {currentYear} BloomTrack. Supporting your beautiful journey. 🌸</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Main Footer Content */}
        <div className={styles.footerContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.footerLogo}>
              <div className={styles.logoIcon}>
                <span className={styles.logoEmoji}>🌸</span>
              </div>
              <div className={styles.logoText}>
                <h3 className={styles.brandName}>BloomTrack</h3>
                <p className={styles.brandTagline}>Your journey through motherhood, beautifully supported</p>
              </div>
            </div>
            
            <p className={styles.brandDescription}>
              Supporting expecting mothers with comprehensive tracking, community support, 
              and expert guidance throughout their pregnancy journey.
            </p>

            {/* Newsletter Signup */}
            {showNewsletter && (
              <div className={styles.newsletter}>
                <h4 className={styles.newsletterTitle}>Stay Connected 💕</h4>
                <p className={styles.newsletterDescription}>
                  Get weekly pregnancy tips and updates delivered to your inbox.
                </p>
                <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Enter your email address"
                    className={styles.newsletterInput}
                    required
                  />
                  <button type="submit" className={styles.newsletterBtn}>
                    Subscribe
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Resource Links */}
          {showResourceLinks && (
            <div className={styles.linksSection}>
              <h4 className={styles.sectionTitle}>Pregnancy Resources</h4>
              <ul className={styles.linksList}>
                {resourceLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className={styles.footerLink}>
                      <span className={styles.linkIcon}>{link.icon}</span>
                      <span>{link.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Community Links */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Community & Support</h4>
            <ul className={styles.linksList}>
              {communityLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={styles.footerLink}>
                    <span className={styles.linkIcon}>{link.icon}</span>
                    <span>{link.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* App & Legal Links */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>About BloomTrack</h4>
            <ul className={styles.linksList}>
              {appLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={styles.footerLink}>
                    <span className={styles.linkIcon}>{link.icon}</span>
                    <span>{link.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Support Information */}
        {showSupportInfo && (
          <div className={styles.supportSection}>
            <div className={styles.supportHeader}>
              <h4 className={styles.supportTitle}>🆘 Emergency & Support Resources</h4>
              <p className={styles.supportDescription}>
                If you're experiencing a medical emergency, please call 911 immediately. 
                For pregnancy-related support and mental health resources:
              </p>
            </div>
            
            <div className={styles.emergencyContacts}>
              {emergencyContacts.map((contact, index) => (
                <div key={index} className={styles.emergencyContact}>
                  <div className={styles.contactInfo}>
                    <h5 className={styles.contactName}>{contact.name}</h5>
                    <a href={`tel:${contact.number}`} className={styles.contactNumber}>
                      {contact.number}
                    </a>
                    <p className={styles.contactDescription}>{contact.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.disclaimer}>
              <p>
                <strong>Medical Disclaimer:</strong> BloomTrack is for informational purposes only 
                and should not replace professional medical advice. Always consult with your 
                healthcare provider for medical concerns and decisions.
              </p>
            </div>
          </div>
        )}

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.bottomContent}>
            <div className={styles.copyright}>
              <p>&copy; {currentYear} BloomTrack. All rights reserved.</p>
              <p className={styles.tagline}>Supporting your beautiful journey through motherhood 🌸</p>
            </div>
            
            <div className={styles.socialLinks}>
              <h5 className={styles.socialTitle}>Connect with us:</h5>
              <div className={styles.socialIcons}>
                <a href="#facebook" className={styles.socialLink} aria-label="Facebook">
                  <span>📘</span>
                </a>
                <a href="#instagram" className={styles.socialLink} aria-label="Instagram">
                  <span>📷</span>
                </a>
                <a href="#twitter" className={styles.socialLink} aria-label="Twitter">
                  <span>🐦</span>
                </a>
                <a href="#youtube" className={styles.socialLink} aria-label="YouTube">
                  <span>📺</span>
                </a>
                <a href="#pinterest" className={styles.socialLink} aria-label="Pinterest">
                  <span>📌</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;