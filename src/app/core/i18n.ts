export type Lang = 'fr' | 'ar' | 'en';

export const LANGS: Array<{ id: Lang; label: string; short: string }> = [
  { id: 'fr', label: 'Français', short: 'FR' },
  { id: 'ar', label: 'العربية', short: 'AR' },
  { id: 'en', label: 'English', short: 'EN' },
];

type Dict = Record<string, string>;
export const STRINGS: Record<Lang, Dict> = {
  fr: {
    tagline: 'radar ministres • décrets • offres',
    home: 'Accueil',
    ministers: 'Ministres',
    radar: 'Radar',
    agent: 'Agent IA',
    login: 'Se connecter (Puter)',
    logout: 'Se déconnecter',
    heroEyebrow: 'Algovrad • Radar Algérie • Puter.js',
    heroTitle: 'Tous les ministres algériens + radar décrets & offres',
    heroDescSeed: 'Seed vérifié : Gouvernement',
    heroDescDecret: '(décret 25-241 du 14/09/2025) + Conseil des ministres du 21/09/2026.',
    heroDescLive: 'L’agent Puter AI recoupe en live',
    viewMinisters: 'Voir les',
    ministersWord: 'ministres',
    openRadar: 'Ouvrir le radar',
    askAgent: 'Interroger l’agent IA',
    lastCheckMinisters: 'Dernière vérif ministres :',
    radarWord: 'Radar :',
    govCard: 'Gouvernement',
    members: 'membres',
    newWord: 'nouveaux',
    etatWord: 'ministres d’État',
    explore: 'Explorer →',
    radarSignals: 'signaux suivis',
    unread: 'non lus',
    viewDecrees: 'Voir décrets & offres →',
    agentPuter: 'Agent Puter.js',
    agentPuterDesc:
      'puter.ai.chat (deepseek-v4.1-flash) + puter.kv (snapshots) + puter.net.fetch (anti-CORS) + auth User-Pays.',
    testAgent: 'Tester l’agent →',
    sourcesTitle: 'Sources officielles surveillées',
    radarTip:
      'Astuce radar : JORADP = règles/décrets • ANEP = offres/marchés • Présidence/APS = nominations & conseils des ministres.',
    footerSeed:
      'Algovrad — seed : décret 25-241 (14/09/2025) + CM 21/09/2026. Toujours vérifier sur les sites officiels.',
    govTitle: 'Gouvernement algérien —',
    searchMinistersPh: 'Rechercher nom ou portefeuille… (ex: santé, énergie, Attaf)',
    noResult: 'Aucun résultat. Essayez « énergie », « commerce », « justice ».',
    newBadge: 'NOUVEAU',
    ministrySite: 'Site du ministère →',
    howVerify: 'Comment vérifier ?',
    step1: 'Ouvrez premier-ministre.gov.dz → Composition du Gouvernement.',
    step2: 'Croisez avec APS (dépêche 14/09/2025 + remaniements) et le JORADP décret 25-241.',
    step3:
      'Ensuite cliquez « Revérifier via Puter AI » — l’agent retourne du JSON que l’app fusionne.',
    recheck: 'Revérifier via Puter AI',
    checking: 'Vérification…',
    onlyNew: 'Nouveaux',
    all: 'Tous',
    radarTitle: 'Radar — décrets, règles & offres',
    markRead: 'Tout marquer lu',
    checkNews: 'Vérifier nouveautés (Puter AI)',
    scanning: 'Scan…',
    filterPh: 'Filtrer : protection civile, JORADP, ANEP, hydraulique…',
    noSignal: 'Aucun signal pour ce filtre.',
    newDrop: 'NEW DROP',
    officialSource: 'Source officielle →',
    radarSourcesTitle:
      'Sources radar (à ouvrir / à scraper via puter.net.fetch pour contourner CORS)',
    snapshotsNote:
      'Snapshots persistés en puter.kv (clés algovrad-radar-check, algovrad-ministers) — le diff du prochain scan révèle les « new drops ».',
    agentTitle: 'Agent AlgoVrad (Puter.js AI)',
    agentSubtitle:
      'Modèle : deepseek-v4.1-flash (User-Pays) • Contexte seed JORADP 25-241 + CM 21/09/2026 • Cite toujours les sources officielles.',
    exHealth: 'Ministre Santé ?',
    exCM: 'CM 21/09/2026 ?',
    exOffers: 'Appels d’offres ?',
    exReshuffle: 'Remaniement ?',
    thinking: 'L’agent réfléchit via Puter AI…',
    inputPh: 'Ex : Liste les ministres d’État + sources…',
    send: 'Envoyer',
    injectCtx: 'Injecter le contexte seed vérifié',
    webSearch: 'Recherche web',
    webSearchHint:
      'Interroge le web en direct via Puter AI (outil web_search) au lieu du seul seed.',
    webSearchOn: 'Web ON',
    webSearchOff: 'Web OFF',
    clearConv: 'Effacer la conversation',
    emptyConv: 'Conversation effacée. Posez une question.',
    langLabel: 'Langue',
    appointedOn: 'Nommé le',
    decreeRef: 'Décret',
    publishedOn: 'Publié le',
    formationDate: 'Formation du gouvernement :',
    lastCouncil: 'Dernier Conseil des ministres :',
    updatedOn: 'Mis à jour le',
    govDecreeNote:
      'Tous nommés par décret 25-241 du 14/09/2025 sauf remaniement signalé par le radar.',
    watchLabel: 'Surveiller',
    frequencyLabel: 'Rythme',
    keyPagesLabel: 'Pages clés',
    languagesLabel: 'Langues',
    sourcesCount: 'sources suivies',
    verifiedBadge: 'vérifié Firecrawl',
    opportunities: 'Opportunités',
    opportunitiesHint:
      'Avis qui libèrent ou rouvrent un marché (infructuosité, annulation, prorogation, 2ᵉ avis, mise en demeure).',
    clientLabel: 'Client',
    refLabel: 'Référence',
    opportunityBadge: 'MARCHÉ OUVERT',
    previewEyebrow: 'Aperçu sans quitter l’app',
    previewButton: 'Aperçu',
    previewLoading: 'Chargement de l’aperçu depuis la source officielle…',
    previewFailed: 'Aperçu impossible.',
    previewOpenOriginal: 'Ouvrir la page officielle →',
    previewClose: 'Fermer',
    previewCached: 'copie cache 10 min',
    previewTlsFallback: 'certificat incomplet — source non vérifiée',
    themeLabel: 'Thème',
    themeLight: 'Thème clair',
    themeDark: 'Thème sombre',
    navLabel: 'Navigation principale',
    skipToContent: 'Aller au contenu',
    previewTranslate: 'Traduire',
    previewTranslating: 'Traduction…',
    previewTranslatedLabel: 'Traduction',
  },
  ar: {
    tagline: 'رادار الوزراء • المراسيم • العروض',
    home: 'الرئيسية',
    ministers: 'الوزراء',
    radar: 'الرادار',
    agent: 'الوكيل الذكي',
    login: 'تسجيل الدخول (Puter)',
    logout: 'تسجيل الخروج',
    heroEyebrow: 'ألغوفـراد • رادار الجزائر • Puter.js',
    heroTitle: 'جميع الوزراء الجزائريين + رادار المراسيم والعروض',
    heroDescSeed: 'بيانات موثقة : حكومة',
    heroDescDecret: '(المرسوم 25-241 بتاريخ 14/09/2025) + مجلس الوزراء 21/09/2026.',
    heroDescLive: 'وكيل Puter AI يقاطع مباشرة',
    viewMinisters: 'عرض',
    ministersWord: 'وزيراً',
    openRadar: 'فتح الرادار',
    askAgent: 'اسأل الوكيل الذكي',
    lastCheckMinisters: 'آخر تحقق للوزراء :',
    radarWord: 'الرادار :',
    govCard: 'الحكومة',
    members: 'عضواً',
    newWord: 'جدد',
    etatWord: 'وزراء دولة',
    explore: 'استكشف ←',
    radarSignals: 'إشارة متابعة',
    unread: 'غير مقروءة',
    viewDecrees: 'عرض المراسيم والعروض ←',
    agentPuter: 'وكيل Puter.js',
    agentPuterDesc:
      'puter.ai.chat ‏(deepseek-v4.1-flash) + حفظ puter.kv + جلب puter.net.fetch ‏(تجاوز CORS) + مصادقة User-Pays.',
    testAgent: 'جرّب الوكيل ←',
    sourcesTitle: 'المصادر الرسمية المراقبة',
    radarTip:
      'تلميح : الجريدة الرسمية JORADP = القواعد/المراسيم • ANEP = العروض/الصفقات • الرئاسة/APS = التعيينات ومجالس الوزراء.',
    footerSeed:
      'ألغوفرad — المرجع : المرسوم 25-241 (14/09/2025) + مجلس الوزراء 21/09/2026. تحقق دائماً من المواقع الرسمية.',
    govTitle: 'الحكومة الجزائرية —',
    searchMinistersPh: 'ابحث بالاسم أو الحقيبة… (مثال: الصحة، الطاقة، عطاف)',
    noResult: 'لا نتائج. جرّب « الطاقة »، « التجارة »، « العدل ».',
    newBadge: 'جديد',
    ministrySite: 'موقع الوزارة ←',
    howVerify: 'كيف تتحقق ؟',
    step1: 'افتح premier-ministre.gov.dz ← تشكيلة الحكومة.',
    step2: 'قاطع مع APS (برقية 14/09/2025 + التعديلات) والجريدة الرسمية المرسوم 25-241.',
    step3: 'ثم اضغط « إعادة التحقق عبر Puter AI » — يعيد الوكيل JSON تدمجه التطبيق.',
    recheck: 'إعادة التحقق عبر Puter AI',
    checking: 'جارٍ التحقق…',
    onlyNew: 'الجدد',
    all: 'الكل',
    radarTitle: 'الرادار — المراسيم والقواعد والعروض',
    markRead: 'تعليم الكل كمقروء',
    checkNews: 'تحقق من الجديد (Puter AI)',
    scanning: 'جارٍ المسح…',
    filterPh: 'صفِّ : الحماية المدنية، JORADP، ANEP، الري…',
    noSignal: 'لا إشارات لهذا التصفية.',
    newDrop: 'جديد',
    officialSource: 'المصدر الرسمي ←',
    radarSourcesTitle: 'مصادر الرادار (للفتح / للكشط عبر puter.net.fetch لتجاوز CORS)',
    snapshotsNote:
      'لقطات محفوظة في puter.kv (algovrad-radar-check، algovrad-ministers) — فرق المسح التالي يكشف الجديد.',
    agentTitle: 'وكيل AlgoVrad ‏(Puter.js AI)',
    agentSubtitle:
      'النموذج : deepseek-v4.1-flash ‏(User-Pays) • السياق JORADP 25-241 + مجلس 21/09/2026 • يذكر المصادر الرسمية دائماً.',
    exHealth: 'وزير الصحة ؟',
    exCM: 'مجلس 21/09/2026 ؟',
    exOffers: 'المناقصات ؟',
    exReshuffle: 'تعديل حكومي ؟',
    thinking: 'الوكيل يفكر عبر Puter AI…',
    inputPh: 'مثال : اعرض وزراء الدولة + المصادر…',
    send: 'إرسال',
    injectCtx: 'حقن السياق الموثق',
    webSearch: 'البحث على الويب',
    webSearchHint:
      'استعلام الويب مباشرة عبر Puter AI (أداة web_search) بدل الاكتفاء بالبيانات الأولية.',
    webSearchOn: 'الويب مُفعّل',
    webSearchOff: 'الويب مُعطّل',
    clearConv: 'مسح المحادثة',
    emptyConv: 'تم مسح المحادثة. اطرح سؤالاً.',
    langLabel: 'اللغة',
    appointedOn: 'عُيّن في',
    decreeRef: 'المرسوم',
    publishedOn: 'نُشر في',
    formationDate: 'تشكيل الحكومة :',
    lastCouncil: 'آخر مجلس وزراء :',
    updatedOn: 'حُدّث في',
    govDecreeNote: 'عُيّن الجميع بالمرسوم 25-241 بتاريخ 14/09/2025 ما لم يشر الرادار لتعديل.',
    watchLabel: 'راقب',
    frequencyLabel: 'الوتيرة',
    keyPagesLabel: 'صفحات أساسية',
    languagesLabel: 'اللغات',
    sourcesCount: 'مصدراً متابعاً',
    verifiedBadge: 'تم التحقق عبر Firecrawl',
    opportunities: 'الفرص',
    opportunitiesHint:
      'إعلانات تحرر الصفقة أو تعيد فتحها (عدم الجدوى، إلغاء، تمديد الأجل، إعلان ثانٍ، إعذار).',
    clientLabel: 'العميل',
    refLabel: 'المرجع',
    opportunityBadge: 'صفقة مفتوحة',
    previewEyebrow: 'معاينة دون مغادرة التطبيق',
    previewButton: 'معاينة',
    previewLoading: 'جارٍ تحميل المعاينة من المصدر الرسمي…',
    previewFailed: 'تعذرت المعاينة.',
    previewOpenOriginal: 'افتح الصفحة الرسمية ←',
    previewClose: 'إغلاق',
    previewCached: 'نسخة مخزنة 10 دقائق',
    previewTlsFallback: 'شهادة غير مكتملة — مصدر غير موثق',
    themeLabel: 'المظهر',
    themeLight: 'مظهر فاتح',
    themeDark: 'مظهر داكن',
    navLabel: 'التنقل الرئيسي',
    skipToContent: 'الانتقال إلى المحتوى',
    previewTranslate: 'ترجمة',
    previewTranslating: 'جارٍ الترجمة…',
    previewTranslatedLabel: 'الترجمة',
  },
  en: {
    tagline: 'ministers radar • decrees • tenders',
    home: 'Home',
    ministers: 'Ministers',
    radar: 'Radar',
    agent: 'AI Agent',
    login: 'Sign in (Puter)',
    logout: 'Sign out',
    heroEyebrow: 'AlgoVrad • Algeria Radar • Puter.js',
    heroTitle: 'All Algerian ministers + decrees & tenders radar',
    heroDescSeed: 'Verified seed: Government',
    heroDescDecret: '(decree 25-241 of 09/14/2025) + Council of Ministers 09/21/2026.',
    heroDescLive: 'Puter AI agent cross-checks live',
    viewMinisters: 'View',
    ministersWord: 'ministers',
    openRadar: 'Open radar',
    askAgent: 'Ask the AI agent',
    lastCheckMinisters: 'Last ministers check:',
    radarWord: 'Radar:',
    govCard: 'Government',
    members: 'members',
    newWord: 'new',
    etatWord: 'Ministers of State',
    explore: 'Explore →',
    radarSignals: 'tracked signals',
    unread: 'unread',
    viewDecrees: 'View decrees & tenders →',
    agentPuter: 'Puter.js Agent',
    agentPuterDesc:
      'puter.ai.chat (deepseek-v4.1-flash) + puter.kv (snapshots) + puter.net.fetch (CORS bypass) + User-Pays auth.',
    testAgent: 'Try the agent →',
    sourcesTitle: 'Monitored official sources',
    radarTip:
      'Radar tip: JORADP = rules/decrees • ANEP = tenders/markets • Presidency/APS = appointments & councils.',
    footerSeed:
      'AlgoVrad — seed: decree 25-241 (09/14/2025) + CM 09/21/2026. Always verify on official sites.',
    govTitle: 'Algerian Government —',
    searchMinistersPh: 'Search name or portfolio… (e.g. health, energy, Attaf)',
    noResult: 'No results. Try “energy”, “trade”, “justice”.',
    newBadge: 'NEW',
    ministrySite: 'Ministry website →',
    howVerify: 'How to verify?',
    step1: 'Open premier-ministre.gov.dz → Government composition.',
    step2: 'Cross-check with APS (09/14/2025 dispatch + reshuffles) and JORADP decree 25-241.',
    step3: 'Then click “Recheck via Puter AI” — the agent returns JSON merged by the app.',
    recheck: 'Recheck via Puter AI',
    checking: 'Checking…',
    onlyNew: 'New only',
    all: 'All',
    radarTitle: 'Radar — decrees, rules & tenders',
    markRead: 'Mark all read',
    checkNews: 'Check for updates (Puter AI)',
    scanning: 'Scanning…',
    filterPh: 'Filter: civil protection, JORADP, ANEP, hydraulics…',
    noSignal: 'No signals for this filter.',
    newDrop: 'NEW DROP',
    officialSource: 'Official source →',
    radarSourcesTitle: 'Radar sources (open / scrape via puter.net.fetch to bypass CORS)',
    snapshotsNote:
      'Snapshots persisted in puter.kv (keys algovrad-radar-check, algovrad-ministers) — next scan diff reveals new drops.',
    agentTitle: 'AlgoVrad Agent (Puter.js AI)',
    agentSubtitle:
      'Model: deepseek-v4.1-flash (User-Pays) • Seed context JORADP 25-241 + CM 09/21/2026 • Always cites official sources.',
    exHealth: 'Health minister?',
    exCM: 'CM 09/21/2026?',
    exOffers: 'Tenders?',
    exReshuffle: 'Reshuffle?',
    thinking: 'Agent thinking via Puter AI…',
    inputPh: 'E.g.: List Ministers of State + sources…',
    send: 'Send',
    injectCtx: 'Inject verified seed context',
    webSearch: 'Web search',
    webSearchHint:
      'Queries the live web via Puter AI (OpenAI web_search) instead of relying on the seed alone.',
    webSearchOn: 'Web ON',
    webSearchOff: 'Web OFF',
    clearConv: 'Clear conversation',
    emptyConv: 'Conversation cleared. Ask a question.',
    langLabel: 'Language',
    appointedOn: 'Appointed',
    decreeRef: 'Decree',
    publishedOn: 'Published',
    formationDate: 'Government formed:',
    lastCouncil: 'Last Council of Ministers:',
    updatedOn: 'Updated',
    govDecreeNote:
      'All appointed by decree 25-241 of 09/14/2025 unless a reshuffle is flagged by radar.',
    watchLabel: 'Watch',
    frequencyLabel: 'Rhythm',
    keyPagesLabel: 'Key pages',
    languagesLabel: 'Languages',
    sourcesCount: 'tracked sources',
    verifiedBadge: 'Firecrawl-verified',
    opportunities: 'Opportunities',
    opportunitiesHint:
      'Notices that release or re-open a contract (failed tender, cancellation, deadline extension, second notice, formal notice).',
    clientLabel: 'Client',
    refLabel: 'Reference',
    opportunityBadge: 'CONTRACT OPEN',
    previewEyebrow: 'Preview without leaving the app',
    previewButton: 'Preview',
    previewLoading: 'Loading preview from the official source…',
    previewFailed: 'Preview unavailable.',
    previewOpenOriginal: 'Open official page →',
    previewClose: 'Close',
    previewCached: '10-min cached copy',
    previewTlsFallback: 'incomplete certificate — unverified source',
    themeLabel: 'Theme',
    themeLight: 'Light theme',
    themeDark: 'Dark theme',
    navLabel: 'Main navigation',
    skipToContent: 'Skip to content',
    previewTranslate: 'Translate',
    previewTranslating: 'Translating…',
    previewTranslatedLabel: 'Translation',
  },
};

