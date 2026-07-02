"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Locale = "es" | "ca" | "en" | "fr";
export const LOCALES: { code: Locale; label: string; name: string }[] = [
  { code: "es", label: "ES", name: "Español" },
  { code: "ca", label: "CA", name: "Català" },
  { code: "en", label: "EN", name: "English" },
  { code: "fr", label: "FR", name: "Français" },
];

const es = {
  nav: { inicio: "Inicio", servicios: "Servicios", transformaciones: "Transformaciones", productos: "Productos", sobremi: "Sobre mí", contacto: "Contacto" },
  cta: { reserva: "Reserva", reservar: "Reserva tu cita", reservarCorto: "Reservar cita", reservarAhora: "Reservar ahora", llamar: "Llamar", verMas: "Ver más", verServicio: "Ver servicio", verTodos: "Ver todos", conoceme: "Conóceme", comoLlegar: "Cómo llegar", consultar: "Consultar", preguntar: "Preguntar", verProductos: "Ver productos" },
  hero: {
    slides: { portada: "Portada", novedades: "Novedades", contacto: "Contacto" },
    subtitle: "Especialistas en cabello rizado en Tarragona. Empieza a entender tu rizo.",
    verVideo: "Ver el vídeo en Instagram",
    novedadesTitle: "Novedades",
    contactoEyebrow: "¿Hablamos?",
    contactoTitle: "Reserva o escríbenos",
    contactoSub: "Estamos en {addr}, {city}.",
    hours: "Lun–Mié 9:30–18:30 · Jue–Vie 9:30–19:30 · Sáb 9:30–13:30",
  },
  identify: { eyebrow: "¿Te suena?", title: "Si tu rizo no define, se encrespa o sientes que no sabes cómo cuidarlo, no es tu culpa.", text: "El cabello rizado necesita una forma de trabajar diferente. Una que empiece por entenderlo antes de transformarlo." },
  solution: {
    eyebrow: "Qué hacemos",
    titleA: "No solo transformamos tu rizo.",
    titleB: "Te enseñamos a entenderlo.",
    text: "En Alma Rizo trabajamos desde el diagnóstico, el corte en seco y la definición personalizada para conseguir resultados naturales y duraderos. Y, sobre todo, para que sepas mantenerlos en casa.",
    descubre: "Descubre el método",
    pillars: [
      { title: "Diagnóstico", text: "Analizamos tu tipo de rizo, su estado y tu rutina para entender qué necesita de verdad." },
      { title: "Corte en seco", text: "Cortamos rizo a rizo, en seco, respetando tu patrón natural y tu forma." },
      { title: "Definición personalizada", text: "Productos y técnica a tu medida para un resultado natural, definido y duradero." },
    ],
  },
  services: { eyebrow: "Servicios", title: "Empieza por aquí", sub: "Tres experiencias pensadas para cada momento de tu rizo.", verTodos: "Ver todos los servicios", duracion: "Duración", reservar: "Reservar" },
  results: { eyebrow: "Resultados", title: "Resultados reales, rizos felices", sub: "Transformaciones reales de nuestras clientas.", antes: "Antes", despues: "Después", verTodas: "Ver todas las transformaciones" },
  about: { eyebrow: "Sobre mí", title: "Soy Maricruz, especialista en cabello rizado.", text1: "Después de años trabajando con diferentes tipos de rizo, decidí especializarme para poder ofrecer resultados reales y personalizados a cada clienta.", text2: "Mi forma de trabajar parte de una idea sencilla: cuando entiendes tu rizo, todo cambia." },
  products: { eyebrow: "Productos", title: "Llévate tu rizo a casa", sub: "Los productos que recomendamos para mantener el resultado día a día.", verTodos: "Ver todos los productos" },
  reviews: { eyebrow: "Reseñas", title: "Lo que dicen nuestras clientas", destacadas: "reseñas destacadas" },
  location: { eyebrow: "Dónde estamos", title: "Ven a vernos en Tarragona" },
  finalcta: { eyebrow: "Tu cita te espera", title: "Empieza a entender tu rizo hoy", sub: "Reserva en menos de un minuto. Te acompañamos en todo el proceso." },
  footer: { tagline: "Corte en seco, diagnóstico y definición personalizada para que aprendas a entender tu rizo.", contacto: "Contacto", explora: "Explora", metodo: "El Método Alma Rizo", consejos: "Consejos", faq: "Preguntas frecuentes", reservar: "Reservar cita", rights: "Todos los derechos reservados.", avisoLegal: "Aviso legal", privacidad: "Privacidad", cookies: "Cookies", acceso: "Acceso equipo" },
};

