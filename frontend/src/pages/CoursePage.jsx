import React, { useState } from 'react';
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
} from 'lucide-react';
import { getImageUrl } from '../lib/api';

const CEO = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/MD.jpeg';
const CMO = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/Poonam-Deshmukh-with-apron.jpeg';

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
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '', profession: '', message: '' });
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
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#003d39] via-[#005550] to-[#002f2c] text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-400/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-teal-800/60 border border-teal-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-teal-200 tracking-wide uppercase backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
                <span>Hybrid (Online + Offline) Certification</span>
              </div>
              <h1 className="font-sansita text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-md">
                Medical Yoga Therapy
                <br />
                <span className="text-teal-200 italic font-normal text-3xl sm:text-4xl lg:text-5xl">
                  Rope &amp; Belt Therapy Training Course
                </span>
              </h1>
              <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl leading-relaxed">
                Modern Therapy with Ancient Wisdom. Master doctor-supervised non-surgical postural realignment, joint friction elimination, and specialized musculoskeletal pain recovery techniques.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-white/10 backdrop-blur-xs border border-white/10 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-teal-200">DURATION</p>
                  <p className="text-sm font-bold text-white">45 Hours (1 Month)</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xs border border-white/10 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-teal-200">NEXT BATCH</p>
                  <p className="text-sm font-bold text-amber-300">5th Sept 2026</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xs border border-white/10 p-3 rounded-2xl col-span-2 sm:col-span-1">
                  <p className="text-[10px] uppercase font-bold text-teal-200">COURSE FEE</p>
                  <p className="text-sm font-bold text-white">₹19,999/-</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setIsEnrollModalOpen(true)}
                  className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                >
                  <span>Enroll for Sep Batch (₹19,999)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://wa.me/919730321042?text=Hi%2C%20I%20want%20to%20know%20more%20about%20the%20Rope%20%26%20Belt%20Therapy%20Course"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </div>
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-white text-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-100 max-w-md w-full space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#005550]">OFFICIAL SYNERGY BROCHURE</span>
                  <h3 className="font-sansita text-2xl font-bold text-[#005550]">Medical Yoga Therapy</h3>
                  <div className="w-12 h-0.5 bg-[#005550] mx-auto mt-2" />
                </div>
                <div className="bg-[#f0f9f8] p-4 rounded-2xl border border-teal-100 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-teal-100/80 pb-2">
                    <span className="text-gray-500 font-medium">Batch Schedule</span>
                    <span className="font-bold text-[#005550]">Weekend Batch</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-teal-100/80 pb-2">
                    <span className="text-gray-500 font-medium">Instructional Mode</span>
                    <span className="font-bold text-[#005550]">Online + Offline Practical</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-teal-100/80 pb-2">
                    <span className="text-gray-500 font-medium">Language</span>
                    <span className="font-bold text-[#005550]">English + Hindi</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Certification</span>
                    <span className="font-bold text-emerald-700">Official RBT Certificate</span>
                  </div>
                </div>
                <div className="text-center space-y-3 pt-2">
                  <p className="text-xs text-gray-500 font-medium">Have questions before joining?</p>
                  <button
                    onClick={() => setIsEnrollModalOpen(true)}
                    className="w-full bg-[#005550] hover:bg-[#003d39] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    Request Callback / Download Syllabus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY LEARN RBT (4 PILLARS) – REDUCED HEIGHT ── */}
      <section className="py-12 bg-gradient-to-b from-[#f4faf9] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-lg transition-all group">
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
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-lg transition-all group">
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
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-lg transition-all group">
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
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-lg transition-all group">
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
        </div>
      </section>

      {/* ── COURSE HIGHLIGHTS – 4 images + banner ── */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#005550] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              Visual Highlights
            </span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">
              Course Highlights
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <img src="/images/others/ashwini-image.jpeg" alt="Highlight 1" className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl shadow-md border border-gray-200" />
            <img src="/images/others/3.jpg" alt="Highlight 2" className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl shadow-md border border-gray-200" />
            <img src="/images/others/6.jpg" alt="Highlight 3" className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl shadow-md border border-gray-200" />
            <img src="/images/others/14.jpg" alt="Highlight 4" className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl shadow-md border border-gray-200" />
          </div>
          <div className="flex justify-center">
            <img
              src="/images/others/Why-Lear-RBT-with-Synergy-Banner-4-items-1-1-scaled.webp"
              alt="Why Learn RBT with Synergy"
              className="w-full max-w-6xl h-auto max-h-96 object-contain rounded-3xl shadow-md border border-gray-200"
            />
          </div>
        </div>
      </section>

      {/* ── COURSE DETAILS ── */}
      <section className="py-16 bg-[#eaf6f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-teal-100 shadow-xl space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">BATCH &amp; ENROLLMENT SPECIFICATIONS</span>
              <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">Course Details at a Glance</h2>
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
                onClick={() => setIsEnrollModalOpen(true)}
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-extrabold px-8 py-3.5 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap text-sm"
              >
                Register Now for ₹19,999
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CURRICULUM – always expanded ── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#005550] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              45-Hour Structured Syllabus
            </span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">Course Curriculum</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Progressive 4-weekend module – all weekends are always open for your reference.
            </p>
          </div>

          <div className="space-y-6">
            {/* Weekend 1 */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-[#005550] text-white p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-xs font-extrabold">W1</div>
                <div>
                  <span className="font-poppins font-bold text-lg">Weekend 1 – Online (Sat &amp; Sun)</span>
                  <p className="text-xs text-teal-100">Sat: 3 Hours | Sun: 3 Hours</p>
                </div>
              </div>
              <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>History of RBT &amp; General RBT Principles</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Anatomy of knee joint</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Understanding of knee pain conditions</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>OA Knee, Varus Deformity, ACL / PCL Tear, Meniscus Injury</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Theory behind tying protocols</strong></span></li>
                </ul>
              </div>
            </div>
            {/* Weekend 2 */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-[#005550] text-white p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-xs font-extrabold">W2</div>
                <div>
                  <span className="font-poppins font-bold text-lg">Weekend 2 – Online (Sat &amp; Sun)</span>
                  <p className="text-xs text-teal-100">Sat: 3 Hours | Sun: 3 Hours</p>
                </div>
              </div>
              <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Revision - Knee joint</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Anatomy of lumbar spine</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Understanding of back pain conditions</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Slip disc, Sciatica, Lumbar Spondylosis, Listhesis, Back Spasm</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Theory behind tying protocols</strong></span></li>
                </ul>
              </div>
            </div>
            {/* Weekend 3 */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-[#005550] text-white p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-xs font-extrabold">W3</div>
                <div>
                  <span className="font-poppins font-bold text-lg">Weekend 3 – Online (Sat &amp; Sun)</span>
                  <p className="text-xs text-teal-100">Sat: 3 Hours | Sun: 3 Hours</p>
                </div>
              </div>
              <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Revision- Anatomy of cervical spine</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Understanding of neck pain conditions</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Cervical spondylosis, Forward head posture, Neck Spasm</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Theory behind tying protocols</strong></span></li>
                </ul>
              </div>
            </div>
            {/* Weekend 4 – Offline */}
            <div className="border border-emerald-500/40 rounded-3xl overflow-hidden shadow-md bg-emerald-50/30">
              <div className="bg-emerald-800 text-white p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-xs font-extrabold">W4</div>
                <div>
                  <span className="font-poppins font-bold text-lg">Weekend 4 – Offline (Fri, Sat, Sun)</span>
                  <p className="text-xs text-amber-200">Fri: Full Day (9 Hours) Sat: Full Day (9 Hours) Sun: Full Day (9 Hours)</p>
                </div>
              </div>
              <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Knee tying protocols of rope &amp; belt therapy</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Lumbar tying protocols of rope &amp; belt therapy</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Cervical tying protocols of rope &amp; belt therapy</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Case history taking and hands- on tying practice</strong></span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── EXAM & CERTIFICATION ── */}
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
              <div className="bg-white p-4 rounded-2xl border border-teal-100 text-center shadow-sm w-full">
                <Award className="w-12 h-12 text-[#005550] mx-auto mb-2" />
                <span className="text-xs font-bold text-gray-800 block">Official RBT Certificate</span>
                <span className="text-[10px] text-gray-500 block">Synergy Medical Yoga</span>
              </div>
              <img
                src="/images/others/synergy-certificate-image.jpeg"
                alt="Synergy Certificate Sample"
                className="w-64 h-auto rounded-xl border border-teal-200 shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FACULTY ── */}
      <section className="py-16 bg-[#f4f7f8]">
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
      <section className="py-12 bg-[#005550] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">STUDENT FEEDBACK &amp; REVIEWS</span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-white">What Our RBT Alumni Say</h2>
          </div>
          <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-teal-200 scrollbar-track-transparent">
            <div className="flex gap-4 w-max">
              {COURSE_TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="bg-white text-gray-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between min-w-[240px] max-w-[280px] space-y-3">
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
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-12 bg-gradient-to-br from-[#ebf7f7] to-[#d6f0f0]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
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
                    <input type="tel" required placeholder="+91 98230 45678" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]" />
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