// Minister roles translated (concise official-style). Key = Minister.id from government-data.ts
export const MINISTER_ROLE_I18N: Record<string, { ar: string; en: string }> = {
  pm: { ar: 'الوزير الأول', en: 'Prime Minister' },
  attaf: {
    ar: 'وزير دولة، وزير الشؤون الخارجية والجالية الوطنية بالخارج والشؤون الإفريقية',
    en: 'Minister of State, Foreign Affairs, Diaspora and African Affairs',
  },
  chanegriha: {
    ar: 'وزير منتدب لدى وزير الدفاع الوطني، رئيس أركان الجيش الوطني الشعبي',
    en: 'Delegate Minister to the Minister of National Defence, Army Chief of Staff',
  },
  arkab: {
    ar: 'وزير دولة، وزير المحروقات والمناجم',
    en: 'Minister of State, Hydrocarbons and Mines',
  },
  merad: {
    ar: 'وزير دولة مكلف بالمفتشية العامة لمصالح الدولة والجماعات المحلية',
    en: 'Minister of State, General Inspection of State and Local Authorities',
  },
  sayoud: {
    ar: 'وزير الداخلية والجماعات المحلية والنقل',
    en: 'Minister of Interior, Local Authorities and Transport',
  },
  boudjemaa: { ar: 'وزير العدل، حافظ الأختام', en: 'Minister of Justice, Keeper of the Seals' },
  bouzred: { ar: 'وزير المالية', en: 'Minister of Finance' },
  baddari: {
    ar: 'وزير التعليم العالي والبحث العلمي',
    en: 'Minister of Higher Education and Scientific Research',
  },
  saadaoui: { ar: 'وزير التربية الوطنية', en: 'Minister of National Education' },
  aitmessaoudene: { ar: 'وزير الصحة', en: 'Minister of Health' },
  tacherift: { ar: 'وزير المجاهدين وذوي الحقوق', en: 'Minister of Mujahideen and Rights Holders' },
  bachir: { ar: 'وزير الصناعة', en: 'Minister of Industry' },
  kouidri: { ar: 'وزير الصناعة الصيدلانية', en: 'Minister of Pharmaceutical Industry' },
  oualid: {
    ar: 'وزير الفلاحة والتنمية الريفية والصيد البحري',
    en: 'Minister of Agriculture, Rural Development and Fisheries',
  },
  adjal: { ar: 'وزير الطاقة والطاقات المتجددة', en: 'Minister of Energy and Renewable Energies' },
  rezig: {
    ar: 'وزير التجارة الخارجية وترقية الصادرات',
    en: 'Minister of Foreign Trade and Export Promotion',
  },
  abdelatif: {
    ar: 'وزيرة التجارة الداخلية وضبط السوق الوطنية',
    en: 'Minister of Domestic Trade and Market Regulation',
  },
  belaribi: {
    ar: 'وزير السكن والعمران والمدينة وتهيئة الإقليم',
    en: 'Minister of Housing, Urban Planning and Territorial Development',
  },
  belmehdi: { ar: 'وزير الشؤون الدينية والأوقاف', en: 'Minister of Religious Affairs and Wakfs' },
  bendouda: { ar: 'وزيرة الثقافة والفنون', en: 'Minister of Culture and Arts' },
  hidaoui: {
    ar: 'وزير الشباب المكلف بالمجلس الأعلى للشباب',
    en: 'Minister of Youth, in charge of the Higher Youth Council',
  },
  zerrouki: {
    ar: 'وزير البريد والمواصلات السلكية واللاسلكية',
    en: 'Minister of Post and Telecommunications',
  },
  ouadah: {
    ar: 'وزير اقتصاد المعرفة والمؤسسات الناشئة والمصغرة',
    en: 'Minister of Knowledge Economy, Startups and Micro-enterprises',
  },
  bouamama: { ar: 'وزير الاتصال', en: 'Minister of Communication' },
  arhab: {
    ar: 'وزيرة التكوين والتعليم المهنيين',
    en: 'Minister of Vocational Training and Education',
  },
  djellaoui: {
    ar: 'وزير الأشغال العمومية والمنشآت القاعدية',
    en: 'Minister of Public Works and Basic Infrastructure',
  },
  derbal: { ar: 'وزير الري', en: 'Minister of Hydraulics' },
  saihi: {
    ar: 'وزير العمل والتشغيل والضمان الاجتماعي',
    en: 'Minister of Labour, Employment and Social Security',
  },
  meddahi: { ar: 'وزيرة السياحة والصناعة التقليدية', en: 'Minister of Tourism and Crafts' },
  mouloudji: {
    ar: 'وزيرة التضامن الوطني والأسرة وقضايا المرأة',
    en: 'Minister of National Solidarity, Family and Women',
  },
  krikou: { ar: 'وزيرة البيئة وجودة الحياة', en: 'Minister of Environment and Quality of Life' },
  sadi: { ar: 'وزير الرياضة', en: 'Minister of Sports' },
  djilali: { ar: 'وزيرة العلاقات مع البرلمان', en: 'Minister of Relations with Parliament' },
  rabhi: { ar: 'وزير، والي ولاية الجزائر', en: 'Minister, Wali of Algiers' },
  chaib: {
    ar: 'كاتب دولة مكلف بالجالية الوطنية بالخارج',
    en: 'Secretary of State for the Diaspora',
  },
  mansouri: {
    ar: 'كاتبة دولة مكلفة بالشؤون الإفريقية',
    en: 'Secretary of State for African Affairs',
  },
  bakir: { ar: 'كاتبة دولة مكلفة بالمناجم', en: 'Secretary of State for Mines' },
};

