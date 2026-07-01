document.addEventListener('DOMContentLoaded', () => {
  const langSwitcher = document.getElementById('lang-switcher');
  const langText = document.getElementById('lang-text');
  const themeText = document.getElementById('theme-text');

  const translations = {
    ar: { 
      // Shared
      nav_home: "الرئيسية", nav_services: "الخدمات", nav_about: "من نحن", nav_contact: "اتصل بنا", theme_light: "الوضع النهاري", theme_dark: "الوضع الليلي", lang_switch: "EN",
      know_more: "اعرف المزيد <i class='fas fa-arrow-left'></i>", btn_wa: "واتساب", btn_mail: "بريد", btn_fb: "فيسبوك", btn_ig: "انستقرام",
      // Index
      hero_desc: 'حلول رقمية وبرمجية متكاملة لبناء حضورك على الإنترنت <span class="eye-pill"><span class="eye-dot"></span></span> وتطوير أنظمة ويب ذكية تسهل إدارة عملك.', hero_cta: "احجز استشارتك الآن",
      services_title: "خدماتنا | Services", contact_title: "احجز استشارتك الآن", contact_desc: 'نصنع لك حضورًا رقميًا يعكس قوة مشروعك ويزيد ثقة عملائك<br><span style="opacity:.7">We build a digital presence that strengthens your brand and builds trust.</span>',
      serv_1_desc: "تصميم وتطوير مواقع تعريفية احترافية وصفحات هبوط (Landing Pages) مخصصة لزيادة المبيعات وجذب العملاء.", serv_2_desc: "مواقع شخصية إلكترونية لعرض أعمالك أو سيرتك الذاتية بشكل راقٍ يترك انطباعاً قوياً لدى أصحاب العمل والعملاء.", serv_3_desc: "أنظمة حجز مواعيد إلكترونية متكاملة للعيادات، الصالونات، والمراكز الاستشارية، لتسهيل إدارة وقتك ووقت عملائك.", serv_4_desc: "أنظمة ويب متخصصة لإدارة العيادات والمراكز الطبية: ملفات المرضى، المواعيد، الفواتير، والتقارير الطبية في مكان واحد.", serv_5_desc: "متاجر إلكترونية متكاملة أو مواقع لعرض المنتجات والكتالوجات، مع لوحات تحكم سهلة لإدارة الطلبات والمنتجات.", serv_6_desc: "أنظمة ويب لإدارة المخزون والمبيعات تعمل من أي متصفح، تتبع حركة الأصناف، الفواتير، وتقارير الأداء بدقة.", serv_7_desc: "أنظمة لإدارة علاقات العملاء (CRM): تسجيل بيانات العملاء، متابعة خطط البيع، وتسجيل الاتصالات لزيادة المبيعات وتنظيم فريق العمل.", serv_8_desc: "قوائم رقمية للمطاعم والكافيهات تعمل بمسح الـ QR كود، تتيح للعملاء تصفح المنيو وإرسال الطلبات مباشرة للمطبخ أو الكاشير.", serv_9_desc: "منصات ويب متكاملة لعرض العقارات أو الإعلانات المبوبة، تتيح رفع تفاصيل العقار، الصور، وتصفية البحث للعملاء بسهولة.",
      // About
      about_title: "من نحن | About", about_desc: 'في Axentro، نؤمن بأن المستقبل على الويب. نحن نتخصص في تقديم حلول رقمية متكاملة <span class="eye-pill"><span class="eye-dot"></span></span> تبدأ من بناء المواقع التعريفية وحتى أنظمة إدارة الأعمال المتقدمة التي تعمل بالكامل عبر الإنترنت.',
      stat_1: "مسارات خدمات ويب متكاملة", stat_2: "حلول تعمل بالكامل على المتصفح (Cloud-based)", stat_3: "قنوات تواصل سريعة (واتساب / بريد)", stat_4: "تصميمات عصرية تركز على تجربة المستخدم",
      values_title: "قيمنا الأساسية", values_desc: "3 مبادئ ثابتة في كل مشروع—تضمن الجودة والسرعة والوضوح من أول يوم حتى التسليم.",
      val_1: "نهتم بالتفاصيل: هيكلة نظيفة، واجهة واضحة، اختبار، وتسليم منظم. الهدف إن المنصة يظل معك وتعمل بثبات.", val_2: "نوصل للنتيجة بسرعة بدون ضياع للوقت: تقسيم مراحل، أول نسخة (MVP) ثم تطوير تدريجي حسب الأولويات.", val_3: "كل خطوة لها مخرجات واضحة: المطلوب، التصميم، التنفيذ، التدريب. عشان تبقى فاهم أنت هتحصل علي إيه وأمتى.",
      services_title_about: "ماذا نقدم", services_desc: "خدماتنا مصممة لتغطي احتياج الشركات والأفراد: من المواقع التعريفية إلى أنظمة الحجوزات وإدارة المبيعات، كلها تعمل بسلاسة على أي متصفح.",
      copy_link: "<i class='fas fa-link'></i> نسخ رابط الخدمة",
      process_title: "كيف نعمل معك", process_desc: "أسلوب عمل واضح—بدون تعقيد وبأسرع طريق للنتيجة.",
      proc_1_title: "1) جلسة فهم الاحتياج", proc_1_desc: "نجمع تفاصيل عملك، المشاكل الحالية، ونحدد المطلوب بدقة (Features + تقارير + صلاحيات).", proc_2_title: "2) تصميم الحل", proc_2_desc: "نقدّم تصور للواجهة وخط سير العمل قبل التنفيذ، عشان كل شيء يبقى واضح.", proc_3_title: "3) تنفيذ واختبار", proc_3_desc: "تنفيذ احترافي + اختبار حالات واقعية + تحسينات بناءً على الملاحظات.", proc_4_title: "4) تدريب وتسليم", proc_4_desc: "شرح للاستخدام + دليل مختصر + تسليم منظم يسهّل التشغيل.", proc_5_title: "5) دعم وتطوير", proc_5_desc: "متابعة بعد التسليم + تطوير مراحل جديدة لما مشروعك يكبر.",
      faq_title: "أسئلة شائعة | FAQ", faq_desc: "إجابات سريعة على أهم الأسئلة قبل ما نبدأ.",
      faq_1_q: "إزاي نبدأ مع بعض؟ <i class='fas fa-chevron-down chev'></i>", faq_1_a: "بنبدأ بجلسة قصيرة لفهم طبيعه عملك والهدف المطلوب، بعدها نحدد نطاق العمل والخطوات والمدة المتوقعة، ثم نبدأ التنفيذ على مراحل.",
      faq_2_q: "كم تكلفة إنشاء الموقع أو النظام؟ <i class='fas fa-chevron-down chev'></i>", faq_2_a: "التكلفة بتختلف حسب حجم النظام والمميزات المطلوبة. بنقدملك عرض سعر شفاف ومناسب لميزانيتك بعد جلسة الاستشارة المجانية وتحديد المتطلبات بدقة.",
      faq_3_q: "كم تستغرق مدة التنفيذ؟ <i class='fas fa-chevron-down chev'></i>", faq_3_a: "المواقع التعريفية وصفحات الهبوط بتاخد من 3 لـ 7 أيام. أما الأنظمة الإدارية والمتاجر فبتاخد من 2 لـ 4 أسابيع حسب حجم البيانات وتعقيد الخصائص المطلوبة.",
      faq_4_q: "هل الموقع أو النظام هيكون ملكي بالكامل؟ <i class='fas fa-chevron-down chev'></i>", faq_4_a: "نعم، كل الأكواد والأنظمة بتكون ملكك بالكامل وبتشتغل باسمك وباسم شركتك، وإنت اللي ليك حق التحكم فيها والتعديل عليها في أي وقت.",
      faq_5_q: "هل توفرون الاستضافة واسم النطاق (الدومين)؟ <i class='fas fa-chevron-down chev'></i>", faq_5_a: "نعم، بنوفر لك كل ما تحتاجه من استضافة سحابية سريعة واسم موقع (Domain) وتأمين البيانات لتبدأ مباشرة دون أي تعقيدات تقنية.",
      faq_6_q: "هل الأنظمة هتشتغل على الموبايل؟ <i class='fas fa-chevron-down chev'></i>", faq_6_a: "نعم، كل المواقع والأنظمة اللي بنبرمجها بتكون \"Responsive\" يعني بتشتغل وتظهر بشكل احترافي على الموبايل، التابلت، والكمبيوتر من خلال أي متصفح إنترنت.",
      faq_7_q: "هل في دعم بعد التسليم؟ <i class='fas fa-chevron-down chev'></i>", faq_7_a: "نعم، بنوفر دعم وتعديلات حسب الاتفاق، مع إمكانية إضافة خصائص جديدة مع الوقت.",
      // Links Page
      links_desc1: "اختر وسيلة التواصل الأنسب", links_desc2: 'وسنرد عليك سريعًا <span class="eye-pill"><span class="eye-dot"></span></span> Choose your preferred contact method.',
      links_whatsapp: "تواصل معنا عبر واتساب", links_call: "اتصال مباشر", links_email: "تواصل معنا عبر البريد", links_website: "زيارة الموقع الرئيسي", links_instagram: "تابعنا على انستقرام", links_facebook: "تابعنا على فيسبوك", links_vcard: "احفظ بياناتنا في جهات الاتصال",
      links_footer_main: "© 2024 Axentro – جميع الحقوق محفوظة", links_footer_by: "By Axentro Team"
    },
    en: { 
      // Shared
      nav_home: "Home", nav_services: "Services", nav_about: "About", nav_contact: "Contact", theme_light: "Light Mode", theme_dark: "Dark Mode", lang_switch: "AR",
      know_more: "Learn more <i class='fas fa-arrow-right'></i>", btn_wa: "WhatsApp", btn_mail: "Email", btn_fb: "Facebook", btn_ig: "Instagram",
      // Index
      hero_desc: 'Integrated digital and software solutions to build your online presence <span class="eye-pill"><span class="eye-dot"></span></span> and develop smart web systems that facilitate your business management.', hero_cta: "Book Your Consultation",
      services_title: "Our Services", contact_title: "Book Your Consultation Now", contact_desc: 'We create a digital presence that reflects the strength of your project and increases your customers\' trust<br><span style="opacity:.7">We build a digital presence that strengthens your brand and builds trust.</span>',
      serv_1_desc: "Design and development of professional business websites and landing pages dedicated to increasing sales and attracting customers.", serv_2_desc: "Personal websites to showcase your work or CV in an elegant way that leaves a strong impression on employers and clients.", serv_3_desc: "Integrated electronic appointment booking systems for clinics, salons, and consulting centers, to facilitate managing your time and your clients' time.", serv_4_desc: "Specialized web systems for managing clinics and medical centers: patient files, appointments, invoices, and medical reports in one place.", serv_5_desc: "Integrated e-commerce stores or product catalog websites, with easy-to-use dashboards for managing orders and products.", serv_6_desc: "Web systems for inventory and sales management that work from any browser, tracking item movements, invoices, and performance reports accurately.", serv_7_desc: "Customer Relationship Management (CRM) systems: recording customer data, tracking sales plans, and logging calls to increase sales and organize the team.", serv_8_desc: "Digital menus for restaurants and cafes that work by scanning a QR code, allowing customers to browse the menu and send orders directly to the kitchen or cashier.", serv_9_desc: "Integrated web platforms for displaying real estate or classified ads, allowing uploading property details, images, and filtering search for customers easily.",
      // About
      about_title: "About Us", about_desc: 'At Axentro, we believe the future is on the web. We specialize in providing integrated digital solutions <span class="eye-pill"><span class="eye-dot"></span></span> ranging from building informational websites to advanced business management systems that operate entirely online.',
      stat_1: "Integrated Web Service Tracks", stat_2: "Fully Browser-based Solutions (Cloud)", stat_3: "Fast Communication Channels (WhatsApp/Mail)", stat_4: "Modern Designs Focused on UX",
      values_title: "Our Core Values", values_desc: "3 constant principles in every project—ensuring quality, speed, and clarity from day one until delivery.",
      val_1: "We care about details: clean structure, clear interface, testing, and organized delivery. The goal is for the platform to stay with you and work stably.", val_2: "We reach the result quickly without wasting time: dividing phases, first version (MVP) then gradual development based on priorities.", val_3: "Every step has clear outputs: requirements, design, execution, training. So you understand exactly what you will get and when.",
      services_title_about: "What We Offer", services_desc: "Our services are designed to cover the needs of companies and individuals: from informational websites to booking systems and sales management, all working smoothly on any browser.",
      copy_link: "<i class='fas fa-link'></i> Copy Service Link",
      process_title: "How We Work With You", process_desc: "Clear workflow—no complexity and the fastest path to the result.",
      proc_1_title: "1) Requirements Understanding Session", proc_1_desc: "We gather your business details, current problems, and define the requirements accurately (Features + reports + permissions).", proc_2_title: "2) Solution Design", proc_2_desc: "We provide a visualization of the interface and workflow before execution, so everything is clear.", proc_3_title: "3) Execution & Testing", proc_3_desc: "Professional execution + real-world case testing + improvements based on feedback.", proc_4_title: "4) Training & Delivery", proc_4_desc: "Usage explanation + brief manual + organized delivery that facilitates operation.", proc_5_title: "5) Support & Development", proc_5_desc: "Post-delivery follow-up + developing new phases as your project grows.",
      faq_title: "FAQ", faq_desc: "Quick answers to the most important questions before we start.",
      faq_1_q: "How do we start together? <i class='fas fa-chevron-down chev'></i>", faq_1_a: "We start with a short session to understand your business nature and the required goal, after which we define the scope of work, steps, and expected duration, then begin execution in phases.",
      faq_2_q: "How much does it cost to create a website or system? <i class='fas fa-chevron-down chev'></i>", faq_2_a: "The cost varies depending on the size of the system and the required features. We offer a transparent and suitable price quote for your budget after the free consultation session and accurately defining the requirements.",
      faq_3_q: "How long does execution take? <i class='fas fa-chevron-down chev'></i>", faq_3_a: "Informational websites and landing pages take 3 to 7 days. Administrative systems and stores take 2 to 4 weeks depending on the data volume and complexity of the required features.",
      faq_4_q: "Will the website or system be completely mine? <i class='fas fa-chevron-down chev'></i>", faq_4_a: "Yes, all codes and systems are completely yours, operating under your name and your company's name, and you have the right to control and modify them at any time.",
      faq_5_q: "Do you provide hosting and domain name? <i class='fas fa-chevron-down chev'></i>", faq_5_a: "Yes, we provide everything you need from fast cloud hosting and a domain name and data security to start immediately without any technical complications.",
      faq_6_q: "Will the systems work on mobile? <i class='fas fa-chevron-down chev'></i>", faq_6_a: "Yes, all websites and systems we program are 'Responsive', meaning they work and appear professionally on mobile, tablet, and computer through any internet browser.",
      faq_7_q: "Is there support after delivery? <i class='fas fa-chevron-down chev'></i>", faq_7_a: "Yes, we provide support and modifications according to the agreement, with the possibility of adding new features over time.",
      // Links Page
      links_desc1: "Choose your preferred contact method", links_desc2: 'and we\'ll get back to you quickly <span class="eye-pill"><span class="eye-dot"></span></span> اختر وسيلة التواصل الأنسب وسنرد عليك سريعًا.',
      links_whatsapp: "Contact us via WhatsApp", links_call: "Direct Call", links_email: "Contact us via Email", links_website: "Visit Main Website", links_instagram: "Follow us on Instagram", links_facebook: "Follow us on Facebook", links_vcard: "Save our contact details",
      links_footer_main: "© 2024 Axentro – All Rights Reserved", links_footer_by: "By Axentro Team"
    }
  };

  window.AxentroLang = {
    updateThemeText: function(isLight) {
      const currentLang = document.documentElement.getAttribute('lang') || 'ar';
      themeText.textContent = isLight ? translations[currentLang].theme_light : translations[currentLang].theme_dark;
    }
  };

  function applyLanguage(lang) {
    const dict = translations[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('lang', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.innerHTML = dict[key];
    });
    
    langText.textContent = dict.lang_switch;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    window.AxentroLang.updateThemeText(isLight);
  }

  langSwitcher.addEventListener('click', (e) => {
    if (window.createRipple) window.createRipple(e);
    const currentLang = document.documentElement.getAttribute('lang');
    applyLanguage(currentLang === 'ar' ? 'en' : 'ar');
  });

  // Init
  applyLanguage(localStorage.getItem('lang') || 'ar');
});
