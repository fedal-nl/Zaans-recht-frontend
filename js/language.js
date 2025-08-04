const translations = {
  en: {
    nav_home: "Home",
    nav_about: "About Me",
    nav_contact: "Contact",
    welcome: "Welcome to Zaans Recht",
    intro_text: "Legal support you can trust, proudly based in Zaanstad.",
    about_title: "About Me",
    about_description: "I am a legal advisor with a passion for justice and helping the local community in Zaanstad.",
    contact_heading: "Contact Me",
    form_name: "Full Name",
    form_phone: "Phone",
    form_email: "Email",
    form_submit: "Send",
  },
  nl: {
    nav_home: "Home",
    nav_about: "Over Mij",
    nav_contact: "Contact",
    welcome: "Welkom bij Zaans Recht",
    intro_text: "Juridische hulp die je kunt vertrouwen, gevestigd in Zaanstad.",
    about_title: "Over Mij",
    about_description: "Ik ben een juridisch adviseur met een passie voor rechtvaardigheid en het helpen van de lokale gemeenschap in Zaanstad.",
    contact_heading: "Neem Contact Op",
    form_name: "Volledige Naam",
    form_phone: "Telefoon",
    form_email: "E-mail",
    form_submit: "Verzenden",
  },
  ar: {
    nav_home: "الرئيسية",
    nav_about: "من أنا",
    nav_contact: "اتصال",
    welcome: "مرحبا بكم في زانس ريخت",
    intro_text: "دعم قانوني موثوق به، مقره في زانستاد.",
    about_title: "من أنا",
    about_description: "أنا مستشار قانوني شغوف بالعدالة ومساعدة المجتمع المحلي في زانستاد.",
    contact_heading: "اتصل بي",
    form_name: "الاسم الكامل",
    form_phone: "الهاتف",
    form_email: "البريد الإلكتروني",
    form_submit: "إرسال",
  },
};

function setLang(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}
