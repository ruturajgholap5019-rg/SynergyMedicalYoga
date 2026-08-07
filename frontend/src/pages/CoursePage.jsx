import React, { useRef, useState } from 'react';
import {
  BookOpen,
  Award,
  CheckCircle2,
  PhoneCall,
  UserCheck,
  Sparkles,
  Star,
  Send,
  X,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getImageUrl } from '../lib/api';
import ScrollReveal from '../components/ScrollReveal';

const CEO = '/images/User/MD.jpeg';
const CMO = '/images/User/Poonam-Deshmukh-with-apron.jpeg';
const PRACTICAL_IMAGES = [
  { src: '/images/others/ashwini-image.jpeg', alt: 'Clinical anatomy teaching session' },
  { src: '/images/others/3.jpg', alt: 'Rope and belt standing alignment practice' },
  { src: '/images/others/6.jpg', alt: 'Rope and belt practical table demonstration' },
  { src: '/images/others/14.jpg', alt: 'Hands-on Rope and Belt Therapy practice' },
];

// All 14 testimonials – exact text from PDF
const COURSE_TESTIMONIALS = [
  {
    name: 'Dr. Ashwini Tapshalkar',
    role: 'Homeopath & General Physician, Iyengar Yoga Professional',
    comment:
      'Rope & Belt Therapy is an amazing technique to add to my Iyengar yoga skills. It has helped me better understand various medical conditions and apply my knowledge holistically to those who come to me with pain- related conditions. The course at Synergy is well- structured, comprehensive, and conducted in a very friendly and supportive atmosphere.',
    stars: 5,
  },
  {
    name: 'Madhuri Patil',
    role: 'Yoga Professional with 23 years of experience',
    comment:
      'Rope & Belt Therapy has been a valuable addition to my yoga practice. It has given me a deeper understanding of various health conditions and enabled me to approach pain management in a more holistic and effective way. The course at Synergy is comprehensive, well- organized, and delivered in a warm, supportive learning environment. I highly recommend it to every yoga professional looking to enhance their skills and expand their knowledge.',
    stars: 5,
  },
  {
    name: 'Shital Koshti',
    role: 'Yoga Teacher and Therapy professional',
    comment:
      'Rope & Belt Therapy helped me understand the anatomy and physiology of joints in detail. It also gave me better opportunities to get employment. I can now help people get rid of neck pain, back pain, neck pain in a scientific manner. Highly recommended',
    stars: 5,
  },
  {
    name: 'Sameedha Kokate',
    role: 'Experienced and certified Iyengar Yoga Teacher, Instructor',
    comment:
      'Rope & Belt techniques are wonderful and help you know the reason behind why we do a Particular asana and why we recommend not to do. It teaches you the yoga posture anatomy and helps you understand the disease conditions better. A must add skill for each yoga professional in today\'s world where muscleskeletal diseases are a lifestyle disorder',
    stars: 5,
  },
  {
    name: 'Rupali Shevkari',
    role: '',
    comment:
      'I recently completed the Rope & Belt training from Synergy Medical Yoga, and it was one of the best decisions I\'ve made. The expert teaching team provided clear instructions, a well- structured curriculum, and a supportive environment that made learning enjoyable and effective. The ample hands- on practice and personal prop kits helped me refine my skills at home. I\'m deeply grateful to Manoj Sir, Shital Ma\'am, and Ananya Ma\'am for their guidance and dedication. With these new skills, I feel more equipped to serve society through yoga.',
    stars: 5,
  },
  {
    name: 'Shivanjali',
    role: '',
    comment:
      'I loved the Rope Belt Therapy class at Synergy! The expert guidance and personalized support was exceptional. I gained a deeper understanding of the body and its potential for healing. Highly recommended for all for both personal and professional growth',
    stars: 5,
  },
  {
    name: 'Tanvi Deshpande',
    role: '',
    comment:
      'I got a lot of experience and confidence from medical yoga and I also learned new therapies. First I was feeling that I could do it or not but manoj sir and shital mam gave me a lot of guidance and encouragement. The kits given to us are of very good quality and the environment is beautiful and facilities are very much good. Thanks a lot',
    stars: 5,
  },
  {
    name: 'Seema Patil',
    role: '',
    comment:
      'I loved the Rope Belt Therapy class at Synergy! The expert guidance and personalized support was exceptional. I gained a deeper understanding of the body and its potential for healing. Highly recommended for all for both personal and professional growth',
    stars: 5,
  },
  {
    name: 'Richa',
    role: 'Certified Yoga & Wellness Trainer',
    comment:
      'A heartfelt thanks to Manoj Sir, Sheetal Ma\'am, Ashwini Ma\'am, and the entire Synergy team for such an impactful RBT course. The perfect blend of science and practical healing has boosted my clinical confidence and transformed my approach to therapy. This course has been a truly valuable milestone in my professional journey.',
    stars: 5,
  },
  {
    name: 'Bharti Hulumanikar',
    role: 'Certified RBT Therapist',
    comment:
      'The Rope and Belt Therapy (RBT) course was a transformative journey, blending anatomy, mindful healing, and clinical skills. Outstanding instructors and supportive resources, especially the Synergy App, made learning practical and confidence-building. The team\'s professional and caring approach ensured a high-quality and enriching experience.',
    stars: 5,
  },
  {
    name: 'Shivam Gautam',
    role: 'YCB Certified Yoga & Wellness Trainer',
    comment:
      'The Rope and Belt Therapy course was transformative, offering comprehensive, well-structured content that built logically from foundational principles to advanced techniques. Exceptional teaching created a supportive environment, with clear explanations, individualized feedback, and hands-on practice, greatly enhancing confidence and skills. The high-quality resources and passionate instruction made a lasting impact on my professional growth and therapeutic practice',
    stars: 5,
  },
  {
    name: 'Jayant Kulkarni',
    role: '',
    comment:
      'दिनांक १३ एप्रिल २०२६ ते १७ एप्रिल २०२६ या कालावधीत सिनर्जी मेडिकल योगा यांचे निवासी शिर्वार शीन होल, नॅचरपोर्ची सेंटर, शिरवळ येथे संपन्न झाले. मी जयंत वसंत कुलकर्णी पूर्ण वेळ सदर अभ्यास वर्गास उपस्थित होतो . वर्गाचा अभ्यासक्रम शेक्षणिक आणि व्यावसायिक दृष्टिकोनातून अत्यंत नियोजनपूर्वक आणि तपशिलवार तयार करण्यात आला आहे. तसेच त्याच पध्दतीने आमच्या पर्यंत अभ्यास पोहचविण्यात संस्थेच्या सर्व सदस्यांचा हातखंड आहे आसे मला जाणवले. आताच्या डिजीटल युगात हा वर्ग तरुणांनी प्राधान्याने करावा. एकूणच हा वर्ग life transformative आहे. निवास आणि खाणे अत्यंत आनंददायी होते. धन्यवाद !.',
    stars: 5,
  },
  {
    name: 'Vaishali abhyankar',
    role: '',
    comment:
      'मी वैशाली अभ्यंकर ईंथ अत्यंत आनंदाने नमूद करू इच्छित की दिनांक १३ ते १७ एप्रिल या कालावधीत ‘सिनर्जी मेडिकल योगा’ यांनी ‘जीन हील नंचरोपथी सेंटर’ शिरवळ येथे बेल्ट थेपरीच निवासी शिर्वार घेतल मी हा संपूर्ण वर्ग केला अंतर्दामी हा विषय समजायला अवघड असला तरी मनोज सरांनी अतिशय सोप्या पद्धतीने समजून दिला तसेच बेल्ट व रोप थेपरी शीतल ताईंनी अतिशय छान कोणावरही न रंगावता सय्यमाने समजावली तरी पुढील निवासी वर्गाला जास्तीत जास्त प्रतिसाद मिळेल ही सदिच्छा। निवास व भोजनाची व्यवस्था उत्तम होती सर्वांनाच त्यांच्या पुढील वाटचाली साठी मनापासून गुंभच्छा',
    stars: 4,
  },
  {
    name: 'Devdari Shettigar',
    role: '',
    comment:
      'I Devraj V Shettigar I have attended the synergy medical yoga class in Green Hill Naturopathy center in Shirwal, from April 13 to 17th 2026. The course was very good, I liked d teaching methods of Manoj Sir Anatomy subjects in easy n Simple method easy to understand, Shital Maam was also very good in practical she was very coperative, always use to clear d doubts abouts d topics, thanks to both of you for your excellent teaching',
    stars: 5,
  },
];

