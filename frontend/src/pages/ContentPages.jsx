import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

const pageCopy = {
  faq: {
    title: 'Frequently Asked Questions',
    empty: 'FAQs will be published here from the admin CMS.',
  },
  blogs: {
    title: 'Expert Blogs',
    empty: 'Expert articles will be published here from the admin CMS.',
  },
  team: {
    title: 'Our Team',
    empty: 'Team profiles will be published here from the admin CMS.',
  },
  gallery: {
    title: 'Gallery',
    empty: 'Clinic, product, and event images will be published here from the admin CMS.',
  },
  testimonials: {
    title: 'Testimonials',
    empty: 'Patient and student testimonials will be published here from the admin CMS.',
  },
  education: {
    title: 'Education',
    empty: 'Education resources and courses will be published here from the admin CMS.',
  },
};

const policyFallbacks = {
  'privacy-policy': {
    title: 'Privacy Policy',
    body: 'This page is prepared for Synergy Medical Yoga policy content. The final legal text should be reviewed and published by the business team before launch.',
  },
  'return-refund-policy': {
    title: 'Return & Refund Policy',
    body: 'This page is prepared for Synergy Medical Yoga return and replacement policy content. The final policy should be reviewed and published by the business team before launch.',
  },
  'terms-and-conditions': {
    title: 'Terms & Conditions',
    body: 'This page is prepared for Synergy Medical Yoga terms and conditions. The final legal text should be reviewed and published by the business team before launch.',
  },
  'shipping-policy': {
    title: 'Shipping & Delivery Policy',
    body: 'This page is prepared for Synergy Medical Yoga shipping and delivery policy content. The final policy should be reviewed and published by the business team before launch.',
  },
};

export function CmsListingPage({ type }) {
  const copy = pageCopy[type] || { title: 'Content', empty: 'Content will be published here from the admin CMS.' };
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.getPublicContent(type)
      .then((res) => {
        if (active) setItems(res.data || []);
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [type]);

  return (
    <div className="font-inter text-[#555555] bg-white min-h-screen pb-20">
      <section className="bg-[#005550] py-16 px-4 text-center text-white">
        <h1 className="font-sansita text-4xl sm:text-5xl font-bold">{copy.title}</h1>
      </section>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {loading ? (
          <p className="text-sm font-semibold text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <div className="bg-[#f4f7f8] border border-gray-200 rounded-2xl p-8 text-center text-sm text-gray-600">
            {copy.empty}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <article key={item._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                {item.imageUrl && <img src={item.imageUrl} alt={item.imageAlt || item.title} className="w-full h-48 object-cover" />}
                <div className="p-5 space-y-2">
                  <p className="text-[10px] uppercase font-extrabold text-[#005550]">{item.category || item.type}</p>
                  <h2 className="font-poppins font-bold text-lg text-gray-900">{item.title}</h2>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{item.excerpt || item.body}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function PolicyPage({ slug }) {
  const fallback = policyFallbacks[slug] || policyFallbacks['privacy-policy'];
  const [policy, setPolicy] = useState(null);

  useEffect(() => {
    let active = true;
    api.getPublicContentItem('policy', slug)
      .then((res) => {
        if (active) setPolicy(res.data);
      })
      .catch(() => {
        if (active) setPolicy(null);
      });
    return () => { active = false; };
  }, [slug]);

  const title = policy?.title || fallback.title;
  const body = policy?.body || fallback.body;

  return (
    <div className="font-inter text-[#555555] bg-white min-h-screen pb-20">
      <section className="bg-[#005550] py-16 px-4 text-center text-white">
        <h1 className="font-sansita text-4xl sm:text-5xl font-bold">{title}</h1>
      </section>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {body}
        </div>
      </section>
    </div>
  );
}
