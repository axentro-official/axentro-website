document.addEventListener('DOMContentLoaded', () => {
  const langSwitcher = document.getElementById('lang-switcher');
  const langText = document.getElementById('lang-text');
  const themeText = document.getElementById('theme-text');

  const translations = {
    ar: { 
      // Shared
      nav_home: "الرئيسية", nav_services: "الخدمات", nav_about: "من نحن", nav_contact: "اتصل بنا", theme_light: "الوضع النهاري", theme_dark: "الوضع الليلي", lang_switch: "EN",
      know_more: "اعرف المزيد <i class='fas fa-arrow-left'></i>", btn_wa: "واتساب", btn_mail: "بريد", btn_fb: "فيسبوك", btn_ig: "انستقرام", btn_tiktok: "تيك توك",
      // Index
      hero_desc: 'حلول تطوير مواقع وبرمجيات للشركات حول العالم <span class="eye-pill"><span class="eye-dot"></span></span>', hero_cta: "احجز استشارتك الآن",
      services_title: "خدماتنا | Services", contact_title: "احجز استشارتك الآن", contact_desc: 'نصنع لك حضورًا رقميًا يعكس قوة مشروعك ويزيد ثقة عملائك.',
      serv_1_desc: "تصميم وتطوير مواقع إلكترونية احترافية للشركات والأعمال، تشمل Business Websites وLanding Pages سريعة ومتجاوبة، مع Web Development مخصص لتحسين الحضور الرقمي وجذب العملاء.", serv_2_desc: "تصميم وتطوير مواقع شخصية احترافية وPortfolio Websites لعرض الأعمال والسيرة الذاتية، بتصميم متجاوب يساعد على بناء حضور رقمي قوي أمام أصحاب العمل والعملاء.", serv_3_desc: "تطوير أنظمة حجز مواعيد وحجوزات إلكترونية للشركات ومقدمي الخدمات، تشمل Online Booking وAppointment Booking وReservation Systems، مع إدارة المواعيد والعملاء بسهولة.", serv_4_desc: "تطوير أنظمة إدارة العيادات والمراكز الطبية لتنظيم ملفات المرضى والمواعيد والفواتير والتقارير، مع Clinic Management Software مخصص لاحتياجات الأطباء والمراكز الطبية.", serv_5_desc: "تطوير متاجر إلكترونية احترافية للشركات والأعمال، تشمل E-commerce Development وOnline Store Development، مع إدارة المنتجات والطلبات ولوحة تحكم سهلة الاستخدام.", serv_6_desc: "تطوير أنظمة إدارة المخزون والمبيعات للشركات والأعمال، تشمل Inventory Management وSales Management وتتبع الأصناف والفواتير وحركة المخزون وتقارير الأداء من أي متصفح.", serv_7_desc: "تطوير أنظمة إدارة علاقات العملاء للشركات، تشمل CRM Software وCustom CRM Development لإدارة بيانات العملاء ومتابعة المبيعات والاتصالات وتنظيم فريق العمل وتحسين عمليات البيع.", serv_8_desc: "تطوير قوائم رقمية للمطاعم والكافيهات تشمل QR Menu وDigital Menu وOnline Ordering Systems، لعرض المنتجات والأسعار وتمكين العملاء من تصفح المنيو وإرسال الطلبات بسهولة.", serv_9_desc: "تطوير منصات العقارات والإعلانات المبوبة للشركات والمشروعات العقارية، تشمل Real Estate Listing وProperty Platforms لعرض العقارات والصور والتفاصيل مع البحث والتصفية بسهولة.",
      // About
      about_title: "من نحن | About", about_desc: 'في Axentro، نطوّر مواقع إلكترونية وحلولًا برمجية مخصصة للشركات والأعمال، من Business Websites والمتاجر الإلكترونية إلى أنظمة إدارة الأعمال والحلول الرقمية المتقدمة.',
      stat_1: "مسارات خدمات ويب متكاملة", stat_2: "حلول تعمل بالكامل على المتصفح (Cloud-based)", stat_3: "قنوات تواصل سريعة (واتساب / بريد)", stat_4: "تصميمات عصرية تركز على تجربة المستخدم",
      values_title: "قيمنا الأساسية", values_desc: "3 مبادئ ثابتة في كل مشروع—تضمن الجودة والسرعة والوضوح من أول يوم حتى التسليم.",
      val_1: "نهتم بالتفاصيل: هيكلة نظيفة، واجهة واضحة، اختبار، وتسليم منظم. الهدف إن المنصة يظل معك وتعمل بثبات.", val_2: "نوصل للنتيجة بسرعة بدون ضياع للوقت: تقسيم مراحل، أول نسخة (MVP) ثم تطوير تدريجي حسب الأولويات.", val_3: "كل خطوة لها مخرجات واضحة: المطلوب، التصميم، التنفيذ، التدريب. عشان تبقى فاهم أنت هتحصل علي إيه وأمتى.",
      services_title_about: "خدمات تطوير المواقع والبرمجيات", services_desc: "نقدم خدمات تطوير المواقع والبرمجيات للشركات والأعمال، من Business Websites والمتاجر الإلكترونية إلى أنظمة الحجز وإدارة المبيعات وCRM والحلول الرقمية المخصصة.",
      copy_link: "<i class='fas fa-link'></i> نسخ رابط الخدمة",
      process_title: "كيف نعمل معك في تطوير المواقع والبرمجيات", process_desc: "منهج واضح لتطوير المواقع والبرمجيات—من فهم المتطلبات وتصميم الحل إلى التنفيذ والاختبار والتسليم والدعم.",
      proc_1_title: "1) جلسة فهم الاحتياج", proc_1_desc: "نجمع تفاصيل عملك، المشاكل الحالية، ونحدد المطلوب بدقة (Features + تقارير + صلاحيات).", proc_2_title: "2) تصميم الحل", proc_2_desc: "نقدّم تصور للواجهة وخط سير العمل قبل التنفيذ، عشان كل شيء يبقى واضح.", proc_3_title: "3) تنفيذ واختبار", proc_3_desc: "تنفيذ احترافي + اختبار حالات واقعية + تحسينات بناءً على الملاحظات.", proc_4_title: "4) تدريب وتسليم", proc_4_desc: "شرح للاستخدام + دليل مختصر + تسليم منظم يسهّل التشغيل.", proc_5_title: "5) دعم وتطوير", proc_5_desc: "متابعة بعد التسليم + تطوير مراحل جديدة لما مشروعك يكبر.",
      faq_title: "أسئلة شائعة عن تطوير المواقع والبرمجيات | FAQ", faq_desc: "إجابات سريعة عن خدمات تطوير المواقع والبرمجيات، التكلفة، مدة التنفيذ، الملكية، والاستضافة والدعم.",
      faq_1_q: "إزاي نبدأ مشروع تطوير موقع أو نظام؟ <i class='fas fa-chevron-down chev'></i>", faq_1_a: "بنبدأ بجلسة قصيرة لفهم طبيعة عملك والهدف المطلوب، بعدها نحدد نطاق العمل والمميزات المطلوبة والخطوات والمدة المتوقعة، ثم نبدأ التنفيذ على مراحل.",
      faq_2_q: "كم تكلفة تطوير موقع أو نظام برمجي؟ <i class='fas fa-chevron-down chev'></i>", faq_2_a: "التكلفة بتختلف حسب حجم الموقع أو النظام والمميزات المطلوبة. بعد تحديد المتطلبات بدقة، بنقدملك عرض سعر واضح يوضح نطاق العمل والتكلفة المتوقعة.",
      faq_3_q: "كم تستغرق مدة تطوير الموقع أو النظام؟ <i class='fas fa-chevron-down chev'></i>", faq_3_a: "مدة التنفيذ بتختلف حسب نوع المشروع وحجمه. المواقع التعريفية وصفحات الهبوط غالبًا بتكون أسرع من الأنظمة الإدارية والمتاجر، ويتم تحديد المدة المتوقعة بعد مراجعة المتطلبات.",
      faq_4_q: "هل الموقع أو النظام هيكون ملكي بالكامل؟ <i class='fas fa-chevron-down chev'></i>", faq_4_a: "نعم، ملكية الموقع أو النظام والأكواد بتكون حسب الاتفاق المبرم مع العميل، ويتم توضيح حقوق الاستخدام والملكية ضمن نطاق المشروع قبل بدء التنفيذ.",
      faq_5_q: "هل توفرون استضافة واسم نطاق للموقع؟ <i class='fas fa-chevron-down chev'></i>", faq_5_a: "نعم، يمكننا توفير خدمات الاستضافة واسم النطاق (Domain) حسب احتياجات المشروع والاتفاق، مع إعداد الموقع ليكون جاهزًا للتشغيل.",
      faq_6_q: "هل المواقع والأنظمة البرمجية تعمل على الموبايل؟ <i class='fas fa-chevron-down chev'></i>", faq_6_a: "نعم، بنطوّر المواقع والأنظمة بتصميم Responsive بحيث تعمل وتظهر بشكل احترافي على الموبايل والتابلت والكمبيوتر من خلال متصفحات الإنترنت.",
      faq_7_q: "هل توفرون دعمًا وتطويرًا بعد تسليم الموقع أو النظام؟ <i class='fas fa-chevron-down chev'></i>", faq_7_a: "نعم، نوفر الدعم والتعديلات والتطويرات الإضافية حسب الاتفاق، مع إمكانية تطوير خصائص جديدة مع نمو مشروعك.",
      // Links Page
      links_title: "Axentro | اكسنترو لتطوير المواقع والبرمجيات",
      links_desc1: "اختر وسيلة التواصل المناسبة للتواصل مع Axentro",
      links_desc2: 'وسنرد عليك سريعًا <span class="eye-pill"><span class="eye-dot"></span></span>',
      links_whatsapp: "تواصل معنا عبر واتساب", links_call: "اتصال مباشر", links_email: "تواصل معنا عبر البريد", links_website: "زيارة الموقع الرئيسي", links_instagram: "تابعنا على انستقرام", links_tiktok: "تابعنا على تيك توك", links_facebook: "تابعنا على فيسبوك", links_vcard: "احفظ بياناتنا في جهات الاتصال",
      links_footer_main: "© 2026 Axentro – جميع الحقوق محفوظة", links_footer_by: "By Axentro Team"
    },
    en: { 
      // Shared
      nav_home: "Home", nav_services: "Services", nav_about: "About", nav_contact: "Contact", theme_light: "Light Mode", theme_dark: "Dark Mode", lang_switch: "AR",
      know_more: "Learn more <i class='fas fa-arrow-right'></i>", btn_wa: "WhatsApp", btn_mail: "Email", btn_fb: "Facebook", btn_ig: "Instagram", btn_tiktok: "TikTok",
      // Index
      hero_desc: 'Web Development & Software Solutions for Businesses Worldwide <span class="eye-pill"><span class="eye-dot"></span></span>', hero_cta: "Book Your Consultation",
      services_title: "Our Services", contact_title: "Book Your Consultation Now", contact_desc: "We create a digital presence that reflects the strength of your business and builds customer trust.",
      serv_1_desc: "Professional web development for businesses, including Business Websites and responsive Landing Pages, with custom Web Development focused on strengthening your online presence and attracting customers.", serv_2_desc: "Professional portfolio and personal website development for showcasing your work and CV, with responsive design that helps build a strong digital presence for employers and clients.", serv_3_desc: "Custom online booking and appointment system development for businesses and service providers, including Online Booking, Appointment Booking, and Reservation Systems with easy appointment and customer management.", serv_4_desc: "Clinic and medical center management software for organizing patient records, appointments, invoices, and reports, with custom Clinic Management Software tailored to doctors and medical centers.", serv_5_desc: "Professional e-commerce development for businesses, including E-commerce Development and Online Store Development, with product and order management and an easy-to-use dashboard.", serv_6_desc: "Inventory and sales management systems for businesses, including Inventory Management and Sales Management, with item, invoice, stock movement, and performance tracking from any browser.", serv_7_desc: "CRM software and custom CRM development for businesses, including customer data management, sales and communication tracking, team organization, and improved sales operations.", serv_8_desc: "Digital menu solutions for restaurants and cafes, including QR Menu, Digital Menu, and Online Ordering Systems, allowing customers to browse products and prices and place orders easily.", serv_9_desc: "Real estate listing and property platforms for real estate businesses, including property listings, images, details, search, and filtering for an easier customer experience.",
      // About
      about_title: "About Us", about_desc: 'At Axentro, we develop professional websites and custom software solutions for businesses, from Business Websites and e-commerce stores to business management systems and advanced digital solutions.',
      stat_1: "Integrated Web Service Tracks", stat_2: "Fully Browser-based Solutions (Cloud)", stat_3: "Fast Communication Channels (WhatsApp/Mail)", stat_4: "Modern Designs Focused on UX",
      values_title: "Our Core Values", values_desc: "3 constant principles in every project—ensuring quality, speed, and clarity from day one until delivery.",
      val_1: "We care about details: clean structure, clear interface, testing, and organized delivery. The goal is for the platform to stay with you and work stably.", val_2: "We reach the result quickly without wasting time: dividing phases, first version (MVP) then gradual development based on priorities.", val_3: "Every step has clear outputs: requirements, design, execution, training. So you understand exactly what you will get and when.",
      services_title_about: "Web Development & Software Services", services_desc: "We provide web development and software services for businesses, from Business Websites and e-commerce stores to booking systems, sales management, CRM, and custom digital solutions.",
      copy_link: "<i class='fas fa-link'></i> Copy Service Link",
      process_title: "How We Work With You on Web & Software Development", process_desc: "A clear web and software development process—from requirements and solution design to development, testing, delivery, and support.",
      proc_1_title: "1) Requirements Understanding Session", proc_1_desc: "We gather your business details, current problems, and define the requirements accurately (Features + reports + permissions).", proc_2_title: "2) Solution Design", proc_2_desc: "We provide a visualization of the interface and workflow before execution, so everything is clear.", proc_3_title: "3) Execution & Testing", proc_3_desc: "Professional execution + real-world case testing + improvements based on feedback.", proc_4_title: "4) Training & Delivery", proc_4_desc: "Usage explanation + brief manual + organized delivery that facilitates operation.", proc_5_title: "5) Support & Development", proc_5_desc: "Post-delivery follow-up + developing new phases as your project grows.",
      faq_title: "Frequently Asked Questions About Web & Software Development | FAQ", faq_desc: "Quick answers about web development and software services, pricing, project timelines, ownership, hosting, and support.",
      faq_1_q: "How do we start a web or software development project? <i class='fas fa-chevron-down chev'></i>", faq_1_a: "We start with a short session to understand your business and project goals. Then we define the scope, required features, development steps, and expected timeline before starting the project in phases.",
      faq_2_q: "How much does it cost to create a website or system? <i class='fas fa-chevron-down chev'></i>", faq_2_a: "The cost varies depending on the website or software system, its size, and the required features. After reviewing the requirements, we provide a clear quotation outlining the project scope and expected cost.",
      faq_3_q: "How long does web or software development take? <i class='fas fa-chevron-down chev'></i>", faq_3_a: "The development timeline depends on the type and size of the project. Business websites and landing pages are generally faster to deliver than administrative systems and e-commerce stores. The expected timeline is defined after reviewing the requirements.",
      faq_4_q: "Will I fully own the website or software system? <i class='fas fa-chevron-down chev'></i>", faq_4_a: "Yes. Ownership of the website, software system, and source code is determined according to the agreement with the client. Ownership and usage rights are clearly defined within the project scope before development begins.",
      faq_5_q: "Do you provide website hosting and a domain name? <i class='fas fa-chevron-down chev'></i>", faq_5_a: "Yes. We can provide website hosting and a domain name according to the project's requirements and agreement, and configure the website so it is ready to launch.",
      faq_6_q: "Do your websites and software systems work on mobile devices? <i class='fas fa-chevron-down chev'></i>", faq_6_a: "Yes. We develop websites and software systems with responsive designs so they work and display professionally on mobile devices, tablets, and computers through modern web browsers.",
      faq_7_q: "Do you provide support and development after website or software delivery? <i class='fas fa-chevron-down chev'></i>", faq_7_a: "Yes. We provide support, modifications, and additional development according to the agreement, with the option to add new features as your business grows.",
      // Links Page
      links_title: "Axentro | Web Development & Software Solutions",
      links_desc1: "Choose your preferred way to contact Axentro",
      links_desc2: 'and we\'ll get back to you quickly <span class="eye-pill"><span class="eye-dot"></span></span>',
      links_whatsapp: "Contact us via WhatsApp", links_call: "Direct Call", links_email: "Contact us via Email", links_website: "Visit Main Website", links_instagram: "Follow us on Instagram", links_tiktok: "Follow us on TikTok", links_facebook: "Follow us on Facebook", links_vcard: "Save our contact details",
      links_footer_main: "© 2026 Axentro – All Rights Reserved", links_footer_by: "By Axentro Team"
    }
  };

    window.AxentroLang = {
    updateThemeText: function(isLight) {
      const currentLang = document.documentElement.getAttribute('lang') || 'ar';
      themeText.textContent = isLight ? translations[currentLang].theme_light : translations[currentLang].theme_dark;
    }
  };

  // --- Language architecture: "/" = Arabic (static), "/en/" = English (static) ---
  // Converted home pages: the switcher NAVIGATES between the two versions.
  // Not-yet-converted pages (about.html, links.html, ...): keep the original in-page switching.

  const path = window.location.pathname;
  const isEnglishPage = path === '/en' || path.indexOf('/en/') === 0;
  const isConvertedHome = isEnglishPage || path === '/' || path === '/index.html';

  if (isConvertedHome) {
    // The static HTML already has the correct language content.
    // Sync html attributes + stored preference with the page actually being viewed.
    const pageLang = isEnglishPage ? 'en' : 'ar';
    document.documentElement.setAttribute('lang', pageLang);
    document.documentElement.setAttribute('dir', pageLang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('lang', pageLang);

    // Button label = the language you can switch TO
    langText.textContent = translations[pageLang].lang_switch;

    langSwitcher.addEventListener('click', (e) => {
      if (window.createRipple) window.createRipple(e);
      const hash = window.location.hash || '';
      window.location.href = isEnglishPage ? ('/' + hash) : ('/en/' + hash);
    });
  } else {
    // Legacy pages: original behavior, unchanged, until they get their own static versions.
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
  }
});
