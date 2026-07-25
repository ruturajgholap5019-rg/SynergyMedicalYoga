export const PRODUCTS = [
  {
    id: 'knee-stabilizer',
    name: 'Knee Stabilizer Belts Sports Edition',
    category: 'Orthopaedic Belts',
    price: 1249.00,
    originalPrice: 1599.00,
    rating: 4.9,
    reviewsCount: 48,
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Designed specifically keeping in mind the overuse of knee joints during active sports like running, cycling, trekking, and gym workouts, as well as age-related stiffness. Integrates yoga biomechanics with orthopedic alignment.',
    features: [
      'Ergonomic Velcro adjustment straps for snug, targeted support',
      'Breathable, moisture-wicking medical grade neoprene weave',
      'Dual lateral stabilization stays to prevent patellar deviation',
      'Ideal for Osteoarthritis conservative management & sports recovery'
    ],
    sizes: ['Small (12-14 in)', 'Medium (14-16 in)', 'Large (16-18 in)', 'XL (18-20 in)'],
    inStock: true
  },
  {
    id: 'neck-pain-kit',
    name: 'Posture Correction & Neck Pain Relief Kit',
    category: 'Relief Kits',
    price: 1180.00,
    originalPrice: 1450.00,
    rating: 4.8,
    reviewsCount: 36,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Comprehensive neck traction & posture re-alignment kit tailored for professionals suffering from forward head posture ("tech neck"), cervical spondylosis, and upper back tightness.',
    features: [
      'Cervical traction belt with multi-angle anchor strap',
      'High-density posture alignment wedge block',
      'Illustrated step-by-step Rope & Belt Therapy daily exercise manual',
      'Compact travel pouch included'
    ],
    sizes: ['Standard Universal Size'],
    inStock: true
  },
  {
    id: 'corporate-wellness-kit',
    name: 'Ergonomic Wellness Kit for Corporate Employees',
    category: 'Wellness Kits',
    price: 1980.00,
    originalPrice: 2499.00,
    rating: 5.0,
    reviewsCount: 92,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Proven greatly useful for those in desk jobs. Trusted by corporate employees across Pune, Bengaluru, and Mumbai. Designed for desk-bound posture reset, lumbar spinal decompression, and shoulder opening.',
    features: [
      'Full body Rope & Belt alignment system',
      'Chair-compatible lumbar traction strap',
      'Access to Synergy Mobile App corporate video modules',
      'Designed in consultation with orthopedic surgeons & senior yoga therapists'
    ],
    sizes: ['Universal Adjustable'],
    inStock: true
  }
];

export const TEAM_MEMBERS = [
  {
    name: 'Manoj Deshmukh',
    role: 'Founder & Chief Executive Officer',
    bio: 'Pioneered Synergy Medical Yoga with a vision to make non-surgical Rope & Belt therapy accessible across India.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Poonam Deshmukh',
    role: 'Co-Founder & Chief Medical Officer',
    bio: 'Specialist in Medical Yoga biomechanics with 15+ years of clinical experience in non-invasive joint therapy.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Shubham Pawar',
    role: 'Head of Operations & Supply Chain',
    bio: 'Manages certified product manufacturing, quality assurance, and nationwide logistics for clinical kits.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Deepali Kulkarni',
    role: 'Chief Technology Officer & Platform Lead',
    bio: 'Leads the digital technology ecosystem connecting patients with certified Rope & Belt practitioners via our app.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
  }
];

