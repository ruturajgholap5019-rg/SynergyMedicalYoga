const { z } = require('zod');

const mongoId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB id');
const safeText = (max = 1000) => z.string().trim().min(1).max(max);
const optionalUrl = z.string().trim().url().optional().or(z.literal(''));

const auth = {
  register: z.object({
    name: safeText(80),
    email: z.string().trim().toLowerCase().email(),
    phone: z.string().trim().min(7).max(20),
    password: z.string().min(8).max(128),
  }),
  login: z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1).max(128),
  }),
  verifyOtp: z.object({
    email: z.string().trim().toLowerCase().email(),
    otp: z.string().trim().regex(/^\d{4,6}$/, 'Verification code must contain 4 or 6 digits'),
  }),
};

const adminUser = {
  create: z.object({
    name: safeText(80),
    email: z.string().trim().toLowerCase().email(),
    phone: z.string().trim().max(20).optional().or(z.literal('')),
    password: z.string().min(8).max(128),
    role: z.enum(['customer', 'admin']).default('customer'),
  }),
  update: z.object({
    name: safeText(80).optional(),
    email: z.string().trim().toLowerCase().email().optional(),
    phone: z.string().trim().max(20).optional().or(z.literal('')),
    role: z.enum(['customer', 'admin']).optional(),
  }),
};

const product = z.object({
  name: safeText(180),
  category: safeText(80),
  price: z.coerce.number().min(0),
  originalPrice: z.coerce.number().min(0).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewsCount: z.coerce.number().int().min(0).optional(),
  description: safeText(5000),
  features: z.array(z.string().trim().max(300)).default([]),
  sizes: z.array(z.string().trim().max(80)).default(['Standard']),
  images: z.array(z.string().trim().max(1000)).default([]),
  inStock: z.boolean().default(true),
});

const service = z.object({
  title: safeText(180),
  category: z.enum(['Spine Therapy', 'Joint Care', 'Medical Yoga', 'Postpartum Care', 'General Wellness']),
  description: safeText(5000),
  price: z.coerce.number().min(0),
  duration: z.string().trim().max(80).default('60 mins'),
  imageUrl: z.string().trim().max(1000).optional().or(z.literal('')),
  imageAlt: z.string().trim().max(180).optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

const carousel = z.object({
  imageUrl: z.string().trim().min(1).max(1000),
  imageAlt: z.string().trim().max(180).optional().or(z.literal('')),
  title: z.string().trim().max(180).optional().or(z.literal('')),
  subtitle: z.string().trim().max(500).optional().or(z.literal('')),
  buttonText: z.string().trim().max(80).optional().or(z.literal('')),
  buttonLink: z.string().trim().max(300).optional().or(z.literal('')),
  page: z.enum(['home', 'services']).default('home'),
  order: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

const appointment = z.object({
  patientName: safeText(100),
  patientPhone: z.string().trim().min(7).max(20),
  patientEmail: z.string().trim().toLowerCase().email(),
  serviceId: mongoId.optional().or(z.literal('')),
  serviceTitle: safeText(180),
  fee: z.coerce.number().min(0).default(0),
  appointmentDate: z.string().trim().min(1),
  timeSlot: safeText(80),
  center: z.string().trim().max(250).optional().or(z.literal('')),
  notes: z.string().trim().max(2000).optional().or(z.literal('')),
});

const contact = z.object({
  name: safeText(100),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().toLowerCase().email(),
  subject: z.string().trim().max(180).optional().or(z.literal('')),
  message: safeText(3000),
});

const statusUpdate = (values) => z.object({
  status: z.enum(values).optional(),
  notes: z.string().trim().max(2000).optional().or(z.literal('')),
});

const content = {
  item: z.object({
    type: z.enum(['blog', 'faq', 'testimonial', 'gallery', 'video', 'course', 'courseBatch', 'team', 'policy', 'page']),
    title: safeText(220),
    slug: z.string().trim().max(220).optional().or(z.literal('')),
    excerpt: z.string().trim().max(700).optional().or(z.literal('')),
    body: z.string().trim().max(25000).optional().or(z.literal('')),
    category: z.string().trim().max(120).optional().or(z.literal('')),
    imageUrl: z.string().trim().max(1000).optional().or(z.literal('')),
    imageAlt: z.string().trim().max(180).optional().or(z.literal('')),
    videoUrl: z.string().trim().max(1000).optional().or(z.literal('')),
    order: z.coerce.number().int().min(0).default(0),
    metadata: z.record(z.string(), z.any()).default({}),
    isPublished: z.boolean().default(false),
  }),
  blog: z.object({
    title: safeText(220),
    slug: z.string().trim().max(220).optional().or(z.literal('')),
    excerpt: z.string().trim().max(500).optional().or(z.literal('')),
    content: safeText(20000),
    category: z.string().trim().max(120).optional().or(z.literal('')),
    imageUrl: z.string().trim().max(1000).optional().or(z.literal('')),
    imageAlt: z.string().trim().max(180).optional().or(z.literal('')),
    isPublished: z.boolean().default(false),
  }),
  faq: z.object({
    question: safeText(300),
    answer: safeText(5000),
    category: z.string().trim().max(120).optional().or(z.literal('')),
    order: z.coerce.number().int().min(0).default(0),
    isPublished: z.boolean().default(true),
  }),
  simpleStatus: statusUpdate(['new', 'read', 'replied', 'archived']),
};

module.exports = {
  auth,
  adminUser,
  product,
  service,
  carousel,
  appointment,
  contact,
  content,
};