export const CATEGORY_I18N: Record<string, { ar: string; en: string; fr: string }> = {
  all: { fr: 'Tous', ar: 'الكل', en: 'All' },
  premier: { fr: 'Premier ministre', ar: 'الوزير الأول', en: 'Prime Minister' },
  'ministre-etat': { fr: 'Ministres d’État', ar: 'وزراء الدولة', en: 'Ministers of State' },
  ministre: { fr: 'Ministres', ar: 'الوزراء', en: 'Ministers' },
  'ministre-delegue': { fr: 'Ministre délégué', ar: 'وزير منتدب', en: 'Delegate Minister' },
  'secretaire-etat': { fr: 'Secrétaires d’État', ar: 'كتاب الدولة', en: 'Secretaries of State' },
  wali: { fr: 'Wali-ministre', ar: 'والي-وزير', en: 'Wali-Minister' },
};

export const KIND_I18N: Record<string, { ar: string; en: string; fr: string }> = {
  all: { fr: 'Tout le radar', ar: 'كل الرادار', en: 'All radar' },
  nomination: { fr: 'Nominations', ar: 'تعيينات', en: 'Appointments' },
  decret: { fr: 'Décrets / JORADP', ar: 'مراسيم / الجريدة الرسمية', en: 'Decrees / JORADP' },
  'conseil-ministres': {
    fr: 'Conseil des ministres',
    ar: 'مجلس الوزراء',
    en: 'Council of Ministers',
  },
  communique: { fr: 'Communiqués', ar: 'بيانات', en: 'Communiqués' },
  'appel-offre': { fr: 'Appels d’offres', ar: 'مناقصات', en: 'Tenders' },
  attribution: { fr: 'Attributions provisoires', ar: 'المنح المؤقتة', en: 'Provisional awards' },
  infructuosite: { fr: 'Infructuosités', ar: 'عدم الجدوى', en: 'Failed tenders' },
  annulation: { fr: 'Annulations', ar: 'الإلغاءات', en: 'Cancellations' },
  'mise-en-demeure': { fr: 'Mises en demeure', ar: 'الإعذارات', en: 'Formal notices' },
  prorogation: { fr: 'Prorogations de délai', ar: 'تمديد الآجال', en: 'Deadline extensions' },
};