export const RESELLERS_AND_CENTRES = [
  {
    id: 1,
    name: 'Synergy Medical Yoga Therapy Headquarters',
    type: 'Main Center & Clinic',
    address: 'Greens Center, Old Mumbai-Pune Hwy, Chinchwad, Pune, Maharashtra 411033',
    city: 'Pune',
    pincode: '411033',
    phone: '+91 97303 21042',
    email: 'chinchwad@synergymedicalyoga.com',
    hours: 'Mon - Sat: 8:00 AM - 7:30 PM',
    therapists: ['Dr. Poonam Deshmukh', 'Therapist Rajesh Patil'],
    mapUrl: 'https://maps.google.com/?q=Synergy+Medical+Yoga+Chinchwad'
  },
  {
    id: 2,
    name: 'Synergy RBT Center - Baner',
    type: 'Therapy & Reseller Center',
    address: 'Shop No. 4, Apex Business Hub, Baner Road, Baner, Pune 411045',
    city: 'Pune',
    pincode: '411045',
    phone: '+91 98220 45612',
    email: 'baner@synergymedicalyoga.com',
    hours: 'Mon - Sat: 8:30 AM - 7:00 PM',
    therapists: ['Therapist Swati Shinde'],
    mapUrl: 'https://maps.google.com/?q=Baner+Pune'
  },
  {
    id: 3,
    name: 'Synergy Medical Yoga Reseller - Kothrud',
    type: 'Authorized Reseller & Kit Store',
    address: 'Mayur Colony, Ideal Colony, Kothrud, Pune 411038',
    city: 'Pune',
    pincode: '411038',
    phone: '+91 94223 88109',
    email: 'kothrud@synergymedicalyoga.com',
    hours: 'Mon - Sun: 9:00 AM - 8:00 PM',
    therapists: ['Therapist Amit Kulkarni'],
    mapUrl: 'https://maps.google.com/?q=Kothrud+Pune'
  },
  {
    id: 4,
    name: 'Synergy Health Hub - Viman Nagar',
    type: 'Partner Therapy Center',
    address: 'Symbiosis Road, Sakore Nagar, Viman Nagar, Pune 411014',
    city: 'Pune',
    pincode: '411014',
    phone: '+91 91580 33421',
    email: 'vimannagar@synergymedicalyoga.com',
    hours: 'Mon - Sat: 8:00 AM - 6:30 PM',
    therapists: ['Therapist Neha Sharma'],
    mapUrl: 'https://maps.google.com/?q=Viman+Nagar+Pune'
  },
  {
    id: 5,
    name: 'Synergy Rope & Belt Center - Mumbai Dadar',
    type: 'Regional Partner Center',
    address: 'Asiad Building, Dr. B. Ambedkar Road, Dadar East, Mumbai 400014',
    city: 'Mumbai',
    pincode: '400014',
    phone: '+91 98201 12940',
    email: 'mumbai@synergymedicalyoga.com',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    therapists: ['Therapist Sanjay Mehta'],
    mapUrl: 'https://maps.google.com/?q=Dadar+Mumbai'
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Anand Kulkarni',
    role: 'IT Project Manager, PCMC',
    text: 'I suffered from chronic lower back pain and sciatica for over 2 years. Using the Ergonomic Wellness Kit combined with guidance from the Synergy App, my posture has corrected drastically and the nerve pain is gone!',
    rating: 5,
    condition: 'Sciatica & Lumbar Pain'
  },
  {
    id: 2,
    name: 'Sunita Joshi',
    role: 'Certified Yoga Teacher, Pune',
    text: 'The Rope & Belt Therapy certification course by Synergy Medical Yoga completely transformed my teaching methodology. I can now safely assist students with osteoarthritis and joint stiffness.',
    rating: 5,
    condition: 'Therapist Student'
  },
  {
    id: 3,
    name: 'Rajiv Malhotra',
    role: 'Marathon Runner & Trekker',
    text: 'The Knee Stabilizer Belt Sports Edition gave me the support I needed to get back to running without patellar pain. Clinically designed and extremely sturdy.',
    rating: 5,
    condition: 'Knee Pain & Ligament Strain'
  }
];

export const BLOGS = [
  {
    id: 1,
    title: 'How Rope & Belt Therapy Relieves Chronic Back & Sciatica Pain',
    category: 'Pain Management',
    date: 'May 12, 2025',
    readTime: '5 min read',
    excerpt: 'Discover how precise passive traction using medical ropes and belts can decompress lumbar vertebrae without surgical intervention.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: '5 Ergonomic Posture Hacks for Corporate Employees',
    category: 'Corporate Wellness',
    date: 'June 04, 2025',
    readTime: '4 min read',
    excerpt: 'Sitting at your desk for 8+ hours? Simple neck and spinal alignment exercises you can perform right at your workstation.',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Understanding Osteoarthritis: Conservative Care vs. Surgery',
    category: 'Orthopedic Care',
    date: 'July 18, 2025',
    readTime: '6 min read',
    excerpt: 'Why orthopedic specialists recommend non-invasive medical yoga therapy as the first line of defense for knee joint preservation.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80'
  }
];

export const SERVICES_LIST = [
  {
    id: 'knee-therapy',
    title: 'Knee Joint Alignment & Pain Therapy',
    icon: 'Activity',
    description: 'Targeted Rope & Belt biomechanical adjustments for knee osteoarthritis, patellofemoral pain syndrome, and post-sports rehabilitation.',
    details: [
      'Patellar alignment strap therapy',
      'quadriceps muscle lengthening & joint space gap restoration',
      'Non-weight bearing traction protocols'
    ]
  },
  {
    id: 'lumbar-sciatica',
    title: 'Lumbar Spine & Sciatica Decompression',
    icon: 'Shield',
    description: 'Relieve compressed nerve roots and disc bulges using customized belt traction routines supervised by certified practitioners.',
    details: [
      'Passive spinal traction using wall belts',
      'Pelvic tilt realignment exercises',
      'Sciatic nerve glide techniques'
    ]
  },
  {
    id: 'cervical-neck',
    title: 'Cervical Spine & Posture Correction',
    icon: 'Zap',
    description: 'Reverse tech-neck forward head posture, relieve shoulder stiffness, and treat cervical spondylosis symptoms safely.',
    details: [
      'Suboccipital neck traction techniques',
      'Scapular retraction belt support',
      'Daily office-friendly stretch modules'
    ]
  },
  {
    id: 'therapist-training',
    title: 'Certified Rope & Belt Therapy Education',
    icon: 'BookOpen',
    description: 'Structured educational programs for yoga teachers, physiotherapists, and wellness practitioners to get certified in RBT modalities.',
    details: [
      'Comprehensive anatomical curriculum',
      'Hands-on practical clinical training in Pune',
      'Synergy App directory listing & doctor network support'
    ]
  }
];
