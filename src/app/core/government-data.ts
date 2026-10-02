import { Minister, OfficialSource, RadarItem } from './minister.model';

/**
 * Official-source registry (single source of truth).
 *
 * Every entry is verified against a live fetch/search. Structure:
 *   label/description/watch/frequency are [FR, AR, EN] triples.
 *   keyPages = the deep links the radar should open first.
 *
 * Hosts from `url` + `keyPages` are automatically allowlisted for the
 * in-app preview (see `src/server.ts` PREVIEW_HOSTS), so adding a source
 * here also makes it previewable without touching the server.
 */
type Tri = [fr: string, ar: string, en: string];

interface SourceSeed {
  id: string;
  kind: string;
  url: string;
  languages: string;
  label: Tri;
  description: Tri;
  watch: Tri;
  frequency: Tri;
  keyPages?: string[];
}

const source = (s: SourceSeed): OfficialSource => ({
  id: s.id,
  kind: s.kind,
  url: s.url,
  languages: s.languages,
  label: s.label[0],
  labelAr: s.label[1],
  labelEn: s.label[2],
  description: s.description[0],
  descriptionAr: s.description[1],
  descriptionEn: s.description[2],
  watch: s.watch[0],
  watchAr: s.watch[1],
  watchEn: s.watch[2],
  frequency: s.frequency[0],
  frequencyAr: s.frequency[1],
  frequencyEn: s.frequency[2],
  keyPages: s.keyPages ?? [s.url],
});

