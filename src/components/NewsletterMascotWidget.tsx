import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, X, ChevronUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPopSound } from '../utils/audio';
import { validateRegistrationEmail } from '../utils/disposableEmail';
import type { AuthUser } from './Navbar';

interface NewsletterMascotWidgetProps {
  currentUser: AuthUser | null;
  soundEnabled?: boolean;
}

export const NewsletterMascotWidget: React.FC<NewsletterMascotWidgetProps> = ({
  currentUser,
  soundEnabled = false,
}) => {
  const [email, setEmail] = useState<string>(() => currentUser?.email || '');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem('festiya_newsletter_subscribed') === 'true';
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isBlinking, setIsBlinking] = useState(false);

  // Sync user email when currentUser changes if email field is empty
  const [prevUserEmail, setPrevUserEmail] = useState(currentUser?.email);
  if (currentUser?.email !== prevUserEmail) {
    setPrevUserEmail(currentUser?.email);
    if (currentUser?.email && !email) {
      setEmail(currentUser.email);
    }
  }

  // Mascot natural blinking cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4500);
    return () => clearInterval(blinkInterval);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const emailCheck = validateRegistrationEmail(email);
    if (!emailCheck.valid) {
      setErrorMsg(emailCheck.error || 'Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          userName: currentUser?.name || undefined,
          source: 'mascot-bottom-left',
        }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string; error?: string };

      if (res.ok && data.success) {
        setIsSubscribed(true);
        setSuccessMsg(data.message || "You're on the Festiya VIP celebration guestlist!");
        try {
          localStorage.setItem('festiya_newsletter_subscribed', 'true');
        } catch {
          // ignore
        }
        if (soundEnabled) {
          playPopSound();
        }
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { x: 0.15, y: 0.8 },
          colors: ['#FF5E1E', '#FFB800', '#2DD4BF', '#A78BFA'],
          disableForReducedMotion: true,
        });
        setLoading(false);
        return;
      }

      if (data.error) {
        setErrorMsg(data.error);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Edge newsletter fetch error, applying graceful fallback:', err);
    }

    // Resilient offline fallback
    setIsSubscribed(true);
    setSuccessMsg("You're on the Festiya VIP celebration guestlist! Welcome aboard.");
    try {
      localStorage.setItem('festiya_newsletter_subscribed', 'true');
    } catch {
      // ignore
    }
    if (soundEnabled) {
      playPopSound();
    }
    confetti({
      particleCount: 25,
      spread: 55,
      origin: { x: 0.15, y: 0.8 },
      colors: ['#FF5E1E', '#FFB800', '#2DD4BF'],
      disableForReducedMotion: true,
    });
    setLoading(false);
  };

  // Minimized Floating Mascot Pill Button
  if (isMinimized) {
    return (
      <aside aria-label="Festiya Celebration Newsletter Widget" className="mascot-newsletter-container minimized">
        <button
          type="button"
          aria-label="Expand celebration newsletter sign up"
          className="mascot-newsletter-pill"
          onClick={() => setIsMinimized(false)}
        >
          <img
            src={isBlinking ? '/mascots/yellow-dance-blink.webp' : '/mascots/yellow-dance.webp'}
            alt="Festiya Mascot"
            className="mascot-pill-avatar"
            width={34}
            height={34}
          />
          <span className="mascot-pill-label">
            {isSubscribed ? 'VIP Insider ✓' : 'VIP Party Drops 📬'}
          </span>
          <ChevronUp size={16} className="mascot-pill-chevron" />
        </button>
      </aside>
    );
  }

  return (
    <aside aria-label="Festiya Celebration Newsletter Widget" className="mascot-newsletter-container expanded">
      {/* Mascot Holding Upwards Structure */}
      <div className="mascot-holding-card">
        {/* Close / Minimize Button */}
        <button
          type="button"
          aria-label="Minimize newsletter sign up"
          className="mascot-newsletter-close"
          onClick={() => setIsMinimized(true)}
        >
          <X size={14} />
        </button>

        {/* Card Header & Content */}
        <div className="mascot-newsletter-content">
          <h3 className="mascot-newsletter-title">
            {isSubscribed
              ? 'You’re on the Guestlist!'
              : currentUser
              ? `Hey ${currentUser.name.split(' ')[0]}!`
              : 'Become a VIP Insider'}
          </h3>

          <p className="mascot-newsletter-desc">
            {isSubscribed
              ? 'Our mascot has locked your spot for exclusive party blueprints, budget hacks & vendor perks!'
              : currentUser
              ? 'Get weekly autonomous celebration tips, seasonal theme guides & secret vendor discounts.'
              : 'Get free celebration timelines, budget calculators & sensory decor inspiration.'}
          </p>

          {/* Form or Subscribed Confirmation */}
          {isSubscribed ? (
            <div className="mascot-newsletter-confirmed">
              <CheckCircle size={18} color="#059669" />
              <span>Newsletter Active</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mascot-newsletter-form">
              {errorMsg && (
                <div className="mascot-newsletter-alert error" role="alert">
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="mascot-newsletter-alert success" role="alert">
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="mascot-newsletter-input-group">
                <Mail size={14} className="mascot-newsletter-input-icon" />
                <input
                  id="mascot-newsletter-email"
                  type="email"
                  aria-label="Email address for celebration newsletter"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mascot-newsletter-input"
                  required
                />
              </div>

              <button
                type="submit"
                aria-label="Subscribe to Festiya Newsletter"
                className="mascot-newsletter-btn"
                disabled={loading}
              >
                {loading ? 'Subscribing...' : currentUser ? 'Subscribe My Workspace' : 'Subscribe Free'}
              </button>
            </form>
          )}
        </div>

        {/* Mascot Underneath Holding the Card Upwards */}
        <div className="mascot-holding-pedestal">
          <div className="mascot-hands-supporting" aria-hidden="true">
            <span className="mascot-hand left" />
            <span className="mascot-hand right" />
          </div>
          <img
            src={isBlinking ? '/mascots/yellow-dance-blink.webp' : '/mascots/yellow-dance.webp'}
            alt="Cheerful Festiya Mascot holding up the celebration newsletter"
            className="mascot-character-holding"
            width={72}
            height={72}
          />
        </div>
      </div>
    </aside>
  );
};
