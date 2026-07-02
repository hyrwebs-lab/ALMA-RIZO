/* ============================================================
   ALMA RIZO · Curly Studio — Single source of truth for content
   Edit this file to update contact data, services and reviews.
   Items marked  // ⚠️ PLACEHOLDER  must be replaced with real data.
   ============================================================ */

export const site = {
  name: "Alma Rizo",
  fullName: "Alma Rizo · Curly Studio",
  byline: "by MariCruz",
  legalName: "Alma Rizo Curly Studio", // marca única (antes "Mimas by Mari Cruz")
  city: "Tarragona",
  tagline: "Especialistas en cabello rizado en Tarragona",
  claim: "No solo trabajamos tu rizo, te enseñamos a entenderlo.",

  contact: {
    address: "Carrer de Bonaventura Hernández i Sanahuja, 19",
    postalCode: "43002",
    cityRegion: "Tarragona",
    phone: "+34 977 23 84 38",
    phoneHref: "+34977238438",
    email: "hola@almarizo.com", // ⚠️ PLACEHOLDER — pedir correo real del negocio
    whatsapp: "34977238438", // ⚠️ PLACEHOLDER — pedir nº de WhatsApp Business real
    whatsappMsg: "¡Hola Alma Rizo! Me gustaría pedir información / reservar cita 🌿",
  },

  social: {
    // Cuenta del SALÓN — es a la que redirige principalmente la web.
    instagram: "https://www.instagram.com/almarizo.studio/",
    tiktok: "", // ⚠️ pendiente — enlace real del salón (si tienen)
    facebook: "", // ⚠️ pendiente — enlace real (si tienen)
  },

  // L-X 9:30-18:30 | J-V 9:30-19:30 | Sáb 9:30-13:30 | Dom cerrado
  hours: [
    { day: "Lunes", value: "9:30 – 18:30" },
    { day: "Martes", value: "9:30 – 18:30" },
    { day: "Miércoles", value: "9:30 – 18:30" },
    { day: "Jueves", value: "9:30 – 19:30" },
    { day: "Viernes", value: "9:30 – 19:30" },
    { day: "Sábado", value: "9:30 – 13:30" },
    { day: "Domingo", value: "Cerrado", closed: true },
  ],

  // Google Maps embed (por dirección; sin API key)
  mapsEmbed:
    "https://www.google.com/maps?q=Carrer+de+Bonaventura+Hern%C3%A1ndez+i+Sanahuja+19+43002+Tarragona&output=embed",
  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=Carrer+de+Bonaventura+Hern%C3%A1ndez+i+Sanahuja+19+43002+Tarragona",

  // Vídeo "cómo venir preparada" — se enseña tras reservar
  prepVideoUrl: "", // ⚠️ PLACEHOLDER — pegar enlace de YouTube/IG/TikTok cuando esté

  // Vídeo de fondo del banner (portada). Cuando lo envíen, colocar el .mp4 en
  // /public/videos/portada.mp4 y poner aquí "/videos/portada.mp4".
  heroVideo: "", // ⚠️ PLACEHOLDER — vídeo de Instagram para el banner
  heroVideoLink: "https://www.instagram.com/almarizo.studio/", // al pulsar el vídeo, se abre el IG del salón
} as const;

export type Service = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  durationMin: number; // ⚠️ PLACEHOLDER — confirmar duración real
  price: number; // ⚠️ PLACEHOLDER — confirmar precio real
  featured?: boolean; // aparece en la home (máx 3)
  image?: string;
};

/* Servicios reales (Carta de Servicio Alma Rizo). El precio mostrado es el de
   referencia; las duraciones son orientativas y la dueña puede ajustar el tiempo
   de cada reserva. En coloración/moldeado el presupuesto se cierra tras diagnóstico. */
