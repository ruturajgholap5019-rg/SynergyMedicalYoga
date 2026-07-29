import { useState, useEffect } from 'react';
import { api } from './api';

const defaultSettings = {
  // Statistical Counters
  statsCities: 15,
  statsCenters: 200,
  statsTherapists: 400,
  statsClinics: 35,

  // Hero & Taglines
  heroHeading: 'Guided Training Videos for Therapeutic Exercises at Home',
  heroSubheading: 'Doctor Supervised Non-Surgical Rehabilitation & Rope and Belt Therapy',

  // About Us Content
  aboutCompanyText: 'iMediYog Healthcare LLP is a Pune-based healthcare company with a vision to become a comprehensive Therapy Care Hub, making quality therapy education and services accessible through an integrated ecosystem of certified professionals, technology, and innovative healthcare solutions across multiple therapy disciplines.',
  synergyInitText: 'Synergy Medical Yoga is one of iMediYog Healthcare LLP’s flagship initiatives dedicated to democratizing Rope & Belt Therapy for the prevention and conservative management of knee, back, and neck pain. Through certified education programs, clinically designed therapy products, and a technology platform connecting people with certified Rope & Belt Therapy practitioners, Synergy Medical Yoga is making this specialized therapy more accessible across India.',
  missionText: 'To establish Medical Yoga Therapy as the preferred first-line treatment for individuals managing knee, back, and neck pain.',
  visionText: 'To minimize the need for surgeries by effectively managing degenerative musculoskeletal diseases and injuries of the knee, back, neck, and shoulder.',
  objectiveText: 'To empower every household in India with at least one person trained in Medical Yoga Therapy.',

  // App Promo Content
  appPromoHeading: 'Download Our App\nto Book an Appoiment',
  playStoreUrl: 'https://play.google.com/store/search?q=synergy%20medical&c=apps',
  appStoreUrl: 'https://play.google.com/store/search?q=synergy%20medical&c=apps',
  playStoreQrImage: 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-06-03-at-8.34.11-PM.jpeg',
  appStoreQrImage: 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-07-07-at-1.34.20-PM-1024x1024.jpeg',
  appMockupImage: 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/Download-Our-App-1-scaled-1.png',

  // Contact & Socials
  contactPhone: '+91 97303 21042',
  contactEmail: 'contact@synergymedicalyoga.com',
  contactAddress: 'Pune, Maharashtra, India',
  socialLinkedIn: 'https://www.linkedin.com/company/synergy-medical-yoga',
  socialInstagram: 'https://www.instagram.com',
  socialFacebook: 'https://www.facebook.com',
  socialYouTube: 'https://www.youtube.com',
};

// Global in-memory cache to prevent redundant API network requests across simultaneous component renders
let cachedSettings = null;
let listeners = [];

function notifyListeners() {
  listeners.forEach((listener) => listener(cachedSettings));
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(cachedSettings ? { ...defaultSettings, ...cachedSettings } : defaultSettings);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    let isMounted = true;
    const listener = (newSettings) => {
      if (isMounted && newSettings) {
        setSettings({ ...defaultSettings, ...newSettings });
        setLoading(false);
      }
    };
    listeners.push(listener);

    if (!cachedSettings) {
      api.getPublicSettings()
        .then((res) => {
          if (res && res.data) {
            cachedSettings = res.data;
            notifyListeners();
          }
        })
        .catch(() => {
          // Use default settings without warning in console
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return { settings, loading };
}