export const RADAR_I18N: Record<
  string,
  { arTitle: string; enTitle: string; arSummary: string; enSummary: string }
> = {
  'cm-2026-09-21': {
    arTitle:
      'مجلس الوزراء 21/09/2026 — الحماية المدنية، التشغيل البيني الرقمي، حملة الحصاد 2025-2026',
    enTitle:
      'Council of Ministers 09/21/2026 — Civil Protection, digital interoperability, 2025-2026 harvest',
    arSummary:
      'القانون الأساسي لأعوان الحماية المدنية، تعزيز هيكلي/مادي/بشري، التشغيل البيني الرقمي للدولة، حصيلة الحبوب (قمح صلب/لين) مع نشرة شهرية للفلاحة.',
    enSummary:
      'Civil Protection staff statute, structural/material/human reinforcement, state digital interoperability, cereals review (durum/soft wheat) with monthly Agriculture bulletin.',
  },
  'decret-25-241': {
    arTitle: 'المرسوم الرئاسي رقم 25-241 — تعيين حكومة سيفي غريب (14/09/2025)',
    enTitle:
      'Presidential decree No. 25-241 — Appointment of the Sifi Ghrieb Government (09/14/2025)',
    arSummary:
      'مرجع الجريدة الرسمية للتشكيلة : وزير أول + 3 وزراء دولة + وزير منتدب للدفاع + وزراء + 3 كتاب دولة.',
    enSummary:
      'JORADP composition reference: 1 PM + 3 Ministers of State + 1 Defence delegate minister + ministers + 3 secretaries of state.',
  },
  'radar-anep': {
    arTitle: 'رادار ANEP — رصد المناقصات الوطنية (أشغال، ري، بريد-اتصالات)',
    enTitle: 'ANEP radar — Track national tenders (works, hydraulics, post-telecoms)',
    arSummary:
      'نقطة دخول الرادار : تصفية حسب الولاية والقطاع، تنبيهات بالكلمات المفتاحية، وتصدير. تُنشر الإعلانات المفصلة على anep.com.dz وتُعاد عبر APS.',
    enSummary:
      'Radar entry point: filter by wilaya/sector, keyword alerts, export. Detailed notices on anep.com.dz relayed by APS.',
  },
  /* Live ANEP notices collected 01/10/2026 */
  'anep-2623006693': {
    arTitle:
      'مناقصة وطنية مفتوحة مع اشتراط قدرات دنيا رقم 09/MGX/2026 — أشغال تهيئة وصيانة البنى التحتية لجامعة باجي مختار عنابة في 06 حصص',
    enTitle:
      'Open national tender with minimum-capacity requirements No. 09/MGX/2026 — Works to develop and maintain Badji Mokhtar University Annaba infrastructure, in 06 lots',
    arSummary:
      'ستة حصص: طرق، شبكات، مبانٍ وصيانة البنى التحتية للجامعة. مناقصة أشغال مفتوحة مع اشتراط قدرات تقنية ومالية دنيا.',
    enSummary:
      'Six lots: roads, networks, buildings and infrastructure upkeep for the university. Open works tender with minimum technical and financial capacities.',
  },
  'anep-2625009281': {
    arTitle:
      'إعلان ثانٍ بعد عدم الجدوى رقم 102/MJS/ADL/2026 — إنجاز 500 مسكن بصيغة البيع بالإيجار، القطب الحضري بئر العرش، سطيف',
    enTitle:
      'Second notice after an unsuccessful tender No. 102/MJS/ADL/2026 — 500 rental-sale housing units, Bir El Arch urban pole, Sétif',
    arSummary:
      'إعلان ثانٍ بعد إعلان عدم جدوى الإجراء الأول: إنجاز 500 مسكن بصيغة البيع بالإيجار، جميع الهياكل، محلات تجارية ومساكن البوابين، مع أشغال الطرقات، موقع 02 ضمن برنامج 03 شطر 300000.',
    enSummary:
      'Second call after the first procedure was declared unsuccessful: 500 rental-sale units, all works packages, shops and caretaker housing, roads included, site 02 of programme 03 tranche 300000.',
  },
  'anep-2630006345': {
    arTitle: 'مناقصة وطنية مفتوحة مع اشتراط قدرات دنيا — مديرية التكوين والتعليم المهني بعين قزام',
    enTitle:
      'Open national tender with minimum-capacity requirements — Vocational Training Directorate, In Guezzam',
    arSummary:
      'إعلان مناقصة وطنية مفتوحة مع اشتراط قدرات دنيا من طرف مديرية التكوين والتعليم المهني بعين قزام (ولاية تمنراست).',
    enSummary:
      'Open national tender with minimum-capacity requirements issued by the Vocational Training Directorate of In Guezzam (Tamanrasset wilaya).',
  },
  'anep-2630006323': {
    arTitle: 'مناقصة وطنية مفتوحة مع اشتراط قدرات دنيا — بلدية ورقلة',
    enTitle: 'Open national tender with minimum-capacity requirements — Ouargla municipality',
    arSummary: 'إعلان مناقصة وطنية مفتوحة مع اشتراط قدرات دنيا لبلدية ورقلة (ولاية ورقلة).',
    enSummary:
      'Open national tender with minimum-capacity requirements for the municipality of Ouargla (Ouargla wilaya).',
  },
  'anep-2630006322': {
    arTitle: 'مناقصة وطنية مفتوحة مع اشتراط قدرات دنيا — بلدية ورقلة (إعلان ثانٍ)',
    enTitle:
      'Open national tender with minimum-capacity requirements — Ouargla municipality (second notice)',
    arSummary: 'إعلان ثانٍ لمناقصة وطنية مفتوحة مع اشتراط قدرات دنيا لبلدية ورقلة.',
    enSummary:
      'Second notice for an open national tender with minimum-capacity requirements for the municipality of Ouargla.',
  },
  'anep-2631014151': {
    arTitle: 'مناقصة مفتوحة مع اشتراط قدرات دنيا — مديرية الأشغال الجامعية بتلمسان',
    enTitle:
      'Open tender with minimum-capacity requirements — University Works Directorate, Tlemcen',
    arSummary: 'إعلان مناقصة مفتوحة مع اشتراط قدرات دنيا لمديرية الأشغال الجامعية بتلمسان.',
    enSummary:
      'Open tender notice with minimum-capacity requirements for the University Works Directorate of Tlemcen.',
  },
  'anep-2625009273': {
    arTitle: 'إعلان ثانٍ لمناقصة وطنية مفتوحة مع اشتراط قدرات دنيا — AADL المديرية الجهوية سطيف',
    enTitle:
      'Second open national tender with minimum-capacity requirements — AADL Sétif regional directorate',
    arSummary: 'إعلان ثانٍ لمناقصة وطنية مفتوحة مع اشتراط قدرات دنيا للمديرية الجهوية AADL بسطيف.',
    enSummary:
      'Second notice for an open national tender with minimum-capacity requirements from the AADL regional directorate of Sétif.',
  },
  'anep-2623006682': {
    arTitle: 'مناقصة وطنية مفتوحة — مديرية التطهير والتهيئة لولاية قالمة',
    enTitle: 'Open national tender — Water and Sewerage Directorate, Guelma wilaya',
    arSummary:
      'إعلان مناقصة وطنية مفتوحة بدون اشتراط قدرات دنيا من طرف مديرية التطهير والتهيئة بقالمة.',
    enSummary:
      'Open national tender notice without minimum-capacity requirements from the Water and Sewerage Directorate of Guelma.',
  },
  'anep-2616103561': {
    arTitle: 'مناقصة وطنية مفتوحة — CNAS البليدة',
    enTitle: 'Open national tender — CNAS Blida',
    arSummary: 'إعلان مناقصة وطنية مفتوحة من طرف الصندوق الوطني للتخصيصات الاجتماعية بالبليدة.',
    enSummary: 'Open national tender notice from the National Social Allocation Fund of Blida.',
  },
  'anep-2616103560': {
    arTitle: 'إلغاء المنح المؤقت — CNAS البليدة',
    enTitle: 'Cancellation of provisional award — CNAS Blida',
    arSummary: 'ألغت CNAS البليدة منحة مؤقتة: الصفقة تعود متاحة من جديد وإعادة إطلاقها ممكنة.',
    enSummary:
      'CNAS Blida cancelled a provisional award: the contract is released and may be re-launched.',
  },
  'anep-2631014141': {
    arTitle: 'منحة مؤقتة — اقتناء محوّلات كهربائية (ولاية سيدي بلعباس)',
    enTitle: 'Provisional award — Purchase of electrical transformers (Sidi Bel Abbès wilaya)',
    arSummary: 'إعلان عن منح مؤقت: اقتناء محوّلات كهربائية من طرف مديرية الري لولاية سيدي بلعباس.',
    enSummary:
      'Provisional award notice: purchase of electrical transformers by the Water Directorate of Sidi Bel Abbès.',
  },
  'anep-2625009267': {
    arTitle: 'منح مؤقت وعدم جدوى — صيانة المدارس الابتدائية في 08 حصص (باتنة)',
    enTitle: 'Temporary award and unsuccessful tender — Maintenance of 08 primary schools (Batna)',
    arSummary:
      'إعلان بمنح مؤقت مع عدم جدوى صيانة المدارس الابتدائية لبلدية باتنة في 08 حصص: إعادة Launchة مرجحة.',
    enSummary:
      'Notice granting a temporary award while declaring the maintenance of Batna primary schools unsuccessful, in 8 lots: a re-tender is likely.',
  },
  'anep-2631014142': {
    arTitle: 'عدم الجدوى — بلدية المشراة',
    enTitle: 'Unsuccessful tender — El Mehara municipality',
    arSummary: 'إعلان عدم جدوى صادر عن بلدية المشراة: لا عروض مقبولة، إعادة Launchة متوقعة.',
    enSummary:
      'Unsuccessful-tender notice from El Mehara municipality: no admissible bids, a re-tender is expected.',
  },
  'anep-2616103563': {
    arTitle: 'عدم الجدوى — الوكالة الوطنية للمنتجات الصيدلانية (ANPP)',
    enTitle: 'Unsuccessful tender — National Pharmaceutical Products Agency (ANPP)',
    arSummary:
      'إعلان عدم جدوى من ANPP: السوق الفاشل سيُعاد إطلاقه، لمتابعة من موردي القطاع الصيدلاني.',
    enSummary:
      'ANPP unsuccessful-tender notice: the failed contract will be re-launched, worth watching for pharmaceutical suppliers.',
  },
  'anep-2616032559': {
    arTitle: 'تمديد الأجل — Institut Pasteur d’Algérie',
    enTitle: 'Deadline extension — Institut Pasteur of Algeria',
    arSummary: 'إعلان تمديد الأجل: تبقى نافذة إيداع العروض مفتوحة، وهي فرصة فورية.',
    enSummary:
      'Deadline extension notice: the bid-submission window remains open, an immediate opportunity.',
  },
  'anep-2631014185': {
    arTitle: 'إعذار رقم 02 — 06 أقسام بمدرسة سالم مأمون محمد (عين يوسف)',
    enTitle: 'Formal notice No. 02 — 06 classrooms at Saim Mamoun Mohamed school (Aïn Youcef)',
    arSummary:
      'إعذار رقم 02 ضد شركة عيساني سعيد بسبب إنجاز 06 أقسام مع هدم الأقسام القديمة بالاتفاقية رقم 23 بتاريخ 16/09/2025. خطر فسخ الصفقة وإعادة إسناد الحصة.',
    enSummary:
      'Formal notice No. 02 against Aissani Said over 06 classrooms with demolition of the old ones, contract No. 23 of 09/16/2025. Risk of termination and re-award of the lot.',
  },
  'anep-2631014157': {
    arTitle: 'إعذار رقم 01 — 300/20 مسكن عمومي إيجاري (معسكر)',
    enTitle: 'Formal notice No. 01 — 300/20 public rental housing units (Mascara)',
    arSummary:
      'إعذار رقم 01 ضد شركة بلحرش مولاي: مشروع 300/20 مسكن عمومي إيجاري مع أشغال التهيئة والشبكات، السوق رقم 2024/25 بتاريخ 29/09/2024.',
    enSummary:
      'Formal notice No. 01 against Belharch Moulay: 300/20 public rental housing units with external works and networks, contract No. 2024/25 of 09/29/2024.',
  },
  'ao-mhuv-07-2025': {
    arTitle: 'مناقصة رقم 07/M.H.U.V/2025 — توريد وتركيب أثاث المقر الجديد للوزارة (دلي إبراهيم)',
    enTitle:
      'Tender No. 07/M.H.U.V/2025 — Supply and installation of furniture for the new ministry headquarters (Dely Ibrahim)',
    arSummary:
      'مناقصة وطنية مفتوحة مع اشتراط قدرات دنيا أطلقت في 07/07/2025: توريد وتجميع وتركيب أثاث ومعدات المقر الجديد للوزارة بدلي إبراهيم، الجزائر.',
    enSummary:
      'Open national tender with minimum-capacity requirements launched on 07/07/2025: supply, assembly and installation of furniture and equipment for the new ministry headquarters in Dely Ibrahim, Algiers.',
  },
};