type Dict = typeof es;

const ca: Dict = {
  nav: { inicio: "Inici", servicios: "Serveis", transformaciones: "Transformacions", productos: "Productes", sobremi: "Sobre mi", contacto: "Contacte" },
  cta: { reserva: "Reserva", reservar: "Reserva la teva cita", reservarCorto: "Reservar cita", reservarAhora: "Reservar ara", llamar: "Truca", verMas: "Veure més", verServicio: "Veure servei", verTodos: "Veure tots", conoceme: "Coneix-me", comoLlegar: "Com arribar", consultar: "Consultar", preguntar: "Preguntar", verProductos: "Veure productes" },
  hero: {
    slides: { portada: "Portada", novedades: "Novetats", contacto: "Contacte" },
    subtitle: "Especialistes en cabell arrissat a Tarragona. Comença a entendre el teu rull.",
    verVideo: "Veure el vídeo a Instagram",
    novedadesTitle: "Novetats",
    contactoEyebrow: "En parlem?",
    contactoTitle: "Reserva o escriu-nos",
    contactoSub: "Som a {addr}, {city}.",
    hours: "Dl–Dc 9:30–18:30 · Dj–Dv 9:30–19:30 · Ds 9:30–13:30",
  },
  identify: { eyebrow: "Et sona?", title: "Si el teu rull no es defineix, s'encrespa o sents que no saps com cuidar-lo, no és culpa teva.", text: "El cabell arrissat necessita una manera de treballar diferent. Una que comenci per entendre'l abans de transformar-lo." },
  solution: {
    eyebrow: "Què fem",
    titleA: "No només transformem el teu rull.",
    titleB: "T'ensenyem a entendre'l.",
    text: "A Alma Rizo treballem des del diagnòstic, el tall en sec i la definició personalitzada per aconseguir resultats naturals i duradors. I, sobretot, perquè sàpigues mantenir-los a casa.",
    descubre: "Descobreix el mètode",
    pillars: [
      { title: "Diagnòstic", text: "Analitzem el teu tipus de rull, el seu estat i la teva rutina per entendre què necessita de veritat." },
      { title: "Tall en sec", text: "Tallem rull a rull, en sec, respectant el teu patró natural i la teva forma." },
      { title: "Definició personalitzada", text: "Productes i tècnica a mida per a un resultat natural, definit i durador." },
    ],
  },
  services: { eyebrow: "Serveis", title: "Comença per aquí", sub: "Tres experiències pensades per a cada moment del teu rull.", verTodos: "Veure tots els serveis", duracion: "Durada", reservar: "Reservar" },
  results: { eyebrow: "Resultats", title: "Resultats reals, rulls feliços", sub: "Transformacions reals de les nostres clientes.", antes: "Abans", despues: "Després", verTodas: "Veure totes les transformacions" },
  about: { eyebrow: "Sobre mi", title: "Sóc la Maricruz, especialista en cabell arrissat.", text1: "Després d'anys treballant amb diferents tipus de rull, vaig decidir especialitzar-me per oferir resultats reals i personalitzats a cada clienta.", text2: "La meva manera de treballar parteix d'una idea senzilla: quan entens el teu rull, tot canvia." },
  products: { eyebrow: "Productes", title: "Emporta't el teu rull a casa", sub: "Els productes que recomanem per mantenir el resultat dia a dia.", verTodos: "Veure tots els productes" },
  reviews: { eyebrow: "Ressenyes", title: "Què diuen les nostres clientes", destacadas: "ressenyes destacades" },
  location: { eyebrow: "On som", title: "Vine a veure'ns a Tarragona" },
  finalcta: { eyebrow: "La teva cita t'espera", title: "Comença a entendre el teu rull avui", sub: "Reserva en menys d'un minut. T'acompanyem en tot el procés." },
  footer: { tagline: "Tall en sec, diagnòstic i definició personalitzada perquè aprenguis a entendre el teu rull.", contacto: "Contacte", explora: "Explora", metodo: "El Mètode Alma Rizo", consejos: "Consells", faq: "Preguntes freqüents", reservar: "Reservar cita", rights: "Tots els drets reservats.", avisoLegal: "Avís legal", privacidad: "Privacitat", cookies: "Galetes", acceso: "Accés equip" },
};