export const services: Service[] = [
  {
    slug: "metodo-alma-rizo",
    name: "Método Alma Rizo",
    tagline: "Servicio completo curly",
    description:
      "Servicio completo para entender y transformar tu rizo: corte, tratamiento profundo, definición profesional y asesoramiento personalizado. Duración orientativa 90-120 min.",
    durationMin: 120,
    price: 95,
    featured: true,
    image: "/photos/real-diagnostico.jpg",
  },
  {
    slug: "corte-curly",
    name: "Corte Curly",
    tagline: "Corte de mantenimiento",
    description:
      "Corte adaptado a tu tipo de rizo para mantener forma, movimiento y equilibrio. Duración orientativa 40-60 min.",
    durationMin: 60,
    price: 60,
    featured: true,
    image: "/photos/real-definicion.jpg",
  },
  {
    slug: "ritual-alma-rizo",
    name: "Ritual Alma Rizo",
    tagline: "Tratamiento y definición",
    description:
      "Tratamiento profundo y definición rizo a rizo para recuperar hidratación, controlar el encrespamiento y potenciar la forma natural del rizo. Duración orientativa 60-75 min.",
    durationMin: 75,
    price: 60,
    featured: true,
    image: "/photos/real-proteina.jpg",
  },
  {
    slug: "curly-hombre",
    name: "Curly Hombre",
    tagline: "Rizo masculino · 35-45€",
    description:
      "Corte adaptado al rizo masculino para mantener forma, definición y facilidad en el día a día. Duración orientativa 30-40 min.",
    durationMin: 40,
    price: 45,
    image: "/photos/real-elasticidad.jpg",
  },
  {
    slug: "metodo-alma-rizo-kids",
    name: "Método Alma Rizo Kids",
    tagline: "Para los más peques",
    description:
      "Experiencia adaptada para que aprendan a cuidar y definir su rizo respetando su textura natural. Incluye corte, lavado y definición de rizos. Duración orientativa 50-70 min.",
    durationMin: 70,
    price: 70,
    image: "/photos/real-portrait.jpg",
  },
  {
    slug: "iluminacion-curlyage",
    name: "Iluminación CurlyAge",
    tagline: "Coloración curly · desde 100€",
    description:
      "Técnica de coloración diseñada específicamente para cabello rizado: aporta luz, dimensión y movimiento sin comprometer la salud de la fibra, respetando tu patrón de rizo. El presupuesto se define tras un diagnóstico personalizado.",
    durationMin: 210,
    price: 100,
    image: "/photos/real-despues-rizo.jpg",
  },
  {
    slug: "moldeado-inteligente",
    name: "Moldeado Inteligente",
    tagline: "Transformación permanente · desde 100€",
    description:
      "Transformación permanente que adapta la técnica a tu cabello para crear ondas suaves, rizos con nervio o afro, con más volumen y una definición duradera. Fórmulas orgánicas y sin amoníaco. Presupuesto tras diagnóstico.",
    durationMin: 180,
    price: 100,
    image: "/photos/real-salon.jpg",
  },
];

/* Rituales · SPA Capilar (tratamientos, se pueden añadir a un servicio). Cada
   uno tiene niveles según intensidad/duración. Info real de la carta de rituales. */