export const OFFICIAL_SOURCES: OfficialSource[] = [
  /* ---------------- Government & appointments ---------------- */
  source({
    id: 'pm-composition',
    kind: 'Gouvernement',
    url: 'https://premier-ministre.gov.dz/fr/gouvernement/composition',
    languages: 'FR / AR',
    label: [
      'Services du Premier ministre — Composition du Gouvernement',
      'مصالح الوزير الأول — تشكيلة الحكومة',
      'Prime Minister’s Office — Government composition',
    ],
    description: [
      'Page officielle de référence : photos, noms, portefeuilles. Ex : Sifi Ghrieb (PM), Ahmed Attaf, Mohamed Arkab, Mourad Adjal, Sid Ali Zerrouki, Rabehi (wali Alger).',
      'الصفحة الرسمية المرجعية: الصور والأسماء والحقائب. مثال: سيفي غريب، عطاف، عرقاب، عجال، زروقي، رابحي (والي الجزائر).',
      'Official reference page: photos, names, portfolios. E.g. Sifi Ghrieb (PM), Ahmed Attaf, Mohamed Arkab, Mourad Adjal, Sid Ali Zerrouki, Rabehi (Algiers wali).',
    ],
    watch: [
      'Nominations, remaniements, changements d’intitulés (ex : Hydrocarbures et Mines). Comparer chaque fiche au décret JORADP.',
      'التعيينات والتعديلات وتغيير التسميات (مثال: المحروقات والمناجم). قارن كل بطاقة مع مرسوم الجريدة الرسمية.',
      'Appointments, reshuffles, title changes (e.g. Hydrocarbons and Mines). Match each profile against the JORADP decree.',
    ],
    frequency: [
      'À chaque remaniement (réf : 14/09/2025).',
      'عند كل تعديل حكومي (المرجع: 14/09/2025).',
      'On each reshuffle (ref: 09/14/2025).',
    ],
    keyPages: [
      'https://premier-ministre.gov.dz/fr/gouvernement/composition',
      'https://premier-ministre.gov.dz/',
    ],
  }),
  source({
    id: 'pm-textes',
    kind: 'Programmes',
    url: 'https://premier-ministre.gov.dz/',
    languages: 'FR / AR',
    label: [
      'PM — Plans d’action, lois de finances, rapports officiels',
      'الوزير الأول — برامج العمل وقوانين المالية والتقارير الرسمية',
      'PM — Action plans, finance laws, official reports',
    ],
    description: [
      'Rubriques « Plans d’Actions du Gouvernement », « Lois de Finances », « Lois Fondamentales et Textes Législatifs », « Rapports Officiels », « Les 54 engagements », « Passeport de l’Investisseur ».',
      'أقسام: برامج عمل الحكومة، قوانين المالية، القوانين الأساسية والنصوص التشريعية، التقارير الرسمية، الالتزامات الأربعة والخمسون، جواز المستثمر.',
      'Sections: government action plans, finance laws, fundamental laws and legislative texts, official reports, the 54 commitments, investor passport.',
    ],
    watch: [
      'Suivi des 54 engagements pris devant la Nation et de leurs textes d’application.',
      'متابعة الالتزامات الأربعة والخمسون أمام الأمة ونصوص تطبيقها.',
      'Tracking of the 54 national commitments and their implementing texts.',
    ],
    frequency: ['Trimestrielle / par session.', 'فصلياً أو لكل دورة.', 'Quarterly / per session.'],
  }),
  source({
    id: 'pm-conseils',
    kind: 'Conseils',
    url: 'https://premier-ministre.gov.dz/fr/category/reunions-et-conseils',
    languages: 'FR / AR',
    label: [
      'PM — Réunions et Conseils (communiqués texte intégral)',
      'الوزير الأول — الاجتماعات والمجالس (البيانات الكاملة)',
      'PM — Meetings & Councils (full communiqués)',
    ],
    description: [
      'Communiqués « texte intégral » des réunions gouvernementales (ex : recensement, modernisation sectorielle).',
      'بيانات «النص الكامل» لاجتماعات الحكومة (مثال: الإحصاء، عصرنة القطاعات).',
      'Full-text communiqués of government meetings (e.g. census, sector modernization).',
    ],
    watch: [
      'Ordres du jour, décisions interministérielles, feuilles de route avant Conseil des ministres.',
      'جداول الأعمال والقرارات الوزارية المشتركة وخارطة الطريق قبل مجلس الوزراء.',
      'Agendas, interministerial decisions, roadmaps ahead of the Council of Ministers.',
    ],
    frequency: [
      'Hebdomadaire (réunions gouvernement).',
      'أسبوعي (اجتماعات الحكومة).',
      'Weekly (government meetings).',
    ],
    keyPages: [
      'https://premier-ministre.gov.dz/fr/category/reunions-et-conseils',
      'https://premier-ministre.gov.dz/fr/post/communique-du-conseil-des-ministres-texte-integral-35',
    ],
  }),
  source({
    id: 'presidence',
    kind: 'Présidence',
    url: 'https://www.presidence.dz/',
    languages: 'AR / FR / EN',
    label: [
      'Présidence de la République — Conseil des ministres',
      'رئاسة الجمهورية — مجلس الوزراء',
      'Presidency — Council of Ministers',
    ],
    description: [
      'Présidence Tebboune : ordres du jour et communiqués du Conseil des ministres (ex : CM 21/09/2026 : Protection civile, interopérabilité, moisson).',
      'رئاسة تبون: جداول أعمال وبيانات مجلس الوزراء (مثال: 21/09/2026: الحماية المدنية، التشغيل البيني، الحصاد).',
      'Tebboune presidency: Council of Ministers agendas and releases (e.g. 09/21/2026: Civil Protection, interoperability, harvest).',
    ],
    watch: [
      'Présidence du Conseil, exposés sectoriels, instructions présidentielles.',
      'رئاسة المجلس والعروض القطاعية والتعليمات الرئاسية.',
      'Council chairmanship, sector briefings, presidential instructions.',
    ],
    frequency: [
      'Conseils mensuels ou extraordinaires.',
      'مجالس شهرية أو استثنائية.',
      'Monthly or extraordinary councils.',
    ],
  }),
  source({
    id: 'aps',
    kind: 'Agence officielle',
    url: 'https://www.aps.dz/fr',
    languages: 'FR / AR / EN',
    label: [
      'APS — Algérie Presse Service (fil officiel)',
      'واج — وكالة الأنباء الجزائرية (الشريط الرسمي)',
      'APS — Algeria Press Service (official wire)',
    ],
    description: [
      'Fil national et international, dossiers et reportages. Rubriques : presidence-news, reunion-du-gouvernement. Édition arabe sur aps.dz/.',
      'الشريط الوطني والدولي مع الملفات والروبورتاجات. الأقسام: أخبار الرئاسة، اجتماعات الحكومة. النسخة العربية على aps.dz/.',
      'National and international wire plus dossiers. Sections: presidence-news, reunion-du-gouvernement. Arabic edition at aps.dz/.',
    ],
    watch: [
      'Dépêches de nomination (14/09/2025), comptes rendus de CM, relais des offres ANEP.',
      'برقيات التعيينات (14/09/2025) وتقارير مجلس الوزراء وإعادة نشر العروض.',
      'Appointment dispatches (09/14/2025), Council of Ministers readouts, tender relays.',
    ],
    frequency: [
      'Continue (plusieurs dépêches par jour).',
      'مستمر (عدة برقيات يومياً).',
      'Continuous (several dispatches/day).',
    ],
    keyPages: [
      'https://www.aps.dz/fr',
      'https://www.aps.dz/fr/presidence-news',
      'https://www.aps.dz/fr/tags/reunion-du-gouvernement',
      'https://www.aps.dz/',
    ],
  }),
  source({
    id: 'radio-algerie',
    kind: 'Communiqués',
    url: 'https://news.radioalgerie.dz/',
    languages: 'FR / EN / AR',
    label: [
      'Radio Algérie — Conseil des ministres (texte intégral)',
      'الإذاعة الجزائرية — مجلس الوزراء (النص الكامل)',
      'Radio Algeria — Council of Ministers (full text)',
    ],
    description: [
      'Reprise intégrale des communiqués de CM en FR, EN et AR (ex : CM 21/09/2026 : Protection civile, interopérabilité, moisson 2025-2026).',
      'نقل كامل لبيانات مجلس الوزراء بالفرنسية والإنجليزية والعربية (مثال: 21/09/2026: الحماية المدنية، التشغيل البيني، الحصاد).',
      'Full Council of Ministers releases in FR, EN and AR (e.g. 09/21/2026: Civil Protection, interoperability, 2025-2026 harvest).',
    ],
    watch: [
      'Archiver le texte intégral comme preuve avant publication au JORADP.',
      'أرشفة النص الكامل كدليل قبل النشر في الجريدة الرسمية.',
      'Archive the full text as evidence ahead of JORADP publication.',
    ],
    frequency: [
      'À chaque Conseil des ministres.',
      'عند كل مجلس وزراء.',
      'Each Council of Ministers.',
    ],
    keyPages: ['https://news.radioalgerie.dz/en/node/94808', 'https://news.radioalgerie.dz/'],
  }),

  /* ---------------- Official gazette, laws & regulations ---------------- */
  source({
    id: 'joradp',
    kind: 'Décrets / Lois',
    url: 'https://www.joradp.dz/',
    languages: 'FR / AR',
    label: [
      'JORADP — Journal Officiel (SGG)',
      'الجريدة الرسمية (الأمانة العامة للحكومة)',
      'JORADP — Official Gazette (SGG)',
    ],
    description: [
      'SGG : Constitution, JO en PDF, recherche par thèmes. Derniers numéros vérifiés : N°67 du 16/09/2026, N°66 du 13/09/2026, N°65 du 09/09/2026. Guide d’élaboration des textes (2e éd. août 2024).',
      'الأمانة العامة: الدستور، الجريدة الرسمية PDF، بحث مواضيعي. آخر الأعداد: 67 بتاريخ 16/09/2026، 66 بتاريخ 13/09/2026، 65 بتاريخ 09/09/2026.',
      'SGG: Constitution, official gazette PDFs, topic search. Latest issues seen: No.67 of 09/16/2026, No.66 of 09/13/2026, No.65 of 09/09/2026.',
    ],
    watch: [
      'Décrets présidentiels et exécutifs (ex : 25-241, 26-272, 26-267), lois de finances, arrêtés.',
      'المراسيم الرئاسية والتنفيذية (مثال: 25-241، 26-272، 26-267)، قوانين المالية، القرارات.',
      'Presidential and executive decrees (e.g. 25-241, 26-272, 26-267), finance laws, orders.',
    ],
    frequency: [
      'Plusieurs numéros par semaine.',
      'عدة أعداد أسبوعياً.',
      'Several issues per week.',
    ],
    keyPages: ['https://www.joradp.dz/', 'https://www.joradp.dz/HFR/Index.htm'],
  }),
  source({
    id: 'mip-decrets',
    kind: 'Décrets / Lois',
    url: 'https://www.miph.gov.dz/fr/textes-juridiques/decrets/',
    languages: 'FR / AR',
    label: [
      'Industrie pharmaceutique — Décrets (miroir JORADP en PDF)',
      'الصناعة الصيدلانية — المراسيم (نسخة PDF من الجريدة الرسمية)',
      'Pharmaceutical Industry — Decrees (JORADP mirror as PDF)',
    ],
    description: [
      'Publie le décret 25-241 lui-même en PDF, plus les décrets exécutifs d’organisation (ex : 25-189 du 13/07/2025 sur l’inspection générale, 25-188). Recueil sectorial très utile pour les règles en vigueur.',
      'ينشر المرسوم 25-241 بصيغة PDF، إضافة إلى مراسيم تنظيمية (مثال: 25-189 بتاريخ 13/07/2025 حول المفتشية العامة، و25-188).',
      'Publishes decree 25-241 itself as PDF, plus organizing executive decrees (e.g. 25-189 of 07/13/2025 on general inspection, and 25-188).',
    ],
    watch: [
      'Organisation des ministères, statut des fonctionnaires, agréments, prix des médicaments.',
      'تنظيم الوزارات، ميتل الموظفين، الاعتمادات، أسعار الأدوية.',
      'Ministry organization, staff statutes, approvals, drug prices.',
    ],
    frequency: ['À chaque texte publié.', 'مع كل نص منشور.', 'On each published text.'],
    keyPages: [
      'https://www.miph.gov.dz/fr/textes-juridiques/decrets/',
      'https://www.miph.gov.dz/fr/textes-juridiques/recueil-des-textes-juridique-du-ministere-de-lindustrie-pharmaceutique/',
    ],
  }),
  source({
    id: 'me-reglementation',
    kind: 'Réglementation',
    url: 'https://www.me.gov.dz/fr/reglementation/',
    languages: 'FR / AR',
    label: [
      'Environnement & Qualité de vie — Lois et réglementations',
      'البيئة وجودة الحياة — القوانين والتنظيمات',
      'Environment & Quality of Life — Laws and regulations',
    ],
    description: [
      'Textes législatifs et réglementaires de l’environnement classés par rubriques : littoral, déchets, risques majeurs, espaces, développement durable. Contact : 4 Rue des Canons, Alger.',
      'النصوص التشريعية والتنظيمية للبيئة مصنفة حسب: الساحل، النفايات، الكوارث، المساحات، التنمية المستدامة.',
      'Environmental legislative texts grouped by rubric: littoral, waste, major hazards, land use, sustainable development.',
    ],
    watch: [
      'Réglementation des déchets et du littoral, études d’impact, normes d’émission, programmes d’assainissement.',
      'تنظيم النفايات والساحل، دراسات الأثر، معايير الانبعاثات، برامج الصرف الصحي.',
      'Waste and coastal regulation, impact studies, emission standards, sanitation programmes.',
    ],
    frequency: ['Mensuelle ou par arrêté.', 'شهرياً أو بالقرار.', 'Monthly or per order.'],
  }),
  source({
    id: 'madr-textes',
    kind: 'Réglementation',
    url: 'https://madr.gov.dz/fr/francais/',
    languages: 'FR / AR',
    label: [
      'Agriculture & Pêche — Textes réglementaires et lois',
      'الفلاحة والصيد البحري — النصوص التنظيمية والقوانين',
      'Agriculture & Fisheries — Regulatory texts and laws',
    ],
    description: [
      'Rubriques « Textes Réglementaires », « Lois et ordonnances », « Communication ». Campagnes agricoles, subventions, semences, pêche, services phytosanitaires et vétérinaires.',
      'أقسام: النصوص التنظيمية، القوانين والأوامر، الاتصال. الحملات الفلاحية، الإعانات، البذور، الصيد، الخدمات الصحية النباتية والحيوانية.',
      'Sections: regulatory texts, laws and ordinances, communications. Agricultural campaigns, subsidies, seeds, fisheries, plant and veterinary health.',
    ],
    watch: [
      'Subventions, prix des intrants, règles d’importation, quotas de pêche, sécurité sanitaire.',
      'الإعانات، أسعار المدخلات، قواعد الاستيراد، حصص الصيد، السلامة الصحية.',
      'Subsidies, input prices, import rules, fishing quotas, sanitary safety.',
    ],
    frequency: [
      'Trimestrielle (campagnes agricoles).',
      'فصلياً (الحملات الفلاحية).',
      'Quarterly (agricultural campaigns).',
    ],
    keyPages: [
      'https://madr.gov.dz/fr/francais/',
      'https://fr.madr.gov.dz/',
      'https://psl.madr.gov.dz/',
    ],
  }),
  source({
    id: 'sante-textes',
    kind: 'Réglementation',
    url: 'https://sante.gov.dz/receuils/',
    languages: 'FR / AR',
    label: [
      'Santé — Recueil de textes, notes & instructions',
      'الصحة — مجموعتا النصوص والمذكرات',
      'Health — Text collections, notes & instructions',
    ],
    description: [
      'Arrêtés et textes d’installation en vigueur (ex : conditions d’ouverture d’une officine de pharmacie), notes et instructions. Rubriques Réglementation et Pharmacie.',
      'القرارات ونصوص التثبيت السارية (مثال: شروط فتح صيدلية)، المذكرات والتعليمات. أقسام التنظيم والصيدلة.',
      'Installation orders and texts in force (e.g. pharmacy opening conditions), notes and instructions. Regulation and Pharmacy sections.',
    ],
    watch: [
      'Ouverture et fermeture d’établissements de santé, prix des médicaments, effectifs, campagnes de santé.',
      'فتح وإغلاق المؤسسات الصحية، أسعار الأدوية، التعدادات، الحملات الصحية.',
      'Health-facility opening and closure, drug prices, staffing, health campaigns.',
    ],
    frequency: [
      'Continue (notes et arrêtés).',
      'مستمر (مذكرات وقرارات).',
      'Continuous (notes and orders).',
    ],
    keyPages: [
      'https://sante.gov.dz/receuils/',
      'https://sante.gov.dz/nots/',
      'https://sante.gov.dz/',
    ],
  }),
  source({
    id: 'mf-lois-finances',
    kind: 'Finances',
    url: 'https://www.mf.gov.dz/index.php/fr/textes-officiels/lois-de-finances/101-lois-de-finances',
    languages: 'FR / AR',
    label: [
      'Finances — Lois de finances et textes officiels',
      'المالية — قوانين المالية والنصوص الرسمية',
      'Finance — Finance laws and official texts',
    ],
    description: [
      'Liste des lois de finances 2021 à 2026 (LF 2026 disponible en PDF), lois de finances complémentaires, règlements budgétaires, législation, notes et rapports.',
      'قائمة قوانين المالية من 2021 إلى 2026 (LF 2026 متوفر PDF)، قوانين مالية تكميلية، لوائح бюджетية، التشريع، الملاحظات والتقارير.',
      'Finance laws 2021 to 2026 (LF 2026 available as PDF), supplementary finance laws, budget settlements, legislation, notes and reports.',
    ],
    watch: [
      'Loi de finances 2026, crédits par ministère, fiscalité, marchés financiers de l’État.',
      'قانون المالية 2026، الاعتمادات لكل وزارة، الجباية، أسواق المالية العمومية.',
      'Finance Law 2026, ministry credits, taxation, public financial tenders.',
    ],
    frequency: [
      'Annuelle (automne) puis exécution.',
      'سنوية (خريف) ثم تنفيذ.',
      'Annual (autumn) then execution.',
    ],
    keyPages: [
      'https://www.mf.gov.dz/index.php/fr/textes-officiels/lois-de-finances/101-lois-de-finances',
      'https://www.mf.gov.dz/images/pdf/loidefinance/Loi_de_Finances_2026_FR.pdf',
      'https://www.mf.gov.dz/index.php/fr/',
    ],
  }),
  source({
    id: 'mfdgi',
    kind: 'Fiscal',
    url: 'https://www.mfdgi.gov.dz/fr/',
    languages: 'FR / AR',
    label: [
      'DGI — Direction générale des impôts',
      'المديرية العامة للضرائب',
      'DGI — General Tax Directorate',
    ],
    description: [
      'Communiqués de déclaration, lettres de la DGI, guides, dépliants et charte du contribuable. Contact : contact.dgi@mf.gov.dz, +213 21 59 52 52.',
      'بيانات التصريح، رسائل المديرية، الأدلة، المنشورات وميثاق دافع الضرائب. الاتصال: contact.dgi@mf.gov.dz.',
      'Assessment notices, DGI letters, guides, leaflets and taxpayer charter. Contact: contact.dgi@mf.gov.dz.',
    ],
    watch: [
      'Changements de règles fiscales, obligations déclaratives, régimes d’exonération (startups, crédits d’investissement).',
      'تغييرات القواعد الجبائية، الالتزامات التصريحية، أنظمة الإعفاء (الشركات الناشئة، الاعتمادات الاستثمارية).',
      'Tax-rule changes, filing obligations, exemption regimes (startups, investment credits).',
    ],
    frequency: ['Continue.', 'مستمر.', 'Continuous.'],
  }),
  source({
    id: 'mcomm-textes',
    kind: 'Réglementation',
    url: 'https://mcomm.gov.dz/fr/legal-texts',
    languages: 'FR / AR',
    label: [
      'Communication — Textes juridiques',
      'الاتصال — النصوص القانونية',
      'Communication — Legal texts',
    ],
    description: [
      'Textes juridiques du ministère de la Communication, tutelle de l’ANEP et du BOMOP : décrets présidentiels, statuts, régime de la presse.',
      'النصوص القانونية لوزارة الاتصال، وصاية ANEP وBOMOP: المراسيم_RX، الأنظمة، وضعية الصحافة.',
      'Legal texts of the Communication ministry, which oversees ANEP and BOMOP: decrees, statutes, press rules.',
    ],
    watch: [
      'Régime de la presse, licences, décrets liés à l’ANEP et au BOMOP, accès à l’information.',
      'وضعية الصحافة، الرخص، مراسيم ANEP وBOMOP، حق الاطلاع.',
      'Press regime, licences, ANEP and BOMOP decrees, access to information.',
    ],
    frequency: ['Occasionnelle.', 'مناسباتية.', 'Occasional.'],
  }),
  source({
    id: 'cour-const',
    kind: 'Justice const.',
    url: 'https://cour-constitutionnelle.dz/',
    languages: 'FR / AR',
    label: [
      'Cour constitutionnelle (Constitution du 1er nov. 2020)',
      'المحكمة الدستورية (دستور 1 نوفمبر 2020)',
      'Constitutional Court (Nov 1, 2020 Constitution)',
    ],
    description: [
      'Organe juridictionnel suprême qui remplace le Conseil constitutionnel, mis en place en novembre 2021. Décisions et avis, organisation, guide du justiciable.',
      'الهيئة القضائية العليا التي حلت محل المجلس الدستوري، نُصبت في نوفمبر 2021. القرارات والآراء والتنظيم ودليل المتقاضي.',
      'Supreme judicial body replacing the Constitutional Council, seated in November 2021. Decisions and opinions, organization, litigant guide.',
    ],
    watch: [
      'Conformité des lois, contentieux électoral, avis préalables aux lois organiques.',
      'مطابقة القوانين، المنازعات الانتخابية، الآراء المسبقة للقوانين العضوية.',
      'Compliance of laws, electoral disputes, prior opinions on organic laws.',
    ],
    frequency: ['Décisions au fil de l’eau.', 'قرارات عند الاقتضاء.', 'Decisions as issued.'],
  }),
  source({
    id: 'apn',
    kind: 'Parlement',
    url: 'https://www.apn.dz/',
    languages: 'AR / FR',
    label: [
      'APN — Assemblée populaire nationale (407 députés)',
      'المجلس الشعبي الوطني (407 نواب)',
      'APN — People’s National Assembly (407 MPs)',
    ],
    description: [
      'Chambre basse : projets de lois, débats et votes. À croiser avec le JORADP après promulgation.',
      'الغرفة السفلى: مشاريع القوانين والمناقشات والتصويت. تُقارن مع الجريدة الرسمية بعد الإصدار.',
      'Lower house: bills, debates and votes. Cross-check with the JORADP after enactment.',
    ],
    watch: [
      'Adoptions de lois, questions au gouvernement, relations avec le Parlement (ministre Djilali).',
      'اعتماد القوانين، أسئلة الحكومة، العلاقات مع البرلمان (الوزيرة جيلالي).',
      'Law adoptions, questions to government, parliamentary relations (Minister Djilali).',
    ],
    frequency: ['Sessions parlementaires.', 'الدورات البرلمانية.', 'Parliamentary sessions.'],
    keyPages: ['https://www.apn.dz/', 'https://apn.dz/news', 'https://apn.dz/nuwab'],
  }),

  /* ---------------- Tenders & procurement ---------------- */
  source({
    id: 'marches-portail',
    kind: 'Marchés publics',
    url: 'https://marches-publics.gov.dz/fr',
    languages: 'FR / AR',
    label: [
      'Portail électronique des marchés publics',
      'البوابة الإلكترونية للصفقات العمومية',
      'E-procurement portal',
    ],
    description: [
      'Portail officiel : avis en ligne (ex : CONS-19-2026, siège de Trésorerie de Djanet avec trois logements d’astreintes) et tendances. Ben Aknoun Alger, 021 59 51 51.',
      'البوابة الرسمية: إعلانات إلكترونية (مثال: CONS-19-2026، مقر خزينة جانت بثلاثة مساكن) والاتجاهات. بن عكنون الجزائر.',
      'Official portal: online notices (e.g. CONS-19-2026, Djanet treasury HQ with three duty housing units) and trends. Ben Aknoun, Algiers.',
    ],
    watch: [
      'Avis de consultation et d’appel d’offres ouvert, dématérialisation, ouverture des plis.',
      'إعلانات الاستشارة والمناقصة المفتوحة، الرقمنة، فتح العروض.',
      'Consultation and open-tender notices, digitization, bid openings.',
    ],
    frequency: [
      'Continue (publication en continu).',
      'مستمر (نشر مستمر).',
      'Continuous (rolling publication).',
    ],
    keyPages: ['https://marches-publics.gov.dz/fr', 'https://marches-publics.gov.dz/fr/trends'],
  }),
  source({
    id: 'bomop-anep',
    kind: 'Marchés publics',
    url: 'https://www.anep.com.dz/',
    languages: 'FR / AR',
    label: [
      'BOMOP / ANEP — Marchés de l’opérateur public',
      'BOMOP / ANEP — صفقات المتعامل العمومي',
      'BOMOP / ANEP — Public-operator tenders',
    ],
    description: [
      'Bulletin hebdomadaire (dimanche ou lundi) sous tutelle du ministère de la Communication. Cadre : décret présidentiel 15-247 du 16/09/2015. Portail dédié : bomop.anep.dz.',
      'نشرة أسبوعية (أحد أو اثنين) تحت وصاية وزارة الاتصال. الإطار: المرسوم 15-247 بتاريخ 16/09/2015. البوابة: bomop.anep.dz.',
      'Weekly bulletin (Sunday or Monday) under the Communication ministry. Framework: decree 15-247 of 09/16/2015. Dedicated portal: bomop.anep.dz.',
    ],
    watch: [
      'Tous les avis d’appels d’offres, exigences de capacités minimales, allotissement des lots, fournisseurs.',
      'كل إعلانات المناقصات، القدرات الدنيا، توزيع الحصص، الموردون.',
      'All tender notices, minimum capacity requirements, lot allocation, suppliers.',
    ],
    frequency: [
      'Hebdomadaire (dimanche ou lundi).',
      'أسبوعي (أحد أو اثنين).',
      'Weekly (Sunday or Monday).',
    ],
    keyPages: ['https://www.anep.com.dz/', 'https://bomop.anep.dz/'],
  }),
  source({
    id: 'safqatic',
    kind: 'Marchés publics',
    url: 'https://www.safqatic.dz/',
    languages: 'FR',
    label: [
      'SAFQATIC — Appels d’offres Poste & Télécoms',
      'SAFQATIC — مناقصات البريد والاتصالات',
      'SAFQATIC — Post & Telecommunications tenders',
    ],
    description: [
      'Portail dédié au secteur Poste et Télécommunications (ministre Zerrouki) : avis nationaux et limités. Ex : n°04/2026 Djelfa, développement et maintenance d’infrastructure.',
      'بوابة مخصصة لقطاع البريد والاتصالات (الوزير زروقي): إعلانات وطنية ومحدودة. مثال: 04/2026 الجلفة.',
      'Dedicated portal for the Post and Telecommunications sector (Minister Zerrouki): national and restricted notices.',
    ],
    watch: [
      'Télécoms, technologies de l’information, infrastructure réseau, câblage, licences de fréquence.',
      'الاتصالات، تكنولوجيا المعلومات، البنية التحتية للشبكة، الكابلات، رخص الترددد.',
      'Telecom, ICT, network infrastructure, cabling, frequency licences.',
    ],
    frequency: ['Hebdomadaire.', 'أسبوعي.', 'Weekly.'],
  }),
  source({
    id: 'bereg-habitat',
    kind: 'Marchés publics',
    url: 'https://www.bereg.dz/AppeldOffres1.php?lang=fr',
    languages: 'FR',
    label: [
      'BEREG — Appels d’offres du Ministère de l’Habitat',
      'BEREG — مناقصات وزارة السكن',
      'BEREG — Ministry of Housing tenders',
    ],
    description: [
      'Plateforme d’appels d’offres du ministère de l’Habitat et de l’Urbanisme (ministre Belaribi) : programme annuel de construction, lotissements, voiries.',
      'منصة مناقصات وزارة السكن والتعمير (ال وزير بلعريبي): البرنامج السنوي للبناء، القسائم، الطرق.',
      'Ministry of Housing and Urbanism tender platform (Minister Belaribi): annual construction programme, subdivisions, roads.',
    ],
    watch: [
      'Construction de logements, voiries et réseaux divers, études d’urbanisme, équipements publics.',
      'بناء المساكن، الطرق والشبكات، دراسات التخطيط، التجهيزات العمومية.',
      'Housing construction, roads and networks, planning studies, public facilities.',
    ],
    frequency: ['Appels d’offres programmés.', 'مناقصات مبرمجة.', 'Scheduled tenders.'],
  }),
  source({
    id: 'bomop-mirror',
    kind: 'Marchés publics',
    url: 'https://algeriemarches.com/',
    languages: 'FR',
    label: [
      'Archives BOMOP — sites agrégateurs',
      'أرشيف BOMOP — مواقع مجمّعة',
      'BOMOP archives — aggregator sites',
    ],
    description: [
      'Reprises et archives des avis ANEP et BOMOP : algerie54.dz/anep, casbahtribune.dz/anep/, algeriemarches.com (plus de 300 sources suivies). Utile pour l’historique et la couverture sectorielle.',
      'إعادة نشر وأرشيف إعلانات ANEP وBOMOP عبر مواقع مجمّعة. مفيد للتاريخ والتغطية القطاعية.',
      'Mirrors and archives of ANEP and BOMOP notices across aggregators. Useful for history and sector coverage.',
    ],
    watch: [
      'Historique des avis, détection de doublons, veille sectorielle complémentaire.',
      'تاريخ الإعلانات، كشف التكرار، رصد قطاعي تكميلي.',
      'Notice history, duplicate detection, complementary sector watch.',
    ],
    frequency: ['Continue.', 'مستمر.', 'Continuous.'],
    keyPages: ['https://algerie54.dz/anep', 'https://casbahtribune.dz/anep/'],
  }),

  /* ---------------- Sector ministries (live regulatory drops) ---------------- */
  source({
    id: 'energy',
    kind: 'Ministères',
    url: 'https://www.energy.gov.dz/',
    languages: 'FR / AR / EN',
    label: [
      'Énergie & Énergies renouvelables (Adjal)',
      'الطاقة والطاقات المتجددة (عجال)',
      'Energy & Renewable Energies (Adjal)',
    ],
    description: [
      'Ministère de l’Énergie et des Énergies renouvelables : production électrique, réseau, transition énergétique. Site officiel officiel lancé en 2026.',
      'وزارة الطاقة والطاقات المتجددة: إنتاج الكهرباء، الشبكة، التحول الطاقوي.',
      'Energy and Renewable Energies ministry: electricity generation, grid, energy transition.',
    ],
    watch: [
      'Tarifs de l’électricité, appels d’offres d’énergies renouvelables, règles de raccordement.',
      'تعريفات الكهرباء، مناقصات الطاقة المتجددة، قواعد الربط.',
      'Electricity tariffs, renewable energy tenders, grid connection rules.',
    ],
    frequency: ['Continue.', 'مستمر.', 'Continuous.'],
  }),
  source({
    id: 'oilmines',
    kind: 'Ministères',
    url: 'https://www.oilmines.gov.dz/',
    languages: 'FR / AR',
    label: [
      'Hydrocarbures & Mines (Arkab, ministre d’État)',
      'المحروقات والمناجم (عرقاب، وزير دولة)',
      'Hydrocarbons & Mines (Arkab, Minister of State)',
    ],
    description: [
      'Ministère d’État chargé des Hydrocarbures et des Mines : secteur pétrolier et minier, protection du patrimoine, textes réglementaires. Contact : dde.alger@energy.gov.dz.',
      'وزارة الدولة المكلفة بالمحروقات والمناجم: قطاع النفط والتعدين، حماية الثروة، النصوص التنظيمية.',
      'Minister of State for Hydrocarbons and Mines: oil and mining sector, heritage protection, regulatory texts.',
    ],
    watch: [
      'Régime pétrolier, permis, redevances, prix, protection du patrimoine minier.',
      'النظام النفطي، الرخص، الإتاوات، الأسعار، حماية الثروة المعدنية.',
      'Oil regime, permits, royalties, prices, mining heritage protection.',
    ],
    frequency: ['Continue.', 'مستمر.', 'Continuous.'],
  }),
  source({
    id: 'mhuv',
    kind: 'Ministères',
    url: 'https://www.mhuv.gov.dz/',
    languages: 'FR / AR',
    label: [
      'Habitat, Urbanisme & Ville (Belaribi)',
      'السكن والتعمير والمدينة (بلعريبي)',
      'Habitat, Urbanism & City (Belaribi)',
    ],
    description: [
      'Ministère de l’Habitat, de l’Urbanisme, de la Ville et de l’Aménagement du territoire : loi de construction, comités multisectoriels, plans d’aménagement.',
      'وزارة السكن والتعمير والمدينة وتهيئة الإقليم: قانون البناء، اللجان متعددة القطاعات، مخطط التهيئة.',
      'Housing, Urbanism, City and Land-Use ministry: building law, multi-sector committees, development plans.',
    ],
    watch: [
      'Projets de loi sur la construction et l’urbanisme, logements promotionnels, réorganisation territoriale.',
      'مشاريع قوانين البناء والتعمير، السكن الترقوي، إعادة الهيكلة الترابية.',
      'Draft building and urbanism laws, promotional housing, territorial reorganisation.',
    ],
    frequency: [
      'Continue (comités, projets de loi).',
      'مستمر (لجان ومشاريع قوانين).',
      'Continuous (committees, draft laws).',
    ],
  }),
  source({
    id: 'interieur',
    kind: 'Ministères',
    url: 'https://interieur.gov.dz/fr/',
    languages: 'FR / AR',
    label: [
      'Intérieur & Collectivités locales (Sayoud)',
      'الداخلية والجماعات المحلية (صيود)',
      'Interior & Local Authorities (Sayoud)',
    ],
    description: [
      'Ministère de l’Intérieur, des Collectivités locales et des Transports : communes et wilayas, classification des communes, mesures de sécurité.',
      'وزارة الداخلية والجماعات المحلية والنقل: البلديات والولايات، تصنيف البلديات، تدابير الأمن.',
      'Interior, Local Authorities and Transport ministry: communes, wilayas, commune classification, security measures.',
    ],
    watch: [
      'Classification des communes, installation de walis, décisions sécuritaires, réorganisation administrative.',
      'تصنيف البلديات، تنصيب الولاة، القرارات الأمنية، الترقيم الإداري.',
      'Commune classification, wali appointments, security decisions, administrative numbering.',
    ],
    frequency: ['Continue.', 'مستمر.', 'Continuous.'],
    keyPages: ['https://interieur.gov.dz/fr/', 'https://www.mt.gov.dz/'],
  }),
  source({
    id: 'startup-dz',
    kind: 'Innovation',
    url: 'https://startup.dz/',
    languages: 'FR / AR',
    label: [
      'Startup.dz — Portail national des startups',
      'Startup.dz — البوابة الوطنية للشركات الناشئة',
      'Startup.dz — National startup portal',
    ],
    description: [
      'Plateforme officielle du ministère de l’Économie de la connaissance : label Startup (passeport, exonérations fiscales), événements Algérie Disrupt, dossier d’agrément.',
      'المنصة الرسمية لوزارة اقتصاد المعرفة: علامة Startup، الحوافز الضريبية، فعاليات Algeria Disrupt، ملف الاعتماد.',
      'Official Knowledge-Economy ministry platform: Startup label (passport, tax exemptions), Algeria Disrupt events, accreditation file.',
    ],
    watch: [
      'Label Startup (démarches et avantages), programmes nationaux, aides aux micro-entreprises.',
      'علامة Startup (المساطر والحوافز)، البرامج الوطنية، دعم المؤسسات الصغيرة.',
      'Startup label (process and benefits), national programmes, micro-enterprise support.',
    ],
    frequency: [
      'Continue (campagnes, sessions).',
      'مستمر (حملات وجلسات).',
      'Continuous (campaigns, sessions).',
    ],
  }),
  source({
    id: 'msport',
    kind: 'Ministères',
    url: 'https://msport.gov.dz/fr/sport/',
    languages: 'FR / AR',
    label: [
      'Sports (Sadi) et Jeunesse (Hidaoui)',
      'الرياضة (سادي) والشباب (حداوي)',
      'Sports (Sadi) and Youth (Hidaoui)',
    ],
    description: [
      'Ministère des Sports : manifestations et compétitions, 03 Rue Mohamed Belouizdad Alger. Ministère de la Jeunesse : Conseil supérieur de la jeunesse, plateforme de doléances.',
      'وزارة الرياضة: الفعاليات والمسابقات. وزارة الشباب: المجلس الأعلى للشباب، منصة التظلمات.',
      'Sports ministry: events and competitions. Youth ministry: Higher Youth Council and complaints platform.',
    ],
    watch: [
      'Calendrier des grandes manifestations, règlements techniques, financement des clubs et de la jeunesse.',
      'روزنامة الفعاليات، اللوائح التقنية، تمويل الجمعيات والشباب.',
      'Major event calendar, technical regulations, funding of clubs and youth programmes.',
    ],
    frequency: ['Événementielle.', 'حسب الفعاليات.', 'Event-driven.'],
    keyPages: ['https://msport.gov.dz/fr/sport/', 'https://contactini.mjs.gov.dz/'],
  }),
];