const en: Dict = {
  nav: { inicio: "Home", servicios: "Services", transformaciones: "Transformations", productos: "Products", sobremi: "About", contacto: "Contact" },
  cta: { reserva: "Book", reservar: "Book your appointment", reservarCorto: "Book now", reservarAhora: "Book now", llamar: "Call", verMas: "See more", verServicio: "See service", verTodos: "See all", conoceme: "Meet me", comoLlegar: "Get directions", consultar: "Ask", preguntar: "Ask us", verProductos: "See products" },
  hero: {
    slides: { portada: "Home", novedades: "News", contacto: "Contact" },
    subtitle: "Curly hair specialists in Tarragona. Start understanding your curls.",
    verVideo: "Watch the video on Instagram",
    novedadesTitle: "What's new",
    contactoEyebrow: "Let's talk",
    contactoTitle: "Book or write to us",
    contactoSub: "We're at {addr}, {city}.",
    hours: "Mon–Wed 9:30–18:30 · Thu–Fri 9:30–19:30 · Sat 9:30–13:30",
  },
  identify: { eyebrow: "Sound familiar?", title: "If your curls won't define, get frizzy or you feel lost about how to care for them, it's not your fault.", text: "Curly hair needs a different approach. One that starts by understanding it before transforming it." },
  solution: {
    eyebrow: "What we do",
    titleA: "We don't just transform your curls.",
    titleB: "We teach you to understand them.",
    text: "At Alma Rizo we work from diagnosis, dry cutting and personalised definition to achieve natural, long-lasting results. And, above all, so you know how to keep them at home.",
    descubre: "Discover the method",
    pillars: [
      { title: "Diagnosis", text: "We analyse your curl type, its condition and your routine to understand what it really needs." },
      { title: "Dry cut", text: "We cut curl by curl, dry, respecting your natural pattern and shape." },
      { title: "Personalised definition", text: "Products and technique tailored to you for a natural, defined, lasting result." },
    ],
  },
  services: { eyebrow: "Services", title: "Start here", sub: "Three experiences designed for every moment of your curls.", verTodos: "See all services", duracion: "Duration", reservar: "Book" },
  results: { eyebrow: "Results", title: "Real results, happy curls", sub: "Real transformations of our clients.", antes: "Before", despues: "After", verTodas: "See all transformations" },
  about: { eyebrow: "About", title: "I'm Maricruz, a curly hair specialist.", text1: "After years working with different curl types, I decided to specialise so I could offer real, personalised results to every client.", text2: "My approach starts from a simple idea: when you understand your curls, everything changes." },
  products: { eyebrow: "Products", title: "Take your curls home", sub: "The products we recommend to keep the result day after day.", verTodos: "See all products" },
  reviews: { eyebrow: "Reviews", title: "What our clients say", destacadas: "featured reviews" },
  location: { eyebrow: "Where we are", title: "Come and see us in Tarragona" },
  finalcta: { eyebrow: "Your appointment awaits", title: "Start understanding your curls today", sub: "Book in under a minute. We'll guide you every step of the way." },
  footer: { tagline: "Dry cutting, diagnosis and personalised definition so you learn to understand your curls.", contacto: "Contact", explora: "Explore", metodo: "The Alma Rizo Method", consejos: "Tips", faq: "FAQ", reservar: "Book appointment", rights: "All rights reserved.", avisoLegal: "Legal notice", privacidad: "Privacy", cookies: "Cookies", acceso: "Team access" },
};