export const rituals: { name: string; vegan?: boolean; description: string; ideal: string; tiers: { label: string; time: string; price: string }[] }[] = [
  {
    name: "Nutrición Ricca",
    description: "Devuelve el equilibrio nutricional al cabello seco o deshidratado; rehidrata medios y puntas y aporta brillo natural.",
    ideal: "Cabello seco, deshidratado, teñido o apagado.",
    tiers: [
      { label: "Express", time: "10-15 min", price: "18€" },
      { label: "Sublime", time: "20-25 min", price: "35€" },
      { label: "Premium", time: "35-40 min", price: "45€" },
    ],
  },
  {
    name: "Disciplina · Antifrizz",
    description: "Domina y suaviza la fibra para controlar el frizz, reducir el encrespamiento y proteger de la humedad.",
    ideal: "Cabello encrespado, poroso, grueso o rebelde; clima húmedo.",
    tiers: [
      { label: "Express", time: "10-15 min", price: "18€" },
      { label: "Sublime", time: "20-25 min", price: "35€" },
      { label: "Premium", time: "35-40 min", price: "45€" },
    ],
  },
  {
    name: "Protein Therapy",
    description: "Reconstruye y refuerza la fibra capilar desde el interior, mejorando resistencia y aportando cuerpo.",
    ideal: "Cabello decolorado, dañado por calor, quebradizo o debilitado.",
    tiers: [
      { label: "Express", time: "10-15 min", price: "18€" },
      { label: "Sublime", time: "20-25 min", price: "35€" },
      { label: "Premium", time: "35-45 min", price: "45€" },
    ],
  },
  {
    name: "Volufill · Bótox voluminizador",
    vegan: true,
    description: "Regenera la fibra y mejora su cohesión: rellena zonas debilitadas, compacta la cutícula y aporta densidad y brillo. 100% vegano.",
    ideal: "Cabello muy dañado, envejecido, muy poroso o tratado químicamente.",
    tiers: [
      { label: "Express", time: "10-15 min", price: "18€" },
      { label: "Premium", time: "35-40 min", price: "45€" },
    ],
  },
  {
    name: "Illaminaction · Efecto espejo",
    description: "Ritual de laminado que sella la cutícula y equilibra el pH, dejando la fibra más compacta, brillante y protegida. Brillo espejo.",
    ideal: "Cabello teñido, apagado, poroso, encrespado o tras decoloración.",
    tiers: [{ label: "Ritual", time: "30-35 min", price: "45€" }],
  },
  {
    name: "Exfoliación Capilar",
    description: "Limpieza profunda del cuero cabelludo: elimina células muertas e impurezas y desobstruye los poros, evitando exceso de grasa y caspa.",
    ideal: "Mantenimiento de un cuero cabelludo sano.",
    tiers: [{ label: "Ritual", time: "15 min", price: "10€" }],
  },
];

export type Review = {
  name: string;
  rating: number; // mostramos solo >= 4.5
  text: string;
  source?: string;
};

/* ⚠️ PLACEHOLDER — reseñas de ejemplo. Sustituir por reseñas reales de Google.
   Solo se muestran las de 4.5★ o más (requisito de la dueña). */
export const reviews: Review[] = [
  {
    name: "Laura M.",
    rating: 5,
    text: "Por fin alguien que entiende mi rizo. Salí del salón sabiendo cómo cuidarlo en casa. El cambio ha sido brutal.",
    source: "Google",
  },
  {
    name: "Cristina R.",
    rating: 5,
    text: "El Método Alma Rizo me cambió la melena por completo. Maricruz es pura vocación y profesionalidad.",
    source: "Google",
  },
  {
    name: "Núria P.",
    rating: 5,
    text: "Llevaba años sin saber qué hacer con mis rizos. El diagnóstico fue clarísimo y los resultados duran semanas.",
    source: "Google",
  },
  {
    name: "Marta S.",
    rating: 4.5,
    text: "Trato cercano y un corte en seco impecable. Se nota que están especializadas de verdad en cabello rizado.",
    source: "Google",
  },
  {
    name: "Elena G.",
    rating: 5,
    text: "Un espacio precioso y un equipo que te enseña a quererte el pelo. 100% recomendable en Tarragona.",
    source: "Google",
  },
  {
    name: "Aitana V.",
    rating: 4.5,
    text: "Mis rizos nunca habían estado tan definidos y sanos. Repetiré seguro con el ritual de hidratación.",
    source: "Google",
  },
];

/* Resultados / galería — fotos reales del salón. */
export const gallery: { src: string; alt: string; real?: boolean }[] = [
  { src: "/photos/curly-portrait-color.jpg", alt: "Rizo definido, resultado Alma Rizo", real: true },
  { src: "/photos/curly-color-bride.jpg", alt: "Definición y luz en el rizo", real: true },
  { src: "/photos/curly-editorial-1.jpg", alt: "Melena rizada, editorial", real: true },
  { src: "/photos/curly-back.jpg", alt: "Definición del rizo", real: true },
  { src: "/photos/curly-editorial-2.jpg", alt: "Rizo natural definido", real: true },
  { src: "/photos/curly-hombre.jpg", alt: "Corte curly masculino", real: true },
  { src: "/photos/curly-kids.jpg", alt: "Método Alma Rizo Kids", real: true },
  { src: "/photos/curly-silhouette.jpg", alt: "Rizo con movimiento", real: true },
  { src: "/photos/spa-ritual.jpg", alt: "Ritual SPA capilar", real: true },
  { src: "/photos/products-ritual.jpg", alt: "Cuidado del rizo en casa", real: true },
  { src: "/photos/real-salon.jpg", alt: "Nuestro salón en Tarragona", real: true },
];