export default function CoursePage({ setActivePage }) {
  const [openWeekend, setOpenWeekend] = useState(1);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const testimonialTrackRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    profession: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsEnrollModalOpen(false);
      setFormData({ name: '', phone: '', email: '', city: '', profession: '', message: '' });
    }, 2500);
  };

  return (
    <div className="bg-white font-inter text-[#444444]">
      <section className="bg-[#005550] py-16 px-4 text-center text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-sansita text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Education
          </h1>
        </div>
      </section>
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#f4faf9] via-white to-[#e8f5f3] py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-400/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white border border-teal-100 px-4 py-2 rounded-full text-xs font-bold text-[#005550] tracking-wide uppercase shadow-sm">
                <BookOpen className="w-4 h-4" />
                <span>Synergy Learning Programs</span>
              </div>
              <h2 className="font-sansita text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[#005550]">
                Learn Medical Yoga Therapy with clinical clarity
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Synergy education programs help yoga professionals, therapists, and wellness learners understand practical, anatomy-led Rope &amp; Belt Therapy for pain care and better movement.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <button
                  onClick={() => document.getElementById('upcoming-course')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white hover:bg-[#005550] text-[#005550] hover:text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md border-2 border-[#005550] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View Upcoming Course</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://wa.me/919730321042?text=Hi%2C%20I%20want%20to%20know%20more%20about%20the%20Rope%20%26%20Belt%20Therapy%20Course"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </div>
            <div className="lg:col-span-6 flex">
              <div className="relative overflow-hidden rounded-3xl border border-teal-100 shadow-xl bg-white w-full">
                <img
                  src="/images/others/ashwini-image.jpeg"
                  alt="Synergy Medical Yoga education session"
                  className="w-full h-[330px] sm:h-[380px] lg:h-[430px] object-cover object-center"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute left-4 bottom-4 right-4 bg-white/92 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/70">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#005550]">Education at Synergy</p>
                  <p className="text-sm text-gray-600 mt-1">Structured learning, practical demonstration, and guided therapy application.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY LEARN RBT (4 PILLARS) – REDUCED HEIGHT ── */}
      <section className="py-12 bg-gradient-to-b from-[#f4faf9] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center space-y-2 max-w-3xl mx-auto">
              <span className="text-xs font-bold text-[#005550] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                Transformative Healthcare Skills
              </span>
              <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">
                Why Learn Rope &amp; Belt Therapy?
              </h2>
              <p className="text-sm text-gray-600">
                Equip yourself with clinically proven non-invasive techniques designed by doctors.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="zoom-in" delay={150}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-lg transition-all group hover-lift">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#005550] group-hover:bg-[#005550] group-hover:text-white transition-colors">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-poppins font-bold text-[#005550] text-base">Help Yourself, Family &amp; Society</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Learn RBT to help society reduce their dependence on surgery for treating knee pain, back pain, neck pain and shoulder pain. This therapy is designed by doctors. It is a unique blend of modern anatomy concepts and yogic wisdom. Easy to learn, easy to set up even at home.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-lg transition-all group hover-lift">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#005550] group-hover:bg-[#005550] group-hover:text-white transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-poppins font-bold text-[#005550] text-base">Applied Yoga</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Learn application of yoga to treat musculoskeletal diseases (Knee Pain, Back Pain, Neck Pain, Shoulder Pain). There are 5 Lakh surgeries happening in India every year for knee and back. Help people avoid surgeries using rope &amp; belt therapy adoption.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-lg transition-all group hover-lift">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#005550] group-hover:bg-[#005550] group-hover:text-white transition-colors">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-poppins font-bold text-[#005550] text-base">Special Skill</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Rope &amp; Belt therapy gets into details of anatomy of joints as well as pathology of pain condition so that you understand why a particular pain starts. This also helps you in your regular fitness yoga batches to handle patients with special conditions.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-lg transition-all group hover-lift">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#005550] group-hover:bg-[#005550] group-hover:text-white transition-colors">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-poppins font-bold text-[#005550] text-base">Earn More</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Earning potential of medical yoga techniques like Rope &amp; Belt therapy is very high compared to regular yoga classes. It helps you build a sustainable career in the field of yoga.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ───────────── COURSE HIGHLIGHTS ───────────── */}
      <section className="pt-10 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center rounded-full border border-teal-100 bg-teal-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#005550]">
              Course Highlights
            </span>

            <h2 className="mt-4 font-sansita text-3xl md:text-4xl font-bold text-[#005550]">
              Practical Learning Experience
            </h2>

            <p className="hidden">
              Learn through live demonstrations, expert guidance and hands-on
              Rope & Belt Therapy training.
            </p>
          </div>

          <div className="max-w-7xl mx-auto rounded-3xl border border-teal-100 bg-[#f4faf9] shadow-lg p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {PRACTICAL_IMAGES.map((image, index) => (
                <div
                  key={image.src}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover-lift"
                >
                  <img
                    src={getImageUrl(image.src)}
                    alt={image.alt}
                    className="w-full h-56 sm:h-60 lg:h-64 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-xs font-bold text-white drop-shadow-sm">{image.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section className="py-14 bg-[#eef8f6] border-y border-teal-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <img
            src="/images/others/Why-Lear-RBT-with-Synergy-Banner-4-items-1-1-scaled.webp"
            alt=""
            className="w-full rounded-2xl shadow-xl border border-gray-200 bg-white"
          />
        </div>
      </section>
      {/* ── COURSE DETAILS ── */}
      <section id="upcoming-course" className="py-16 bg-[#eaf6f6] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-teal-100 shadow-xl space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">Upcoming Course</span>
              <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">Rope &amp; Belt Therapy Training Course</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-1">
                <p className="text-xs font-bold uppercase text-gray-500">Sep Batch Start Date</p>
                <p className="font-poppins font-bold text-lg text-[#005550]">5th Sept 2026</p>
              </div>
              <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-1">
                <p className="text-xs font-bold uppercase text-gray-500">Course Duration</p>
                <p className="font-poppins font-bold text-lg text-[#005550]">1 Month (45 Hours Weekend Batch)</p>
              </div>
              <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-1">
                <p className="text-xs font-bold uppercase text-gray-500">Conducted By</p>
                <p className="font-poppins font-bold text-lg text-[#005550]">Synergy Medical Yoga</p>
              </div>
              <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-1">
                <p className="text-xs font-bold uppercase text-gray-500">Instructional Mode</p>
                <p className="font-poppins font-bold text-lg text-[#005550]">Online Theory + Offline Practical</p>
              </div>
              <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-1">
                <p className="text-xs font-bold uppercase text-gray-500">Medium of Instruction</p>
                <p className="font-poppins font-bold text-lg text-[#005550]">English + Hindi as needed</p>
              </div>
              <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-1">
                <p className="text-xs font-bold uppercase text-gray-500">Pre-qualification</p>
                <p className="font-poppins font-bold text-sm text-[#005550]">Graduate in any stream is preferred. Basic Yoga knowledge is an advantage.</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#005550] to-[#003d39] text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-lg">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-teal-200">TOTAL COURSE INVESTMENT</p>
                <h3 className="font-sansita text-3xl sm:text-4xl font-bold text-amber-300 mt-1">Course Fee ₹19,999/-</h3>
                <p className="text-xs text-teal-100/90 mt-1">Includes Theory &amp; Practical Training, Course Manuals, and Video Access</p>
              </div>
              <button
                onClick={() => document.getElementById('course-curriculum')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-extrabold px-8 py-3.5 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap text-sm"
              >
                View Course Curriculum
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CURRICULUM – collapsible (only one open) ── */}
      <section className="py-16 bg-[#f4f7f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">Course Faculty</span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">Learn From Clinical Experts</h2>
            <div className="w-16 h-0.5 bg-[#005550] mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <img src={getImageUrl(CMO)} alt="Dr. Poonam Deshmukh" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#005550] shadow-md" />
                <div>
                  <h3 className="font-poppins font-bold text-xl text-[#005550]">Dr. Poonam Deshmukh</h3>
                  <p className="text-xs font-bold text-gray-600">Partner - Synergy Medical Yoga</p>
                  <p className="text-xs text-teal-700 font-semibold mt-0.5">B.Th.O &amp; OTR (USA NBCOT)</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Dr. Poonam Deshmukh is an Occupational Therapist with over 20 years of clinical experience and is a USA-certified Occupational Therapist (OTR), having practiced in the United States for more than five years. She specializes in integrating the ancient principles of Medical Yoga with the modern understanding of musculoskeletal anatomy to develop effective therapeutic approaches. Known for her engaging teaching style, Dr. Poonam simplifies complex clinical concepts through practical demonstrations and real-life case studies, enabling healthcare professionals to confidently apply them in clinical practice.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <img src={getImageUrl(CEO)} alt="Manoj Deshmukh" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#005550] shadow-md" />
                <div>
                  <h3 className="font-poppins font-bold text-xl text-[#005550]">Manoj Deshmukh</h3>
                  <p className="text-xs font-bold text-gray-600">Partner - Synergy Medical Yoga</p>
                  <p className="text-xs text-teal-700 font-semibold mt-0.5">B.E. (BITS Pilani) + EPMBD (IIM Calcutta)</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Manoj Deshmukh, Founder &amp; Partner of Synergy Medical Yoga, brings over 22 years of corporate leadership experience combined with a deep understanding of joint biomechanics and the therapeutic application of Rope &amp; Belt Therapy. Driven by the vision of making evidence-based Medical Yoga accessible to everyone, he leads Synergy's mission to democratize Rope &amp; Belt Therapy across India through technology-enabled healthcare, structured education, and innovative therapeutic products. His goal is to make this effective, non-invasive therapy simple, affordable, and widely accessible, empowering people to maintain joint health and reduce the need for avoidable surgical interventions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="course-curriculum" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#005550] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              45-Hour Structured Syllabus
            </span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">Course Curriculum</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Click on each weekend to expand and see the detailed syllabus.
            </p>
          </div>

          <div className="space-y-6">
            {/* Weekend 1 */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
              <button
                onClick={() => setOpenWeekend(openWeekend === 1 ? null : 1)}
                className={`w-full flex items-center justify-between p-6 text-left font-poppins font-bold text-lg transition-all ${openWeekend === 1 ? 'bg-[#005550] text-white shadow-md' : 'bg-slate-50 text-gray-800 hover:bg-teal-50/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${openWeekend === 1 ? 'bg-amber-400 text-gray-900' : 'bg-[#005550] text-white'}`}>
                    W1
                  </div>
                  <div>
                    <span>Weekend 1 – Online (Sat &amp; Sun)</span>
                    <p className={`text-xs font-normal ${openWeekend === 1 ? 'text-teal-100' : 'text-gray-500'}`}>Sat: 3 Hours | Sun: 3 Hours</p>
                  </div>
                </div>
                {openWeekend === 1 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {openWeekend === 1 && (
                <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>History of RBT &amp; General RBT Principles</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Anatomy of knee joint</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Understanding of knee pain conditions</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>OA Knee, Varus Deformity, ACL / PCL Tear, Meniscus Injury</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Theory behind tying protocols</strong></span></li>
                  </ul>
                </div>
              )}
            </div>

            {/* Weekend 2 */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
              <button
                onClick={() => setOpenWeekend(openWeekend === 2 ? null : 2)}
                className={`w-full flex items-center justify-between p-6 text-left font-poppins font-bold text-lg transition-all ${openWeekend === 2 ? 'bg-[#005550] text-white shadow-md' : 'bg-slate-50 text-gray-800 hover:bg-teal-50/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${openWeekend === 2 ? 'bg-amber-400 text-gray-900' : 'bg-[#005550] text-white'}`}>
                    W2
                  </div>
                  <div>
                    <span>Weekend 2 – Online (Sat &amp; Sun)</span>
                    <p className={`text-xs font-normal ${openWeekend === 2 ? 'text-teal-100' : 'text-gray-500'}`}>Sat: 3 Hours | Sun: 3 Hours</p>
                  </div>
                </div>
                {openWeekend === 2 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {openWeekend === 2 && (
                <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Revision - Knee joint</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Anatomy of lumbar spine</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Understanding of back pain conditions</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Slip disc, Sciatica, Lumbar Spondylosis, Listhesis, Back Spasm</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Theory behind tying protocols</strong></span></li>
                  </ul>
                </div>
              )}
            </div>

            {/* Weekend 3 */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
              <button
                onClick={() => setOpenWeekend(openWeekend === 3 ? null : 3)}
                className={`w-full flex items-center justify-between p-6 text-left font-poppins font-bold text-lg transition-all ${openWeekend === 3 ? 'bg-[#005550] text-white shadow-md' : 'bg-slate-50 text-gray-800 hover:bg-teal-50/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${openWeekend === 3 ? 'bg-amber-400 text-gray-900' : 'bg-[#005550] text-white'}`}>
                    W3
                  </div>
                  <div>
                    <span>Weekend 3 – Online (Sat &amp; Sun)</span>
                    <p className={`text-xs font-normal ${openWeekend === 3 ? 'text-teal-100' : 'text-gray-500'}`}>Sat: 3 Hours | Sun: 3 Hours</p>
                  </div>
                </div>
                {openWeekend === 3 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {openWeekend === 3 && (
                <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Revision- Anatomy of cervical spine</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Understanding of neck pain conditions</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Cervical spondylosis, Forward head posture, Neck Spasm</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Theory behind tying protocols</strong></span></li>
                  </ul>
                </div>
              )}
            </div>

            {/* Weekend 4 – Offline */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
              <button
                onClick={() => setOpenWeekend(openWeekend === 4 ? null : 4)}
                className={`w-full flex items-center justify-between p-6 text-left font-poppins font-bold text-lg transition-all ${openWeekend === 4 ? 'bg-[#005550] text-white shadow-md' : 'bg-slate-50 text-gray-800 hover:bg-teal-50/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${openWeekend === 4 ? 'bg-amber-400 text-gray-900' : 'bg-[#005550] text-white'}`}>
                    W4
                  </div>
                  <div>
                    <span>Weekend 4 – Offline (Fri, Sat, Sun)</span>
                    <p className={`text-xs font-normal ${openWeekend === 4 ? 'text-teal-100' : 'text-gray-500'}`}>
                      Fri: Full Day (9 Hours) Sat: Full Day (9 Hours) Sun: Full Day (9 Hours)
                    </p>
                  </div>
                </div>
                {openWeekend === 4 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {openWeekend === 4 && (
                <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Knee tying protocols of rope &amp; belt therapy</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Lumbar tying protocols of rope &amp; belt therapy</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Cervical tying protocols of rope &amp; belt therapy</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Case history taking and hands- on tying practice</strong></span></li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ── EXAM & CERTIFICATION – REMOVED redundant box ── */}
          <div className="bg-[#f0f9f8] rounded-3xl p-8 border border-teal-100 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">ASSESSMENT &amp; CERTIFICATION</span>
              <h3 className="font-sansita text-2xl font-bold text-[#005550]">Exam &amp; Certification Protocol</h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
                <strong>Theory Exam :</strong> Online during the course<br />
                <strong>Practical :</strong> After 1 month from completion<br />
                <em>Certificate will be issued only after qualifying in the practical exam. Being certified is a pre-requisite for registration on the Synergy app.</em>
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 shrink-0">
              {/* Only the certificate image – removed the white box above it */}
              <img
                src="/images/others/synergy-certificate-image.jpeg"
                alt="Synergy Certificate Sample"
                className="w-72 max-h-48 object-contain rounded-xl border border-teal-200 shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FACULTY ── */}
      <section className="hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">LEARN FROM CLINICAL EXPERTS</span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">Course Faculty</h2>
            <div className="w-16 h-0.5 bg-[#005550] mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img src={getImageUrl(CMO)} alt="Dr. Poonam Deshmukh" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#005550] shadow-md" />
                  <div>
                    <h3 className="font-poppins font-bold text-xl text-[#005550]">Dr. Poonam Deshmukh</h3>
                    <p className="text-xs font-bold text-gray-600">Partner - Synergy Medical Yoga</p>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5">B.Th.O &amp; OTR (USA NBCOT)</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Dr. Poonam Deshmukh is an Occupational Therapist with over 20 years of clinical experience and is a USA- certified Occupational Therapist (OTR), having practiced in the United States for more than five years. She specializes in integrating the ancient principles of Medical Yoga with the modern understanding of musculoskeletal anatomy to develop effective therapeutic approaches. Known for her engaging teaching style, Dr. Poonam simplifies complex clinical concepts through practical demonstrations and real- life case studies, enabling healthcare professionals to confidently apply them in clinical practice.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img src={getImageUrl(CEO)} alt="Manoj Deshmukh" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#005550] shadow-md" />
                  <div>
                    <h3 className="font-poppins font-bold text-xl text-[#005550]">Manoj Deshmukh</h3>
                    <p className="text-xs font-bold text-gray-600">Partner - Synergy Medical Yoga</p>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5">B.E. (BITS Pilani) + EPMBD (IIM Calcutta)</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Manoj Deshmukh, Founder &amp; Partner of Synergy Medical Yoga, brings over 22 years of corporate leadership experience combined with a deep understanding of joint biomechanics and the therapeutic application of Rope &amp; Belt Therapy. Driven by the vision of making evidence- based Medical Yoga accessible to everyone, he leads Synergy's mission to democratize Rope &amp; Belt Therapy across India through technology- enabled healthcare, structured education, and innovative therapeutic products. His goal is to make this effective, non- invasive therapy simple, affordable, and widely accessible, empowering people to maintain joint health and reduce the need for avoidable surgical interventions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS – horizontally scrollable ── */}
      <style>{`
        @keyframes educationFeedbackMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .education-feedback-track {
          animation: educationFeedbackMarquee 42s linear infinite;
        }
        .education-feedback-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section className="py-12 bg-[#005550] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">FEEDBACK &amp; REVIEWS</span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-white">What Our RBT Alumni Say</h2>
          </div>
          <div className="relative">
            <button
              type="button"
              aria-label="Scroll feedback left"
              onClick={() => testimonialTrackRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white/95 hover:bg-amber-300 text-[#005550] rounded-full w-10 h-10 shadow-lg border border-white/70 flex items-center justify-center transition-colors"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            <button
              type="button"
              aria-label="Scroll feedback right"
              onClick={() => testimonialTrackRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white/95 hover:bg-amber-300 text-[#005550] rounded-full w-10 h-10 shadow-lg border border-white/70 flex items-center justify-center transition-colors"
            >
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>
            <div ref={testimonialTrackRef} className="overflow-x-auto pb-4 scrollbar-none">
              <div className="education-feedback-track flex gap-4 w-max pr-4">
              {[...COURSE_TESTIMONIALS, ...COURSE_TESTIMONIALS].map((t, idx) => (
                <div key={`${t.name}-${idx}`} className="bg-white text-gray-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between min-w-[240px] max-w-[280px] space-y-3">
                  <div className="space-y-2">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(t.stars)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />)}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed italic">"{t.comment}"</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="font-poppins font-bold text-sm text-[#005550]">{t.name}</h4>
                    {t.role && <p className="text-[10px] text-gray-500 mt-0.5">{t.role}</p>}
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-12 bg-gradient-to-br from-[#ebf7f7] to-[#d6f0f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">
            Ready to Become a Certified Rope &amp; Belt Therapist?
          </h2>
          <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto">
            Reserve your seat for the upcoming <strong>5th Sept 2026 Batch</strong>. Limited seats available per cohort to maintain individual practical hands-on attention.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="bg-[#005550] hover:bg-[#003d39] text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Enroll Online Now (₹19,999/-)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a href="tel:+919730321042" className="bg-white hover:bg-slate-50 text-[#005550] font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md border border-teal-200 transition-all flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#005550]" />
              <span>Call +91 97303 21042</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── ENROLLMENT MODAL ── */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsEnrollModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 p-2 rounded-full cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">OFFICIAL REGISTRATION FORM</span>
              <h3 className="font-sansita text-2xl font-bold text-gray-900">Education Enrollment</h3>
              <p className="text-xs text-gray-500">Batch Starting: <strong>5th Sept 2026</strong> | Fee: <strong>₹19,999/-</strong></p>
            </div>
            {formSubmitted ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-[#005550] text-lg">Registration Details Received!</h4>
                <p className="text-xs text-gray-600">
                  Thank you! Our Synergy Course Coordinator will contact you via WhatsApp / Call at <strong>+91 97303 21042</strong> with payment details and course handbook.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <input type="text" required placeholder="e.g. Dr. Ananya Sharma" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile / WhatsApp *</label>
                    <input type="tel" required maxLength={15} placeholder="98230 45678 (10 digits)" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^\d+\s-]/g, '').slice(0, 15) })} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City / Location *</label>
                    <input type="text" required placeholder="e.g. Pune / Mumbai" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Profession / Background</label>
                  <input type="text" placeholder="e.g. Yoga Teacher / Physiotherapist / Doctor" value={formData.profession} onChange={(e) => setFormData({ ...formData, profession: e.target.value })} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]" />
                </div>
                <button type="submit" className="w-full bg-[#005550] hover:bg-[#003d39] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>Submit Enrollment Application</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