const fr: Dict = {
  nav: { inicio: "Accueil", servicios: "Services", transformaciones: "Transformations", productos: "Produits", sobremi: "À propos", contacto: "Contact" },
  cta: { reserva: "Réserver", reservar: "Réserve ton rendez-vous", reservarCorto: "Réserver", reservarAhora: "Réserver", llamar: "Appeler", verMas: "Voir plus", verServicio: "Voir le service", verTodos: "Voir tout", conoceme: "Me connaître", comoLlegar: "Itinéraire", consultar: "Demander", preguntar: "Nous demander", verProductos: "Voir les produits" },
  hero: {
    slides: { portada: "Accueil", novedades: "Actualités", contacto: "Contact" },
    subtitle: "Spécialistes du cheveu bouclé à Tarragone. Commence à comprendre ta boucle.",
    verVideo: "Voir la vidéo sur Instagram",
    novedadesTitle: "Actualités",
    contactoEyebrow: "On en parle ?",
    contactoTitle: "Réserve ou écris-nous",
    contactoSub: "Nous sommes au {addr}, {city}.",
    hours: "Lun–Mer 9:30–18:30 · Jeu–Ven 9:30–19:30 · Sam 9:30–13:30",
  },
  identify: { eyebrow: "Ça te parle ?", title: "Si ta boucle ne se définit pas, frisotte ou que tu ne sais pas comment en prendre soin, ce n'est pas ta faute.", text: "Le cheveu bouclé demande une autre façon de travailler. Une qui commence par le comprendre avant de le transformer." },
  solution: {
    eyebrow: "Ce que nous faisons",
    titleA: "Nous ne transformons pas seulement ta boucle.",
    titleB: "Nous t'apprenons à la comprendre.",
    text: "Chez Alma Rizo, nous partons du diagnostic, de la coupe à sec et de la définition personnalisée pour obtenir des résultats naturels et durables. Et surtout, pour que tu saches les entretenir à la maison.",
    descubre: "Découvre la méthode",
    pillars: [
      { title: "Diagnostic", text: "Nous analysons ton type de boucle, son état et ta routine pour comprendre ce dont elle a vraiment besoin." },
      { title: "Coupe à sec", text: "Nous coupons boucle par boucle, à sec, en respectant ton motif naturel et ta forme." },
      { title: "Définition personnalisée", text: "Produits et technique sur mesure pour un résultat naturel, défini et durable." },
    ],
  },
  services: { eyebrow: "Services", title: "Commence ici", sub: "Trois expériences pensées pour chaque moment de ta boucle.", verTodos: "Voir tous les services", duracion: "Durée", reservar: "Réserver" },
  results: { eyebrow: "Résultats", title: "Des résultats réels, des boucles heureuses", sub: "Transformations réelles de nos clientes.", antes: "Avant", despues: "Après", verTodas: "Voir toutes les transformations" },
  about: { eyebrow: "À propos", title: "Je suis Maricruz, spécialiste du cheveu bouclé.", text1: "Après des années à travailler différents types de boucles, j'ai décidé de me spécialiser pour offrir des résultats réels et personnalisés à chaque cliente.", text2: "Ma façon de travailler part d'une idée simple : quand tu comprends ta boucle, tout change." },
  products: { eyebrow: "Produits", title: "Emporte ta boucle à la maison", sub: "Les produits que nous recommandons pour garder le résultat jour après jour.", verTodos: "Voir tous les produits" },
  reviews: { eyebrow: "Avis", title: "Ce que disent nos clientes", destacadas: "avis à la une" },
  location: { eyebrow: "Où nous sommes", title: "Viens nous voir à Tarragone" },
  finalcta: { eyebrow: "Ton rendez-vous t'attend", title: "Commence à comprendre ta boucle dès aujourd'hui", sub: "Réserve en moins d'une minute. Nous t'accompagnons à chaque étape." },
  footer: { tagline: "Coupe à sec, diagnostic et définition personnalisée pour que tu apprennes à comprendre ta boucle.", contacto: "Contact", explora: "Explorer", metodo: "La Méthode Alma Rizo", consejos: "Conseils", faq: "FAQ", reservar: "Réserver", rights: "Tous droits réservés.", avisoLegal: "Mentions légales", privacidad: "Confidentialité", cookies: "Cookies", acceso: "Accès équipe" },
};

const dict: Record<Locale, Dict> = { es, ca, en, fr };

const Ctx = createContext<{ locale: Locale; setLocale: (l: Locale) => void; t: Dict }>({
  locale: "es",
  setLocale: () => {},
  t: es,
});

const KEY = "almarizo_locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as Locale | null;
      if (saved && dict[saved]) setLocaleState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(KEY, l);
      document.cookie = `${KEY}=${l};path=/;max-age=31536000`;
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  return <Ctx.Provider value={{ locale, setLocale, t: dict[locale] }}>{children}</Ctx.Provider>;
}

export function useT() {
  return useContext(Ctx).t;
}
export function useLang() {
  const { locale, setLocale } = useContext(Ctx);
  return { locale, setLocale };
}