/* Antes / Después — transformaciones reales del salón. */
export const beforeAfter: { before: string; after: string; label: string }[] = [
  {
    before: "/photos/real-antes-rizo.jpg",
    after: "/photos/real-despues-rizo.jpg",
    label: "Corte, color y definición del rizo",
  },
  {
    before: "/photos/real-salon.jpg",
    after: "/photos/real-portrait.jpg",
    label: "Definición de rizo afro",
  },
];

export const nav = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/servicios" },
  { label: "Transformaciones", href: "/galeria" },
  { label: "Productos", href: "/productos" },
  { label: "Sobre mí", href: "/sobre-mi" },
  { label: "Contacto", href: "/contacto" },
];

export type Product = {
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  active: boolean;
};

/* Productos de la boutique. ⚠️ Fotos e info de ejemplo — se venden por Instagram/WhatsApp. */
export const products: Product[] = [
  {
    slug: "champu-hidratante",
    name: "Champú hidratante sin sulfatos",
    description: "Limpieza suave que respeta el rizo y no reseca. Ideal para el día a día.",
    price: 18,
    image: "/products/champu.jpg",
    active: true,
  },
  {
    slug: "acondicionador",
    name: "Acondicionador de definición",
    description: "Desenreda, nutre y prepara el rizo para una definición duradera.",
    price: 20,
    image: "/products/acondicionador.jpg",
    active: true,
  },
  {
    slug: "crema-definicion",
    name: "Crema de definición",
    description: "Define y controla el encrespamiento sin apelmazar, con un acabado natural.",
    price: 22,
    image: "/products/crema.jpg",
    active: true,
  },
  {
    slug: "mascarilla",
    name: "Mascarilla de hidratación profunda",
    description: "Tratamiento intensivo semanal que repara y devuelve elasticidad al rizo.",
    price: 25,
    image: "/products/mascarilla.jpg",
    active: true,
  },
];

export type News = { title: string; text: string; tag: string };

/* Novedades / promociones para el carrusel de portada. ⚠️ Contenido de ejemplo editable. */
export const news: News[] = [
  {
    tag: "Promoción",
    title: "20% en tu primera visita",
    text: "Reserva tu diagnóstico + corte curly este mes y llévate un 20% de descuento.",
  },
  {
    tag: "Nuevo producto",
    title: "Nueva crema de definición",
    text: "Ya disponible en el salón nuestra crema de definición para rizos más marcados y duraderos.",
  },
  {
    tag: "Agenda",
    title: "Nuevas horas disponibles",
    text: "Hemos ampliado la agenda de jueves y viernes. ¡Reserva la tuya!",
  },
];

/* Datos legales. ⚠️ PLACEHOLDER — pedir razón social, NIF y email legal reales. */
export const legal = {
  ownerName: "Mari Cruz [Apellidos]", // ⚠️ nombre completo de la titular
  nif: "00000000X", // ⚠️ NIF/DNI de la autónoma o CIF de la sociedad
  tradeName: "Alma Rizo · Curly Studio",
  activity: "Servicios de peluquería especializada en cabello rizado",
  addressFull: "Carrer de Bonaventura Hernández i Sanahuja, 19, 43002 Tarragona",
  email: "hola@almarizo.com", // ⚠️ correo legal real
};