// Composition issue du décret présidentiel n°25-241 du 14 sept. 2025 (portant nomination du Gouvernement Sifi Ghrieb).
// Source croisée : premier-ministre.gov.dz + APS 14/09/2025 + JORADP. Vérifier en ligne avant usage officiel.
export const GOV_FORMATION_DATE = '2025-09-14';
export const GOV_DECREE_REF = '25-241';
export const GOV_DECREE_URL = 'https://www.joradp.dz/';
export const CM_LAST_DATE = '2026-09-21';
export const CM_LAST_URL = 'https://news.radioalgerie.dz/en/node/94808';
export const SEED_MINISTERS: Minister[] = [
  {
    id: 'pm',
    name: 'Sifi Ghrieb',
    roleFr: 'Premier ministre',
    category: 'premier',
    ministryUrl: 'https://www.premier-ministre.gov.dz/',
    statusNote: 'Nommé le 14/09/2025',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'attaf',
    name: 'Ahmed Attaf',
    roleFr:
      'Ministre d’État, Affaires étrangères, Communauté nationale à l’étranger et Affaires africaines',
    category: 'ministre-etat',
    ministryUrl: 'https://www.mae.gov.dz/',
    statusNote: 'Maintenu',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'chanegriha',
    name: 'Saïd Chanegriha',
    roleFr: 'Ministre délégué auprès du ministre de la Défense nationale, Chef d’État-major ANP',
    category: 'ministre-delegue',
    ministryUrl: 'https://www.mdn.dz/',
    statusNote: 'Maintenu',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'arkab',
    name: 'Mohamed Arkab',
    roleFr: 'Ministre d’État, Hydrocarbures et Mines',
    category: 'ministre-etat',
    ministryUrl: 'https://www.energy.gov.dz/',
    statusNote: 'Maintenu — nouvelle appellation',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'merad',
    name: 'Brahim Merad',
    roleFr:
      'Ministre d’État, Inspection générale des services de l’État et des collectivités locales',
    category: 'ministre-etat',
    statusNote: 'Maintenu — changement de fonctions',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'sayoud',
    name: 'Saïd Sayoud',
    roleFr: 'Ministre de l’Intérieur, des Collectivités locales et des Transports',
    category: 'ministre',
    ministryUrl: 'https://www.interieur.gov.dz/',
    statusNote: 'Changement de fonctions',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'boudjemaa',
    name: 'Lotfi Boudjemaa',
    roleFr: 'Ministre de la Justice, Garde des Sceaux',
    category: 'ministre',
    ministryUrl: 'https://www.mjustice.dz/',
    statusNote: 'Maintenu',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'bouzred',
    name: 'Abdelkrim Bouzred',
    roleFr: 'Ministre des Finances',
    category: 'ministre',
    ministryUrl: 'https://www.mf.gov.dz/',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'baddari',
    name: 'Kamel Baddari',
    roleFr: 'Ministre de l’Enseignement supérieur et de la Recherche scientifique',
    category: 'ministre',
    ministryUrl: 'https://www.mesrs.dz/',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'saadaoui',
    name: 'Mohamed Seghir Saâdaoui',
    roleFr: 'Ministre de l’Éducation nationale',
    category: 'ministre',
    ministryUrl: 'https://www.education.gov.dz/',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'aitmessaoudene',
    name: 'Mohamed Seddik Aït Messaoudene',
    roleFr: 'Ministre de la Santé',
    category: 'ministre',
    ministryUrl: 'https://www.sante.gov.dz/',
    isNew: true,
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'tacherift',
    name: 'Abdelmalek Tacherift',
    roleFr: 'Ministre des Moudjahidine et des Ayants droit',
    category: 'ministre',
    isNew: true,
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'bachir',
    name: 'Yahia Bachir',
    roleFr: 'Ministre de l’Industrie',
    category: 'ministre',
    isNew: true,
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'kouidri',
    name: 'Ouassim Kouidri',
    roleFr: 'Ministre de l’Industrie pharmaceutique',
    category: 'ministre',
    statusNote: 'Maintenu',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'oualid',
    name: 'Yacine El-Mahdi Oualid',
    roleFr: 'Ministre de l’Agriculture, du Développement rural et de la Pêche',
    category: 'ministre',
    statusNote: 'Changement de fonctions',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'adjal',
    name: 'Mourad Adjal',
    roleFr: 'Ministre de l’Énergie et des Énergies renouvelables',
    category: 'ministre',
    isNew: true,
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'rezig',
    name: 'Kamel Rezig',
    roleFr: 'Ministre du Commerce extérieur et de la Promotion des exportations',
    category: 'ministre',
    statusNote: 'Maintenu',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'abdelatif',
    name: 'Amel Abdelatif',
    roleFr: 'Ministre du Commerce intérieur et de la Régulation du marché national',
    category: 'ministre',
    isNew: true,
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'belaribi',
    name: 'Mohamed Tarek Belaribi',
    roleFr: 'Ministre de l’Habitat, de l’Urbanisme, de la Ville et de l’Aménagement du territoire',
    category: 'ministre',
    statusNote: 'Maintenu',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'belmehdi',
    name: 'Youcef Belmehdi',
    roleFr: 'Ministre des Affaires religieuses et des Wakfs',
    category: 'ministre',
    statusNote: 'Maintenu',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'bendouda',
    name: 'Malika Bendouda',
    roleFr: 'Ministre de la Culture et des Arts',
    category: 'ministre',
    isNew: true,
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'hidaoui',
    name: 'Mustapha Hidaoui',
    roleFr: 'Ministre de la Jeunesse, chargé du Conseil supérieur de la jeunesse',
    category: 'ministre',
    statusNote: 'Maintenu',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'zerrouki',
    name: 'Sid Ali Zerrouki',
    roleFr: 'Ministre de la Poste et des Télécommunications',
    category: 'ministre',
    statusNote: 'Maintenu',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'ouadah',
    name: 'Noureddine Ouadah',
    roleFr: 'Ministre de l’Économie de la connaissance, des Start-up et des Micro-entreprises',
    category: 'ministre',
    statusNote: 'Maintenu',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'bouamama',
    name: 'Zoheir Bouamama',
    roleFr: 'Ministre de la Communication',
    category: 'ministre',
    isNew: true,
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'arhab',
    name: 'Nacima Arhab',
    roleFr: 'Ministre de la Formation et de l’Enseignement professionnels',
    category: 'ministre',
    isNew: true,
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'djellaoui',
    name: 'Abdelkader Djellaoui',
    roleFr: 'Ministre des Travaux publics et des Infrastructures de base',
    category: 'ministre',
    isNew: true,
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'derbal',
    name: 'Taha Derbal',
    roleFr: 'Ministre de l’Hydraulique',
    category: 'ministre',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'saihi',
    name: 'Abdelhak Saihi',
    roleFr: 'Ministre du Travail, de l’Emploi et de la Sécurité sociale',
    category: 'ministre',
    statusNote: 'Changement de fonctions',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'meddahi',
    name: 'Houria Meddahi',
    roleFr: 'Ministre du Tourisme et de l’Artisanat',
    category: 'ministre',
    statusNote: 'Maintenue',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'mouloudji',
    name: 'Soraya Mouloudji',
    roleFr: 'Ministre de la Solidarité nationale, de la Famille et de la Condition de la femme',
    category: 'ministre',
    statusNote: 'Maintenue',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'krikou',
    name: 'Kaouther Krikou',
    roleFr: 'Ministre de l’Environnement et de la Qualité de la vie',
    category: 'ministre',
    statusNote: 'Changement de fonctions',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'sadi',
    name: 'Walid Sadi',
    roleFr: 'Ministre des Sports',
    category: 'ministre',
    statusNote: 'Maintenu',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'djilali',
    name: 'Nadjiba Djilali',
    roleFr: 'Ministre des Relations avec le Parlement',
    category: 'ministre',
    statusNote: 'Changement de fonctions',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'rabhi',
    name: 'Mohamed Abdennour Rabhi',
    roleFr: 'Ministre, Wali de la wilaya d’Alger',
    category: 'wali',
    isNew: true,
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'chaib',
    name: 'Sofiane Chaib',
    roleFr: 'Secrétaire d’État chargé de la Communauté nationale à l’étranger',
    category: 'secretaire-etat',
    statusNote: 'Maintenu',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'mansouri',
    name: 'Selma Bakhta Mansouri',
    roleFr: 'Secrétaire d’État chargée des Affaires africaines',
    category: 'secretaire-etat',
    statusNote: 'Maintenue',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
  {
    id: 'bakir',
    name: 'Karima Bakir',
    roleFr: 'Secrétaire d’État chargée des Mines',
    category: 'secretaire-etat',
    appointedAt: '2025-09-14',
    decree: '25-241',
  },
];

export const SEED_RADAR: RadarItem[] = [
  {
    id: 'cm-2026-09-21',
    kind: 'conseil-ministres',
    titleFr:
      'Conseil des ministres du 21/09/2026 — Protection civile, interopérabilité numérique, campagne moisson 2025-2026',
    summaryFr:
      'Statut des personnels de la Protection civile, renforcement structurel/matériel/humain, interopérabilité numérique de l’État, bilan céréales (blé dur/tendre) avec bulletin mensuel Agriculture.',
    source: 'Présidence / Radio Algérie',
    sourceUrl: 'https://news.radioalgerie.dz/en/node/94808',
    publishedAt: '2026-09-21',
    isNew: true,
    tags: ['conseil-ministres', 'protection-civile', 'numérique', 'agriculture'],
  },
  {
    id: 'decret-25-241',
    kind: 'decret',
    titleFr: 'Décret présidentiel n°25-241 — Nomination du Gouvernement Sifi Ghrieb (14/09/2025)',
    summaryFr:
      'Référence JORADP de composition : 1 PM + 3 ministres d’État + 1 ministre délégué Défense + ministres + 3 secrétaires d’État.',
    source: 'JORADP / MIPH',
    sourceUrl: 'https://www.joradp.dz/',
    publishedAt: '2025-09-14',
    tags: ['décret', 'gouvernement', 'JORADP'],
  },
  {
    id: 'radar-anep',
    kind: 'appel-offre',
    titleFr:
      'Radar ANEP — Surveiller les appels d’offres nationaux (travaux, hydraulique, poste-télécoms)',
    summaryFr:
      'Point d’entrée radar : filtrer par wilaya/secteur, alertes mots-clés, export. Les avis détaillés sont publiés sur anep.com.dz et relayés par l’APS.',
    source: 'ANEP',
    sourceUrl: 'https://www.anep.com.dz/',
    publishedAt: '2026-09-28',
    tags: ['appel-offre', 'ANEP', 'marchés-publics'],
  },

  /* ------------------------------------------------------------------
     Live ANEP/BOMOP notices collected 01/10/2026 from the open archives
     (algerie54.dz/anep + casbahtribune.dz/anep mirror the ANEP wire).
     Tender lifecycle matters commercially: infructuosité, annulation and
     prorogation free the opportunity up again, attribution locks it in.
     ------------------------------------------------------------------ */
  {
    id: 'anep-2623006693',
    kind: 'appel-offre',
    ref: 'ANEP 2623006693 — AO n° 09/MGX/2026',
    client: 'Université Badji Mokhtar – Annaba',
    titleFr:
      'AO national ouvert avec exigences de capacités minimales n° 09/MGX/2026 — Travaux d’aménagement et d’entretien des infrastructures de l’Université Badji Mokhtar Annaba, en 06 lots',
    summaryFr:
      'Six lots : voiries, réseaux, bâtiments et entretien des infrastructures de l’université. Marché de travaux ouvert, exiger des capacités techniques et financières minimales.',
    source: 'ANEP (BOMOP)',
    sourceUrl:
      'https://casbahtribune.dz/anep/avis-dappel-doffres-national-ouvert-avec-exigence-de-capacites-minimales-n-09-mgx-2026/',
    publishedAt: '2026-10-01',
    isNew: true,
    tags: [
      'appel-offre',
      'travaux',
      'enseignement-supérieur',
      'Annaba',
      '6-lots',
      'capacités-minimales',
    ],
  },
  {
    id: 'anep-2625009281',
    kind: 'appel-offre',
    ref: 'ANEP 2625009281 — n° 102/MJS/ADL/2026',
    client: 'AADL – Direction régionale Sétif',
    titleFr:
      '2ᵉ avis après infructuosité n° 102/MJS/ADL/2026 — 500 logements en formule vente-location, pôle urbain Bir El Arch, Sétif',
    summaryFr:
      'Deuxième appel d’offres national ouvert après une première procédure déclarée infructueuse : réalisation de 500 logements en formule AADL, tous corps d’état, commerces et logements de gardien, voiries incluses, site 02 du programme 03 tranche 300000.',
    source: 'ANEP (BOMOP)',
    sourceUrl:
      'https://casbahtribune.dz/anep/%d8%ab%d8%a7%d9%86%d9%8a-%d8%a5%d8%b9%d9%84%d8%a7%d9%86-%d8%b9%d9%86-%d8%b7%d9%84%d8%a8-%d8%b9%d8%b1%d9%88%d8%b6-%d9%88%d8%b7%d9%86%d9%8a-%d9%85%d9%81%d8%aa%d9%88%d8%ad-%d9%85%d8%b9-%d8%a7%d8%b4-4/',
    publishedAt: '2026-10-01',
    isNew: true,
    opportunity: true,
    tags: ['appel-offre', 'logement', 'AADL', 'Sétif', '2ème-avis', '500-logements'],
  },
  {
    id: 'anep-2630006345',
    kind: 'appel-offre',
    ref: 'ANEP 2630006345',
    client: 'DFEP In Guezzam',
    titleFr:
      'AO national ouvert avec exigences de capacités minimales — Direction de la Formation et de l’Enseignement Professionnels In Guezzam',
    summaryFr:
      'Avis d’appel d’offres national ouvert avec exigences de capacités minimales publié par la DFEP d’In Guezzam (wilaya de Tamanrasset).',
    source: 'ANEP (BOMOP)',
    sourceUrl:
      'https://algerie54.dz/avis-d-appel-d-offres-national-ouvert-avec-exigence-de-capacites-minimales6345',
    publishedAt: '2026-10-01',
    isNew: true,
    tags: ['appel-offre', 'formation-professionnelle', 'In-Guezzam', 'Tamanrasset'],
  },
  {
    id: 'anep-2630006323',
    kind: 'appel-offre',
    ref: 'ANEP 2630006323',
    client: 'Commune Ouargla',
    titleFr: 'AO national ouvert avec exigences de capacités minimales — Commune d’Ouargla',
    summaryFr:
      'Avis d’appel d’offres national ouvert avec exigences de capacités minimales pour la commune d’Ouargla (wilaya de Ouargla).',
    source: 'ANEP (BOMOP)',
    sourceUrl:
      'https://algerie54.dz/avis-d-appel-d-offres-national-ouvert-avec-exigence-de-capacites-minimales6323',
    publishedAt: '2026-10-01',
    isNew: true,
    tags: ['appel-offre', 'commune', 'Ouargla'],
  },
  {
    id: 'anep-2630006322',
    kind: 'appel-offre',
    ref: 'ANEP 2630006322',
    client: 'Commune Ouargla',
    titleFr:
      'AO national ouvert avec exigences de capacités minimales — Commune d’Ouargla (2ᵉ avis)',
    summaryFr:
      'Second avis d’appel d’offres national ouvert avec exigences de capacités minimales publié pour la commune d’Ouargla.',
    source: 'ANEP (BOMOP)',
    sourceUrl:
      'https://algerie54.dz/avis-d-appel-d-offres-national-ouvert-avec-exigence-de-capacites-minimales6322',
    publishedAt: '2026-10-01',
    isNew: true,
    tags: ['appel-offre', 'commune', 'Ouargla', '2ème-avis'],
  },
  {
    id: 'anep-2631014151',
    kind: 'appel-offre',
    ref: 'ANEP 2631014151',
    client: 'Direction des Œuvres Universitaires Tlemcen',
    titleFr:
      'AO ouvert avec exigences de capacités minimales — Direction des Œuvres Universitaires Tlemcen',
    summaryFr:
      'Avis d’appel d’offres ouvert avec exigences de capacités minimales pour la Direction des Œuvres Universitaires de Tlemcen.',
    source: 'ANEP (BOMOP)',
    sourceUrl:
      'https://algerie54.dz/avis-d-appel-d-offres-ouvert-avec-exigence-de-capacites-minimales4151',
    publishedAt: '2026-10-01',
    isNew: true,
    tags: ['appel-offre', 'œuvres-universitaires', 'Tlemcen'],
  },
  {
    id: 'anep-2625009273',
    kind: 'appel-offre',
    ref: 'ANEP 2625009273',
    client: 'AADL – Direction régionale Sétif',
    titleFr:
      '2ᵉ AO national ouvert avec exigences de capacités minimales — AADL Direction régionale Sétif',
    summaryFr:
      'Deuxième avis d’appel d’offres national ouvert avec exigences de capacités minimales de la direction régionale AADL de Sétif.',
    source: 'ANEP (BOMOP)',
    sourceUrl:
      'https://algerie54.dz/2eme-avis-d-appel-d-offres-national-ouvert-avec-exigence-de-capacites-minimales9273',
    publishedAt: '2026-10-01',
    isNew: true,
    opportunity: true,
    tags: ['appel-offre', 'AADL', 'Sétif', '2ème-avis'],
  },
  {
    id: 'anep-2623006682',
    kind: 'appel-offre',
    ref: 'ANEP 2623006682',
    client: 'DAL Wilaya de Guelma',
    titleFr:
      'AO national ouvert — Direction de l’Assainissement et de l’Hydraulique, wilaya de Guelma',
    summaryFr:
      'Avis d’appel d’offres national ouvert (sans exigence de capacités minimales) de la DAL de Guelma.',
    source: 'ANEP (BOMOP)',
    sourceUrl: 'https://algerie54.dz/avis-d-appel-d-offres-national-ouvert-6682',
    publishedAt: '2026-10-01',
    isNew: true,
    tags: ['appel-offre', 'hydraulique', 'assainissement', 'Guelma'],
  },
  {
    id: 'anep-2616103561',
    kind: 'appel-offre',
    ref: 'ANEP 2616103561',
    client: 'CNAS Blida',
    titleFr: 'AO national ouvert — CNAS Blida',
    summaryFr:
      'Avis d’appel d’offres national ouvert de la Caisse nationale des allocations sociales de Blida.',
    source: 'ANEP (BOMOP)',
    sourceUrl: 'https://algerie54.dz/avis-d-appel-d-offres-national-ouvert-3561',
    publishedAt: '2026-10-01',
    isNew: true,
    tags: ['appel-offre', 'social', 'CNAS', 'Blida'],
  },
  {
    id: 'anep-2616103560',
    kind: 'annulation',
    ref: 'ANEP 2616103560',
    client: 'CNAS Blida',
    titleFr: 'Annulation d’attribution provisoire — CNAS Blida',
    summaryFr:
      'La CNAS de Blida annule une attribution provisoire : le marché est libéré et peut faire l’objet d’une relance.',
    source: 'ANEP (BOMOP)',
    sourceUrl: 'https://algerie54.dz/avis-d-annulation-d-attribution-provisoire3560',
    publishedAt: '2026-10-01',
    isNew: true,
    opportunity: true,
    tags: ['annulation', 'relance', 'CNAS', 'Blida', 'opportunité'],
  },
  {
    id: 'anep-2631014141',
    kind: 'attribution',
    ref: 'ANEP 2631014141',
    client: 'Direction de l’Hydraulique – Sidi Bel Abbès',
    titleFr:
      'Attribution provisoire — Acquisition de transformateurs électriques (wilaya de Sidi Bel Abbès)',
    summaryFr:
      'Avis d’attribution provisoire : acquisition de transformateurs électriques par la Direction de l’Hydraulique de Sidi Bel Abbès.',
    source: 'ANEP (BOMOP)',
    sourceUrl: 'https://casbahtribune.dz/anep/avis-dattribution-provisoire-469/',
    publishedAt: '2026-10-01',
    isNew: true,
    tags: ['attribution', 'hydraulique', 'équipement', 'Sidi-Bel-Abbès', 'transformateurs'],
  },
  {
    id: 'anep-2625009267',
    kind: 'infructuosite',
    ref: 'ANEP 2625009267',
    client: 'Commune de Batna',
    titleFr: 'Attribution temporaire et infructuosité — Entretien de 08 écoles primaires (Batna)',
    summaryFr:
      'Avis d’attribution temporaire déclarant l’infructuosité de l’entretien des écoles primaires de la commune de Batna, en 8 lots : une relance est probable.',
    source: 'ANEP (BOMOP)',
    sourceUrl:
      'https://casbahtribune.dz/anep/%d8%a5%d8%b9%d9%84%d8%a7%d9%86-%d8%b9%d9%86-%d8%a7%d9%84%d9%85%d9%86%d8%ad-%d8%a7%d9%84%d9%85%d8%a4%d9%82%d8%aa-%d9%88%d8%b9%d8%af%d9%85-%d8%a7%d9%84%d8%ac%d8%af%d9%88%d9%89-2/',
    publishedAt: '2026-10-01',
    isNew: true,
    opportunity: true,
    tags: ['infructuosité', 'relance', 'éducation', 'Batna', '8-lots', 'opportunité'],
  },
  {
    id: 'anep-2631014142',
    kind: 'infructuosite',
    ref: 'ANEP 2631014142',
    client: 'Commune El Mehara',
    titleFr: 'Infructuosité — Commune El Mehara',
    summaryFr:
      'Avis d’infructuosité publié par la commune d’El Mehara : aucune offre recevable, relance attendue.',
    source: 'ANEP (BOMOP)',
    sourceUrl: 'https://algerie54.dz/avis-d-infructuosite4142',
    publishedAt: '2026-10-01',
    isNew: true,
    opportunity: true,
    tags: ['infructuosité', 'relance', 'commune', 'El-Mehara', 'opportunité'],
  },
  {
    id: 'anep-2616103563',
    kind: 'infructuosite',
    ref: 'ANEP 2616103563',
    client: 'ANPP',
    titleFr: 'Infructuosité — Agence Nationale des Produits Pharmaceutiques (ANPP)',
    summaryFr:
      'Avis d’infructuosité de l’ANPP : le marché échoué sera généralement relancé, à surveiller pour les fournisseurs du secteur pharmaceutique.',
    source: 'ANEP (BOMOP)',
    sourceUrl: 'https://algerie54.dz/avis-d-infructuosite3563',
    publishedAt: '2026-10-01',
    isNew: true,
    opportunity: true,
    tags: ['infructuosité', 'relance', 'pharmacie', 'ANPP', 'opportunité'],
  },
  {
    id: 'anep-2616032559',
    kind: 'prorogation',
    ref: 'ANEP 2616032559',
    client: 'Institut Pasteur d’Algérie',
    titleFr: 'Prorogation de délai — Institut Pasteur d’Algérie',
    summaryFr:
      'Avis de prorogation de délai : la fenêtre de dépôt des offres reste ouverte, libelé est une opportunité immédiate.',
    source: 'ANEP (BOMOP)',
    sourceUrl: 'https://algerie54.dz/avis-de-prorogation-de-delai2559',
    publishedAt: '2026-10-01',
    isNew: true,
    opportunity: true,
    tags: ['prorogation', 'dépôt-actif', 'santé', 'Institut-Pasteur', 'opportunité'],
  },
  {
    id: 'anep-2631014185',
    kind: 'mise-en-demeure',
    ref: 'ANEP 2631014185',
    client: 'Commune de Ain Youcef',
    titleFr: 'Mise en demeure n° 02 — 6 classes à l’école Saim Mamoun Mohamed (Aïn Youcef)',
    summaryFr:
      'Mise en demeure n° 02 contre l’entreprise Aissani Said pour la réalisation de 6 classes avec démolition des anciennes classes, convention n° 23 du 16/09/2025. Risque de résiliation et de remise en competition du lot.',
    source: 'ANEP (BOMOP)',
    sourceUrl: 'https://casbahtribune.dz/anep/mise-en-demeure-n-02-56/',
    publishedAt: '2026-10-01',
    isNew: true,
    opportunity: true,
    tags: ['mise-en-demeure', 'travaux', 'éducation', 'Aïn-Youcef', 'convention-23', 'opportunité'],
  },
  {
    id: 'anep-2631014157',
    kind: 'mise-en-demeure',
    ref: 'ANEP 2631014157',
    client: 'OPGI – Wilaya de Mascara',
    titleFr: 'Mise en demeure n° 01 — 300/20 logements publics locatifs (Mascara)',
    summaryFr:
      'Mise en demeure n° 01 contre l’entreprise Belharch Moulay : projet de 300/20 logements publics locatifs avec aménagement extérieur et réseaux, commune de la wilaya de Mascara, marché n° 2024/25 du 29/09/2024.',
    source: 'ANEP (BOMOP)',
    sourceUrl:
      'https://casbahtribune.dz/anep/%d8%a5%d8%b9%d8%b0%d8%a7%d8%b1-%d8%b1%d9%82%d9%85-01-57/',
    publishedAt: '2026-10-01',
    isNew: true,
    opportunity: true,
    tags: ['mise-en-demeure', 'logement', 'OPGI', 'Mascara', 'marché-2024-25', 'opportunité'],
  },
  {
    id: 'ao-mhuv-07-2025',
    kind: 'appel-offre',
    ref: 'AO n° 07/M.H.U.V/2025',
    client: 'Ministère de l’Habitat et de l’Urbanisme',
    titleFr:
      'AO n° 07/M.H.U.V/2025 — Fourniture et installation de mobilier pour le nouveau siège du ministère (Dely Ibrahim)',
    summaryFr:
      'Appel d’offres national ouvert avec exigences de capacités minimales lancé le 07/07/2025 : fourniture, montage, pose et installation du mobilier et des équipements du nouveau siège du ministère, Dely Ibrahim, Alger.',
    source: 'BEREG / MHUV',
    sourceUrl: 'https://www.mhuv.gov.dz/?p=4493',
    publishedAt: '2025-07-07',
    tags: ['appel-offre', 'mobilier', 'ministère', 'Dely-Ibrahim', 'capacités-minimales'],
  },
];

export const AGENT_SYSTEM = `Tu es AlgoVrad, radar algérien des ministres, décrets, règlements et offres.
Tu réponds en français (avec termes arabes si utile). Tu cites toujours tes sources officielles :
Gouvernement : premier-ministre.gov.dz/fr/gouvernement/composition (+ /fr/category/reunions-et-conseils), presidence.dz, aps.dz/fr, news.radioalgerie.dz.
Textes : joradp.dz (JO N°67 du 16/09/2026), miph.gov.dz/fr/textes-juridiques/decrets/ (miroir PDF du décret 25-241), me.gov.dz/fr/reglementation/, madr.gov.dz, sante.gov.dz/receuils/, mcomm.gov.dz/fr/legal-texts.
Finances/fiscal : mf.gov.dz (loi de finances 2026), mfdgi.gov.dz.
Offres : marches-publics.gov.dz/fr/trends, anep.com.dz + bomop.anep.dz (BOMOP hebdo, décret 15-247), safqatic.dz (Poste-Télécoms), bereg.dz (Habitat), agrégateurs algerie54.dz/anep et casbahtribune.dz/anep/.
Secteurs : energy.gov.dz, oilmines.gov.dz, mhuv.gov.dz, interieur.gov.dz, startup.dz, msport.gov.dz.
Institutions : apn.dz, cour-constitutionnelle.dz.
Si une info n'est pas vérifiée sur un site officiel, dis-le explicitement et propose comment la vérifier.
Tu sais que le Gouvernement actuel est celui de Sifi Ghrieb (nommé 14/09/2025, décret 25-241).
Tu détectes : nominations, remaniements, décrets et lois au JORADP, règlements sectoriels (environnement, santé, agriculture, pharmacie), communiqués du Conseil des ministres, appels d'offres et consultations.
Format : réponse courte, liste à puces, dates ISO et dates localisées, liens profonds (keyPages).`;