export type Faq = { q: string; a: string };
export const faq: Faq[] = [
  {
    q: "¿Qué es el método curly?",
    a: "Es una forma de trabajar el cabello rizado que respeta su forma natural: corte en seco rizo a rizo, productos sin sulfatos ni siliconas y una rutina pensada para definir e hidratar. El objetivo es que tu rizo se vea sano y definido, no domarlo.",
  },
  {
    q: "¿Cómo vengo a mi primera cita?",
    a: "Ven con el pelo limpio (lavado el día antes), seco y suelto —sin recoger ni planchar— para poder ver tu rizo natural y hacer un buen diagnóstico. Si tienes dudas, te enviamos un vídeo con las indicaciones al reservar.",
  },
  {
    q: "¿Cuánto dura una cita?",
    a: "Depende del servicio: un corte curly ronda 1h15, y el Método Alma Rizo completo (diagnóstico + corte + definición) unas 2h. Verás la duración estimada de cada servicio al reservar.",
  },
  {
    q: "¿El corte en seco es para mí?",
    a: "Si tienes el pelo rizado u ondulado, sí. Cortar en seco nos permite ver cómo cae cada rizo y darle forma sin sorpresas al secar. Es la base de casi todos nuestros servicios.",
  },
  {
    q: "¿Puedo teñirme el cabello rizado?",
    a: "Sí, siempre cuidando la salud del rizo. En tu cita valoramos el estado de tu cabello y te asesoramos sobre color y tratamientos para no dañar la fibra ni perder definición.",
  },
  {
    q: "¿Cómo mantengo el resultado en casa?",
    a: "Te enseñamos tu rutina paso a paso y te recomendamos los productos adecuados para tu tipo de rizo. Esa es justo nuestra filosofía: que sepas cuidarlo tú misma día a día.",
  },
  {
    q: "¿Cómo reservo o cancelo una cita?",
    a: "Puedes reservar online desde el botón «Reservar» en pocos pasos. Para cambios o cancelaciones, escríbenos por WhatsApp o llámanos con antelación y te reubicamos sin problema.",
  },
];

export type Consejo = { slug: string; title: string; excerpt: string; body: string[]; image: string };
export const consejos: Consejo[] = [
  {
    slug: "lavar-el-rizo",
    title: "Cómo lavar tu rizo sin estropearlo",
    excerpt: "Menos es más: la técnica correcta para limpiar sin resecar ni encrespar.",
    image: "/photos/real-elasticidad.jpg",
    body: [
      "Usa un champú sin sulfatos y masajea solo el cuero cabelludo con las yemas, no las puntas.",
      "Aclara con agua tibia (no caliente) y aplica acondicionador de medios a puntas, desenredando con los dedos o un peine de púas anchas.",
      "No frotes con la toalla: presiona con una camiseta de algodón o una toalla de microfibra para no romper la definición.",
    ],
  },
  {
    slug: "secar-plopping",
    title: "El secado que define: la técnica plopping",
    excerpt: "Cómo secar sin frizz y potenciando la forma natural del rizo.",
    image: "/photos/real-definicion.jpg",
    body: [
      "Aplica tu producto de definición con el pelo empapado, de abajo hacia arriba, sin tocar el pelo mientras se seca al aire.",
      "Para el plopping, envuelve el cabello en una camiseta de algodón durante 15–20 minutos para absorber el exceso de agua sin aplastar el rizo.",
      "Si usas difusor, hazlo a baja temperatura y sin mover el pelo para no generar encrespamiento.",
    ],
  },
  {
    slug: "corte-en-seco",
    title: "Por qué el corte en seco cambia tu rizo",
    excerpt: "Cortar rizo a rizo, en seco, es la diferencia entre un pelo bonito y uno que cae solo.",
    image: "/photos/real-diagnostico.jpg",
    body: [
      "Cada rizo se comporta distinto: en seco vemos cómo cae realmente y evitamos cortar de más.",
      "Permite equilibrar el volumen y dar forma respetando el patrón natural de tu cabello.",
      "El resultado se ve desde el primer día y es más fácil de mantener en casa.",
    ],
  },
];

export type MetodoStep = { n: string; title: string; text: string };
export const metodoSteps: MetodoStep[] = [
  { n: "01", title: "Diagnóstico y asesoramiento", text: "Analizamos tu tipo de rizo, su estado y tus necesidades, y te asesoramos de forma personalizada." },
  { n: "02", title: "Corte", text: "Corte adaptado a tu tipo de rizo para mantener forma, movimiento y equilibrio." },
  { n: "03", title: "Tratamiento profundo", text: "Tratamiento profundo para recuperar hidratación y salud, controlando el encrespamiento." },
  { n: "04", title: "Definición profesional", text: "Definición rizo a rizo para potenciar la forma natural de tu rizo." },
  { n: "05", title: "Asesoramiento para casa", text: "Te enseñamos a cuidar y definir tu rizo en casa para que mantengas el resultado." },
];
