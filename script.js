/**
 * SCRIPT.JS
 * This file contains all the JavaScript logic for the news website.
 * It handles state management, routing, rendering, user interactions, and admin controls.
 */

// --- State Management ---
let currentLanguage = 'te';
let isEditMode = false;
let isLoggedIn = false;
let loggedInUserType = null; // 'user' or 'admin'
let slideIndex = 0;
let slideInterval;
let tickerAnimationId;
let lazyLoadObserver;

// --- Site-wide Data (Can be replaced with API calls) ---

// Translations for UI elements
const translations = {
    en: {
        site_title: "BC TODAY",
        // Common words kept in English
        epaper: "E-Paper", 
        about_us: "About Us", 
        contact: "Contact Us",
        login: "Login", 
        settings: "Settings",
        enable_editing: "Enable Editing",
        disable_editing: "Disable Editing",
        quick_links: "Quick Links", 
        follow_us: "Follow Us",
        remember_me: "Remember Me", 
        forgot_password: "Forgot Password?",
        // Page specific
        home: "Home", local: "Local News", world: "World", business: "Business", sports: "Sports", opinion: "Opinion", cinema: "Cinema",
        breaking: "BREAKING",
        back_to_home: "&larr; Back to Home",
        rights_reserved: "All Rights Reserved.",
        add_new_story: "Add New Story", edit_article: "Edit Article", title: "Title", author: "Author", image_url: "Image URL", full_story: "Full Story", cancel: "Cancel", save_changes: "Save Changes", select_section: "Select Section", add_story: "Add Story",
        footer_tagline: "Your window to the world. Delivering reliable news every day.",
        most_read: "Most Read", photo_gallery: "Photo Gallery", related_stories: "Related Stories",
        search_results_for: "Search Results for",
        logout: "Logout",
        user_login: "User Login", user_login_prompt: "Login with your social account to comment and participate.",
        login_with_google: "Login with Google", staff_login: "Staff Login",
        username: "Username", password: "Password", login_error: "Invalid username or password.",
        add_new_article: "Add New Article",
        no_results: "No articles found.",
        access_denied: "Access Denied",
        access_denied_msg: "You must be an admin to view this page.",
        general_settings: "General", pages_content: "Pages", epaper_settings: "E-Paper",
        save_settings: "Save Settings",
        ticker_items_en: "Ticker Items (English)", ticker_items_te: "Ticker Items (Telugu)",
        one_per_line: "One item per line",
        link_text: "Link Text", link_url: "URL", platform: "Platform",
        add_link: "Add Link", remove: "Remove",
        page_title: "Page Title", page_content: "Page Content",
        epaper_date: "Date", epaper_url: "PDF URL", add_epaper: "Add E-Paper",
        site_identity: "Site Identity", logo_url: "Logo Image URL",
        password_reset_info: "If an account exists, a reset link has been sent.",
        settings_saved: "Settings saved successfully!",
    },
    te: {
        site_title: "BC TODAY", // Changed to English as requested
        // Common words are now in English for both languages as requested
        epaper: "E-Paper", 
        about_us: "About Us", 
        contact: "Contact Us",
        login: "Login", 
        settings: "Settings",
        enable_editing: "Enable Editing",
        disable_editing: "Disable Editing",
        quick_links: "Quick Links", 
        follow_us: "Follow Us",
        remember_me: "Remember Me", 
        forgot_password: "Forgot Password?",
        breaking: "BREAKING", // Kept in English
        // Page specific translations
        home: "హోమ్", local: "స్థానిక వార్తలు", world: "ప్రపంచ", business: "వ్యాపార", sports: "క్రీడలు", opinion: "అభిప్రాయం", cinema: "సినిమా",
        back_to_home: "&larr; హోమ్‌కు తిరిగి వెళ్ళు",
        rights_reserved: "అన్ని హక్కులూ ప్రత్యేకించుకోవడమైనది.",
        add_new_story: "కొత్త వార్తను జోడించు", edit_article: "వ్యాసాన్ని సవరించండి", title: "శీర్షిక", author: "రచయిత", image_url: "చిత్రం URL", full_story: "పూర్తి కథనం", cancel: "రద్దు చేయి", save_changes: "భద్రపరచు", select_section: "విభాగాన్ని ఎంచుకోండి", add_story: "వార్తను జోడించు",
        footer_tagline: "ప్రపంచానికి మీ గవాక్షం. ప్రతిరోజూ విశ్వసనీయ వార్తలను అందిస్తోంది.",
        most_read: "అత్యధికంగా చదివినవి", photo_gallery: "ఫోటో గ్యాలరీ", related_stories: "సంబంధిత కథనాలు",
        search_results_for: "శోధన ఫలితాలు",
        logout: "లాగ్ అవుట్",
        user_login: "యూజర్ లాగిన్", user_login_prompt: "వ్యాఖ్యానించడానికి మరియు పాల్గొనడానికి మీ సోషల్ ఖాతాతో లాగిన్ అవ్వండి.",
        login_with_google: "Google తో లాగిన్ అవ్వండి", staff_login: "సిబ్బంది లాగిన్",
        username: "యూజర్‌నేమ్", password: "పాస్‌వర్డ్", login_error: "తప్పు యూజర్‌నేమ్ లేదా పాస్‌వర్డ్.",
        add_new_article: "కొత్త వ్యాసం జోడించు",
        no_results: "వ్యాసాలు కనుగొనబడలేదు.",
        access_denied: "ప్రాప్యత నిరాకరించబడింది",
        access_denied_msg: "ఈ పేజీని చూడటానికి మీరు అడ్మిన్ అయి ఉండాలి.",
        general_settings: "సాధారణ", pages_content: "పేజీలు", epaper_settings: "ఇ-పేపర్",
        save_settings: "సెట్టింగ్‌లను సేవ్ చేయి",
        ticker_items_en: "టిక్కర్ ఐటమ్స్ (ఇంగ్లీష్)", ticker_items_te: "టిక్కర్ ఐటమ్స్ (తెలుగు)",
        one_per_line: "ఒక లైన్‌కు ఒకటి",
        link_text: "లింక్ టెక్స్ట్", link_url: "URL", platform: "ప్లాట్‌ఫారమ్",
        add_link: "లింక్ జోడించు", remove: "తొలగించు",
        page_title: "పేజీ శీర్షిక", page_content: "పేజీ కంటెంట్",
        epaper_date: "తేదీ", epaper_url: "PDF URL", add_epaper: "ఇ-పేపర్ జోడించు",
        site_identity: "సైట్ గుర్తింపు", logo_url: "లోగో చిత్ర URL",
        password_reset_info: "ఖాతా ఉన్నట్లయితే, రీసెట్ లింక్ పంపబడింది.",
        settings_saved: "సెట్టింగ్‌లు విజయవంతంగా సేవ్ చేయబడ్డాయి!",
    }
};

// Default site settings and content
let siteSettings = {
    logoUrl: 'https://placehold.co/80x80/d32f2f/ffffff?text=BCT',
    quickLinks: [
        { text: 'About Us', href: '#/about' },
        { text: 'Contact Us', href: '#/contact' },
        { text: 'Privacy Policy', href: '#/privacy' }
    ],
    followUs: [
        { platform: 'Facebook', href: 'https://facebook.com' },
        { platform: 'Twitter', href: 'https://x.com' }
    ],
    tickerItems: {
        en: [
            "India's Economy Shows Robust Growth in Q2",
            "New AI Breakthrough in Medical Diagnostics",
            "Parliament Passes Landmark Environmental Bill"
        ],
        te: [
            "భారత ఆర్థిక వ్యవస్థ Q2లో బలమైన వృద్ధి",
            "వైద్య నిర్ధారణలో కొత్త AI ఆవిష్కరణ",
            "పార్లమెంటు చారిత్రాత్మక పర్యావరణ బిల్లును ఆమోదించింది"
        ]
    },
    pages: {
        about: {
            en: { title: "About Us", content: "## About BC TODAY\n\n[**Please edit this section.**]\n\nWelcome to our news portal. Founded in 2024, our mission is to deliver accurate, unbiased, and timely news to our readers. Our team of dedicated journalists works tirelessly to bring you the most important stories from around the corner and around the world.\n\n### Our Mission\n\nTo inform, educate, and engage our community through high-quality journalism.\n\n### Our Team\n\nOur team consists of experienced editors, reporters, and photographers passionate about telling stories that matter." },
            te: { title: "మా గురించి", content: "## బీసీ టుడే గురించి\n\n[**దయచేసి ఈ విభాగాన్ని సవరించండి.**]\n\nమా న్యూస్ పోర్టల్‌కు స్వాగతం. 2024లో స్థాపించబడిన మా లక్ష్యం, మా పాఠకులకు ఖచ్చితమైన, నిష్పక్షపాతమైన మరియు సకాలంలో వార్తలను అందించడం. మా అంకితభావంతో కూడిన పాత్రికేయుల బృందం మీకు స్థానిక మరియు ప్రపంచవ్యాప్తంగా అత్యంత ముఖ్యమైన కథనాలను అందించడానికి అవిశ్రాంతంగా పనిచేస్తుంది.\n\n### మా లక్ష్యం\n\nనాణ్యమైన జర్నలిజం ద్వారా మా సమాజాన్ని తెలియజేయడం, విద్యావంతులను చేయడం మరియు నిమగ్నం చేయడం.\n\n### మా బృందం\n\nమా బృందంలో అనుభవజ్ఞులైన సంపాదకులు, విలేకరులు మరియు ఫోటోగ్రాఫర్‌లు ముఖ్యమైన కథలను చెప్పడంలో ఉత్సాహంగా ఉన్నారు." }
        },
        contact: {
            en: { title: "Contact Us", content: "## Get in Touch\n\n[**Please edit this section with your contact details.**]\n\nWe value our readers and welcome your feedback, questions, or news tips. Please feel free to reach out to us through any of the channels below.\n\n* **Address:** 123 News Lane, Jubilee Hills, Hyderabad, Telangana, 500033, India\n* **General Inquiries:** contact@bc-today.demo\n* **News Desk:** newsdesk@bc-today.demo\n* **Advertising:** ads@bc-today.demo\n* **Phone:** +91-40-12345678" },
            te: { title: "మమ్మల్ని సంప్రదించండి", content: "## మమ్మల్ని సంప్రదించండి\n\n[**దయచేసి ఈ విభాగాన్ని మీ సంప్రదింపు వివరాలతో సవరించండి.**]\n\nమేము మా పాఠకులను గౌరవిస్తాము మరియు మీ అభిప్రాయాన్ని, ప్రశ్నలను లేదా వార్తల చిట్కాలను స్వాగతిస్తాము. దయచేసి దిగువన ఉన్న ఏవైనా మార్గాల ద్వారా మమ్మల్ని సంప్రదించడానికి సంకోచించకండి.\n\n* **చిరునామా:** 123 న్యూస్ లేన్, జూబ్లీ హిల్స్, హైదరాబాద్, తెలంగాణ, 500033, భారతదేశం\n* **సాధారణ విచారణలు:** contact@bc-today.demo\n* **వార్తా విభాగం:** newsdesk@bc-today.demo\n* **ప్రకటనలు:** ads@bc-today.demo\n* **ఫోన్:** +91-40-12345678" }
        },
        privacy: {
            en: { title: "Privacy Policy", content: "## Privacy Policy\n\n[**Please edit this section. This is a template and not legal advice.**]\n\n**Last updated:** July 21, 2025\n\nYour privacy is important to us. It is BC TODAY's policy to respect your privacy regarding any information we may collect from you across our website...\n\n### Information We Collect\n\nWe may collect personal identification information (Name, email address, phone number, etc.) from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, subscribe to the newsletter, and in connection with other activities, services, features or resources we make available on our Site.\n\n### How We Use Your Information\n\nWe use the information we collect to personalize your experience, to improve our website, and to send periodic emails." },
            te: { title: "గోప్యతా విధానం", content: "## గోప్యతా విధానం\n\n[**దయచేసి ఈ విభాగాన్ని సవరించండి. ఇది ఒక నమూనా మాత్రమే మరియు న్యాయ సలహా కాదు.**]\n\n**చివరిగా నవీకరించబడింది:** జూలై 21, 2025\n\nమీ గోప్యత మాకు ముఖ్యం. మా వెబ్‌సైట్‌లో మేము మీ నుండి సేకరించగల ఏదైనా సమాచారానికి సంబంధించి మీ గోప్యతను గౌరవించడం బీసీ టుడే విధానం...\n\n### మేము సేకరించే సమాచారం\n\nవినియోగదారులు మా సైట్‌ను సందర్శించినప్పుడు, సైట్‌లో నమోదు చేసుకున్నప్పుడు, వార్తాలేఖకు సభ్యత్వాన్ని పొందినప్పుడు మరియు మా సైట్‌లో మేము అందుబాటులో ఉంచే ఇతర కార్యకలాపాలు, సేవలు, ఫీచర్లు లేదా వనరులకు సంబంధించి మేము వినియోగదారుల నుండి వ్యక్తిగత గుర్తింపు సమాచారాన్ని (పేరు, ఇమెయిల్ చిరునామా, ఫోన్ నంబర్ మొదలైనవి) వివిధ మార్గాల్లో సేకరించవచ్చు.\n\n### మేము మీ సమాచారాన్ని ఎలా ఉపయోగిస్తాము\n\nమీ అనుభవాన్ని వ్యక్తిగతీకరించడానికి, మా వెబ్‌సైట్‌ను మెరుగుపరచడానికి మరియు క్రమానుగత ఇమెయిల్‌లను పంపడానికి మేము సేకరించిన సమాచారాన్ని ఉపయోగిస్తాము." }
        }
    },
    epapers: [
        { date: '2025-07-21', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { date: '2025-07-20', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { date: '2025-07-19', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ]
};

// All news articles, structured by section
let sections = [
    {
        id: 'home',
        isNav: true,
        en: { title: 'Home' }, te: { title: 'హోమ్' },
    },
    {
        id: 'top-stories',
        theme: 'blue',
        isTopStory: true,
        en: { title: 'Top Stories' },
        te: { title: 'ప్రధాన వార్తలు' },
        articles: [
            { id: 'ts1', views: 50, img: 'https://placehold.co/800x400/337ab7/ffffff?text=Economy', time: '2 hours ago', en: { title: "India's Economy Shows Robust Growth in Q2", author: 'Anjali Sharma', fullStory: "India's economy has demonstrated significant resilience and growth in the second quarter, according to the latest government data.\nKey sectors such as manufacturing and services have outperformed expectations, contributing to a GDP growth rate of 7.8%. This positive trend is expected to continue, with economists forecasting a strong second half of the year."}, te: { title: "భారత ఆర్థిక వ్యవస్థ Q2లో బలమైన వృద్ధి", author: 'అంజలి శర్మ', fullStory: "తాజా ప్రభుత్వ గణాంకాల ప్రకారం, భారత ఆర్థిక వ్యవస్థ రెండవ త్రైమాసికంలో గణనీయమైన స్థితిస్థాపకత మరియు వృద్ధిని ప్రదర్శించింది.\nతయారీ మరియు సేవల వంటి కీలక రంగాలు అంచనాలను మించి రాణించాయి, ఇది 7.8% జీడీపీ వృద్ధి రేటుకు దోహదపడింది. ఈ సానుకూల ధోరణి కొనసాగుతుందని భావిస్తున్నారు, ఆర్థికవేత్తలు సంవత్సరం రెండవ భాగంలో బలమైన వృద్ధిని అంచనా వేస్తున్నారు."} },
            { id: 'ts2', views: 32, img: 'https://placehold.co/800x400/5cb85c/ffffff?text=Technology', time: '5 hours ago', en: { title: 'New AI Breakthrough in Medical Diagnostics', author: 'Raj Patel', fullStory: "Researchers have announced a major breakthrough in artificial intelligence that could revolutionize medical diagnostics.\nThe new AI model can detect early signs of diseases like cancer and Alzheimer's with over 95% accuracy from medical scans, promising faster and more reliable diagnoses for patients worldwide."}, te: { title: 'వైద్య నిర్ధారణలో కొత్త AI ఆవిష్కరణ', author: 'రాజ్ పటేల్', fullStory: "వైద్య నిర్ధారణలో విప్లవాత్మక మార్పులు తీసుకురాగల కృత్రిమ మేధస్సులో ఒక పెద్ద పురోగతిని పరిశోధకులు ప్రకటించారు.\nకొత్త AI మోడల్ క్యాన్సర్ మరియు అల్జీమర్స్ వంటి వ్యాధుల ప్రారంభ సంకేతాలను మెడికల్ స్కాన్‌ల నుండి 95% పైగా ఖచ్చితత్వంతో గుర్తించగలదు, ఇది ప్రపంచవ్యాప్తంగా రోగులకు వేగవంతమైన మరియు మరింత నమ్మకమైన నిర్ధారణలను వాగ్దానం చేస్తుంది."} },
            { id: 'ts3', views: 45, img: 'https://placehold.co/800x400/f0ad4e/ffffff?text=Politics', time: '8 hours ago', en: { title: 'Parliament Passes Landmark Environmental Bill', author: 'Priya Singh', fullStory: "In a historic move, the Parliament has passed a new environmental protection bill aimed at curbing carbon emissions and promoting renewable energy.\nThe bill introduces stricter regulations for industries and provides incentives for green technologies, marking a significant step in the country's fight against climate change."}, te: { title: 'పార్లమెంటు చారిత్రాత్మక పర్యావరణ బిల్లును ఆమోదించింది', author: 'ప్రియా సింగ్', fullStory: "ఒక చారిత్రాత్మక చర్యలో, కర్బన ఉద్గారాలను అరికట్టడం మరియు పునరుత్పాదక ఇంధనాన్ని ప్రోత్సహించడం లక్ష్యంగా పార్లమెంటు ఒక కొత్త పర్యావరణ పరిరక్షణ బిల్లును ఆమోదించింది.\nఈ బిల్లు పరిశ్రమలకు కఠినమైన నిబంధనలను ప్రవేశపెడుతుంది మరియు హరిత సాంకేతికతలకు ప్రోత్సాహకాలను అందిస్తుంది, ఇది వాతావరణ మార్పులపై దేశం యొక్క పోరాటంలో ఒక ముఖ్యమైన అడుగు."} }
        ]
    },
    {
        id: 'local-news',
        isNav: true,
        theme: 'orange',
        en: { title: 'Local News' }, te: { title: 'స్థానిక వార్తలు' },
        articles: [
            { id: 'ln1', views: 28, img: 'https://placehold.co/400x250/f0ad4e/ffffff?text=Hyderabad', time: '1 day ago', en: { title: 'New Metro Line Inaugurated in Hyderabad', author: 'Sanjay Kumar', fullStory: 'A new metro line connecting Hitec City to the airport was inaugurated today, promising to ease traffic congestion.'}, te: { title: 'హైదరాబాద్‌లో కొత్త మెట్రో లైన్ ప్రారంభం', author: 'సంజయ్ కుమార్', fullStory: 'హైటెక్ సిటీని విమానాశ్రయంతో కలిపే కొత్త మెట్రో లైన్ ఈరోజు ప్రారంభించబడింది, ఇది ట్రాఫిక్ రద్దీని తగ్గించగలదని వాగ్దానం చేస్తుంది.'} }
        ]
    },
    {
        id: 'bc-events',
        theme: 'cyan',
        en: { title: 'BC Events' },
        te: { title: 'బీసీ ఈవెంట్స్' },
        articles: [
            { id: 'bce1', views: 10, img: 'https://placehold.co/400x250/17a2b8/ffffff?text=Event', time: 'Next Week', en: { title: "Community Meeting in Jubilee Hills", author: 'BC TODAY Staff', fullStory: 'A community meeting will be held to discuss local development projects.'}, te: { title: "జూబ్లీ హిల్స్‌లో కమ్యూనిటీ మీటింగ్", author: 'బీసీ టుడే సిబ్బంది', fullStory: 'స్థానిక అభివృద్ధి ప్రాజెక్టులపై చర్చించడానికి ఒక కమ్యూనిటీ సమావేశం నిర్వహించబడుతుంది.'} },
            { id: 'bce2', views: 5, img: 'https://placehold.co/400x250/17a2b8/ffffff?text=Event', time: 'This Weekend', en: { title: "Charity Drive for Education", author: 'BC TODAY Staff', fullStory: 'Join us for a charity drive to support underprivileged students.'}, te: { title: "విద్యా కోసం ఛారిటీ డ్రైవ్", author: 'బీసీ టుడే సిబ్బంది', fullStory: 'పేద విద్యార్థులకు మద్దతు ఇవ్వడానికి మా ఛారిటీ డ్రైవ్‌లో చేరండి.'} }
        ]
    },
    {
        id: 'world',
        isNav: true,
        theme: 'green',
        en: { title: 'World' }, te: { title: 'ప్రపంచ' },
        articles: [
            { id: 'wn1', views: 15, img: 'https://placehold.co/400x250/5cb85c/ffffff?text=World', time: '4 hours ago', en: { title: 'EU Leaders Discuss Climate Policy', author: 'John Doe', fullStory: 'European Union leaders are meeting in Brussels to discuss a new, more ambitious climate policy for the bloc.'}, te: { title: 'EU నాయకులు వాతావరణ విధానంపై చర్చించారు', author: 'జాన్ డో', fullStory: 'యూరోపియన్ యూనియన్ నాయకులు బ్లాక్ కోసం ఒక కొత్త, మరింత ప్రతిష్టాత్మకమైన వాతావరణ విధానంపై చర్చించడానికి బ్రస్సెల్స్‌లో సమావేశమవుతున్నారు.'} }
        ]
    },
    {
        id: 'business',
        isNav: true,
        theme: 'indigo',
        en: { title: 'Business' }, te: { title: 'వ్యాపార' },
        articles: [
            { id: 'bn1', views: 22, img: 'https://placehold.co/400x250/3f51b5/ffffff?text=Business', time: '6 hours ago', en: { title: 'Stock Market Hits Record High', author: 'Emily White', fullStory: 'The stock market surged to a new record high today, driven by strong corporate earnings and positive economic data.'}, te: { title: 'స్టాక్ మార్కెట్ రికార్డు స్థాయికి చేరుకుంది', author: 'ఎమిలీ వైట్', fullStory: 'బలమైన కార్పొరేట్ ఆదాయాలు మరియు సానుకూల ఆర్థిక డేటా ద్వారా నడపబడిన స్టాక్ మార్కెట్ ఈరోజు కొత్త రికార్డు స్థాయికి పెరిగింది.'} }
        ]
    },
    {
        id: 'sports',
        isNav: true,
        theme: 'red',
        en: { title: 'Sports' }, te: { title: 'క్రీడలు' },
        articles: [
            { id: 'sn1', views: 41, img: 'https://placehold.co/400x250/d9534f/ffffff?text=Sports', time: '1 hour ago', en: { title: 'Cricket Team Wins Test Series', author: 'Ravi Kumar', fullStory: 'The national cricket team secured a historic test series victory abroad after a thrilling final match.'}, te: { title: 'టెస్ట్ సిరీస్‌ను గెలుచుకున్న క్రికెట్ జట్టు', author: 'రవి కుమార్', fullStory: 'ఒక ఉత్కంఠభరితమైన చివరి మ్యాచ్ తర్వాత జాతీయ క్రికెట్ జట్టు విదేశాలలో చారిత్రాత్మక టెస్ట్ సిరీస్ విజయాన్ని సాధించింది.'} }
        ]
    },
    {
        id: 'cinema',
        isNav: true,
        theme: 'yellow',
        en: { title: 'Cinema' }, te: { title: 'సినిమా' },
        articles: [
            { id: 'cn1', views: 68, img: 'https://placehold.co/400x250/ffeb3b/000000?text=Cinema', time: '3 hours ago', en: { title: 'New Sci-Fi Movie Trailer Released', author: 'Cinema Desk', fullStory: 'The much-anticipated trailer for the sci-fi epic "Galaxy\'s Edge" has been released, stunning fans with its visual effects.'}, te: { title: 'కొత్త సైన్స్ ఫిక్షన్ సినిమా ట్రైలర్ విడుదల', author: 'సినిమా డెస్క్', fullStory: '"గెలాక్సీస్ ఎడ్జ్" అనే సైన్స్ ఫిక్షన్ ఇతిహాసం కోసం ఎంతో ఆసక్తిగా ఎదురుచూస్తున్న ట్రైలర్ విడుదలైంది, ఇది దాని విజువల్ ఎఫెక్ట్స్‌తో అభిమానులను ఆశ్చర్యపరిచింది.'} }
        ]
    },
    {
        id: 'opinion',
        isNav: true,
        theme: 'purple',
        en: { title: 'Opinion' }, te: { title: 'అభిప్రాయం' },
        articles: [
            { id: 'on1', views: 18, img: 'https://placehold.co/400x250/6f42c1/ffffff?text=Opinion', time: '9 hours ago', en: { title: 'The Future of Work is Hybrid', author: 'Editorial Board', fullStory: 'The pandemic has reshaped our work culture, and the hybrid model is here to stay, offering flexibility and better work-life balance.'}, te: { title: 'పని యొక్క భవిష్యత్తు హైబ్రిడ్', author: 'సంపాదకీయ మండలి', fullStory: 'మహమ్మారి మన పని సంస్కృతిని పునర్నిర్మించింది, మరియు హైబ్రిడ్ మోడల్ ఇక్కడ ఉండటానికి ఉంది, ఇది సౌలభ్యం మరియు మెరుగైన పని-జీవిత సమతుల్యతను అందిస్తుంది.'} }
        ]
    },
    {
        id: 'epaper',
        isNav: true,
        en: { title: 'E-Paper' }, te: { title: 'E-Paper' },
    }
];

// --- Utility Functions ---
const getArticleByIds = (sectionId, articleId) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.articles.find(a => a.id === articleId) : null;
};

const getT = (key) => translations[currentLanguage][key] || translations['en'][key] || key;


// --- Routing ---
function router() {
    const path = location.hash.slice(1) || '/';
    const parts = path.split('/').filter(p => p);
    
    document.querySelectorAll('.page-view').forEach(view => view.style.display = 'none');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

    let currentViewId = 'home-view';
    let navId = 'home';

    if (parts[0] === 'article' && parts.length === 3) {
        const [, sectionId, articleId] = parts;
        const article = getArticleByIds(sectionId, articleId);
        if (article) {
            renderArticlePage(article, sectionId);
            currentViewId = 'article-view';
        } else {
            renderHomePage();
        }
    } else if (['about', 'contact', 'privacy', 'login', 'epaper', 'settings'].includes(parts[0])) {
        currentViewId = `${parts[0]}-view`;
        if (parts[0] === 'about') renderStaticPage('about');
        if (parts[0] === 'contact') renderStaticPage('contact');
        if (parts[0] === 'privacy') renderStaticPage('privacy');
        if (parts[0] === 'epaper') renderEPaperPage();
        if (parts[0] === 'settings') renderSettingsPage();
        navId = parts[0]; // Highlight nav item if it exists
    } else if (parts[0] === 'search' && parts.length > 1) {
        const query = decodeURIComponent(parts[1] || '');
        renderCategoryPage(null, query);
        currentViewId = 'category-view';
    } else if (sections.some(s => s.id === parts[0])) {
        renderCategoryPage(parts[0]);
        currentViewId = 'category-view';
        navId = parts[0];
    } else {
        renderHomePage();
    }
    
    const viewElement = document.getElementById(currentViewId);
    if(viewElement) {
        viewElement.style.display = 'block';
    } else {
        document.getElementById('home-view').style.display = 'block';
    }

    const activeNavLink = document.querySelector(`.nav-link[data-nav-id="${navId}"]`);
    if (activeNavLink) activeNavLink.classList.add('active');
    window.scrollTo(0, 0);
}

// --- Language, Date, and UI Updates ---
function switchLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.body.classList.toggle('lang-te', lang === 'te');
    document.body.classList.toggle('lang-en', lang === 'en');
    
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.getAttribute('data-lang-key');
        el.innerHTML = getT(key);
    });
    
    document.getElementById('site-title').innerText = getT('site_title');
    document.title = getT('site_title');
    
    updateDate();
    updateLogo();
    renderNav();
    renderAndAnimateTicker();
    renderFooter();
    updateHeaderUI();
    renderModals();
}

function updateDate() {
    const now = new Date();
    const dateElement = document.getElementById('current-date');
    if (currentLanguage === 'te') {
        const teluguDays = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];
        const teluguMonths = ['జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్', 'జూలై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'];
        dateElement.textContent = `${teluguDays[now.getDay()]}, ${now.getDate()} ${teluguMonths[now.getMonth()]} ${now.getFullYear()}`;
    } else {
        dateElement.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
}

// --- Ticker Functions ---
function renderAndAnimateTicker() {
    if (tickerAnimationId) {
        cancelAnimationFrame(tickerAnimationId);
    }

    const tickerContent = document.getElementById('news-ticker-content');
    // "BREAKING" is now hardcoded in translations for both languages
    const breakingKey = getT('breaking'); 
    const items = siteSettings.tickerItems[currentLanguage] || siteSettings.tickerItems.en;

    let tickerHtml = items.map(item => 
        `<span class="mx-8 inline-flex items-center">
            <span class="bg-white/90 text-red-700 px-2 py-1 text-xs font-bold rounded mr-3 flex-shrink-0">${breakingKey}</span>
            ${item}
        </span>`
    ).join('');
    
    tickerContent.innerHTML = tickerHtml;

    const contentWidth = tickerContent.offsetWidth;
    const containerWidth = document.getElementById('news-ticker-container').offsetWidth;

    if (contentWidth > 0 && containerWidth > 0 && contentWidth < containerWidth) {
         const repeatCount = Math.ceil(containerWidth / contentWidth) + 1;
         tickerContent.innerHTML = tickerHtml.repeat(repeatCount);
    }
    tickerContent.innerHTML += tickerContent.innerHTML;

    let position = 0;
    const speed = 0.5;

    function animateTicker() {
        position -= speed;
        const totalWidth = tickerContent.scrollWidth / 2;
        
        if (totalWidth > 0 && Math.abs(position) >= totalWidth) {
            position = 0;
        }
        
        tickerContent.style.transform = `translateX(${position}px)`;
        
        tickerAnimationId = requestAnimationFrame(animateTicker);
    }

    animateTicker();
}


// --- Rendering Functions ---

function updateLogo() {
    document.getElementById('logo-img').src = siteSettings.logoUrl;
}

function renderNav() {
    const navContainer = document.getElementById('nav-links-container');
    const navItems = sections.filter(s => s.isNav);
    navContainer.innerHTML = navItems.map(item => {
        const href = item.id === 'home' ? '#' : `#/${item.id}`;
        // Use the item's ID for the data-lang-key if it's a common English word, otherwise use the title.
        const langKey = (['epaper'].includes(item.id)) ? item.id : (item.en.title.toLowerCase().replace(' ', '_'));
        return `<a href="${href}" class="nav-link font-semibold uppercase text-sm mx-3 flex-shrink-0" data-lang-key="${langKey}" data-nav-id="${item.id}">${item[currentLanguage].title}</a>`;
    }).join('');
    
    // Add "Add New Article" button for admin
    if (loggedInUserType === 'admin') {
        navContainer.innerHTML += `<button onclick="openAddModal()" class="ml-auto bg-white/20 hover:bg-white/30 text-white font-bold py-1 px-3 rounded text-sm flex-shrink-0">${getT('add_new_article')}</button>`;
    }
}

function createArticleCard(article, section, isHorizontal = false) {
    const currentArticle = article[currentLanguage];
    const layoutClass = isHorizontal ? 'md:flex' : '';
    const imgContainerClass = isHorizontal ? 'md:w-1/3 flex-shrink-0' : '';
    const imgClass = isHorizontal ? 'w-full h-full object-cover' : 'w-full h-48 object-cover';
    const contentClass = isHorizontal ? 'p-4 flex flex-col justify-between' : 'p-4 relative';

    return `
        <div class="article-card rounded-lg shadow-lg overflow-hidden h-full ${layoutClass}" onclick="navigateToArticle('${section.id}', '${article.id}')">
            <div class="${imgContainerClass}">
                <img src="${article.img}" alt="${currentArticle.title}" class="${imgClass}" onerror="this.onerror=null;this.src='https://placehold.co/400x250/cccccc/ffffff?text=Image+Error';">
            </div>
            <div class="${contentClass}">
                <div>
                    <h3 class="font-playfair font-bold text-xl mb-2">${currentArticle.title}</h3>
                    <p class="text-sm opacity-60">${article.time}</p>
                </div>
                <button onclick="openEditModal(event, '${section.id}', '${article.id}')" class="edit-button absolute top-2 right-2 bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 z-10">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                </button>
            </div>
        </div>`;
}

function renderHomePage() {
    const mainContentCol = document.getElementById('main-content-col');
    mainContentCol.innerHTML = '';
    const themeColors = { blue: 'border-blue-600', orange: 'border-orange-500', green: 'border-green-500', indigo: 'border-indigo-500', red: 'border-red-500', purple: 'border-purple-600', yellow: 'border-yellow-500', cyan: 'border-cyan-500' };

    // Top Stories Slideshow
    const topStoriesSection = sections.find(s => s.isTopStory);
    if (topStoriesSection && topStoriesSection.articles.length > 0) {
        const slidesHtml = topStoriesSection.articles.map((article, index) => {
            const mainArticle = article[currentLanguage];
            return `
            <div class="slide ${index === 0 ? 'active' : ''}">
                <div class="article-card rounded-lg shadow-lg overflow-hidden" onclick="navigateToArticle('${topStoriesSection.id}', '${article.id}')">
                    <img src="${article.img}" alt="${mainArticle.title}" class="w-full h-64 md:h-96 object-cover">
                    <div class="p-6 relative">
                        <h3 class="font-playfair text-2xl md:text-3xl font-bold mb-2">${mainArticle.title}</h3>
                        <p class="mb-4 opacity-80">${mainArticle.fullStory.split('\n')[0].substring(0, 150)}...</p>
                        <p class="text-sm opacity-60">${getT('author')}: ${mainArticle.author} | ${article.time}</p>
                        <button onclick="openEditModal(event, '${topStoriesSection.id}', '${article.id}')" class="edit-button absolute top-4 right-4 bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('');
        const dotsHtml = topStoriesSection.articles.map((_, index) => `<span class="dot ${index === 0 ? 'active' : ''}" onclick="currentSlide(${index})"></span>`).join('');
        mainContentCol.innerHTML += `
            <section class="mb-12">
                <div class="slideshow-container rounded-lg shadow-lg">
                    ${slidesHtml}
                    <div class="dots-container">${dotsHtml}</div>
                </div>
            </section>`;
    }
    
    // Other Sections
    sections.filter(s => !s.isTopStory && s.articles && s.articles.length > 0).forEach(section => {
        const langContent = section[currentLanguage];
        const sectionHtml = `
            <section id="${section.id}" class="mb-12">
                <h2 class="font-playfair text-3xl font-bold ${themeColors[section.theme] || 'border-gray-800'} border-b-4 pb-2 mb-6">${langContent.title}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${section.articles.map(article => createArticleCard(article, section)).join('')}
                </div>
            </section>`;
        mainContentCol.innerHTML += sectionHtml;
        if (section.id === 'local-news') {
            mainContentCol.innerHTML += `<div class="ad-placeholder ad-placeholder-in-feed">In-Feed Ad</div>`;
        }
    });

    renderSidebar();
    startSlideshow();
}

function renderSidebar() {
    const sidebarCol = document.getElementById('sidebar-col');
    
    // BC Events Section
    const bcEventsSection = sections.find(s => s.id === 'bc-events');
    let bcEventsHtml = '';
    if (bcEventsSection && bcEventsSection.articles) {
        const eventsArticlesHtml = bcEventsSection.articles.slice(0, 5).map(article => {
            const articleLang = article[currentLanguage];
            const section = sections.find(s => s.articles && s.articles.includes(article));
            return `
            <div class="mb-4 pb-4 border-b border-[var(--border-color)] last:border-b-0 last:pb-0 last:mb-0 cursor-pointer group" onclick="navigateToArticle('${section.id}', '${article.id}')">
                <h4 class="font-bold group-hover:underline">${articleLang.title}</h4>
                <p class="text-sm opacity-60">${article.time}</p>
            </div>`;
        }).join('');

        bcEventsHtml = `
        <div class="p-4 rounded-lg shadow-lg article-card mb-8">
            <h3 class="font-playfair text-2xl font-bold border-b-4 border-cyan-500 pb-2 mb-4">${bcEventsSection[currentLanguage].title}</h3>
            ${eventsArticlesHtml}
        </div>`;
    }

    // Most Read Section
    const allArticles = sections.flatMap(s => s.articles || []);
    const sortedArticles = allArticles.sort((a, b) => b.views - a.views).slice(0, 5);

    const mostReadArticlesHtml = sortedArticles.map(article => {
        const articleLang = article[currentLanguage];
        const section = sections.find(s => s.articles && s.articles.includes(article));
        return `
            <div class="mb-4 pb-4 border-b border-[var(--border-color)] last:border-b-0 last:pb-0 last:mb-0 cursor-pointer group" onclick="navigateToArticle('${section.id}', '${article.id}')">
                <h4 class="font-bold group-hover:underline">${articleLang.title}</h4>
                <p class="text-sm opacity-60">${article.time}</p>
            </div>`;
    }).join('');

    const mostReadBoxHtml = `
        <div class="p-4 rounded-lg shadow-lg article-card mb-8 sticky top-24">
            <h3 class="font-playfair text-2xl font-bold border-b-4 border-red-500 pb-2 mb-4">${getT('most_read')}</h3>
            ${mostReadArticlesHtml}
        </div>`;

    // Combine and render
    sidebarCol.innerHTML = bcEventsHtml + mostReadBoxHtml;
}

function renderCategoryPage(sectionId, searchQuery = null) {
    const viewTitle = document.getElementById('category-title');
    const viewContent = document.getElementById('category-content');
    let results = [];
    let sectionData = null;

    if (searchQuery) {
        viewTitle.innerHTML = `${getT('search_results_for')}: <span class="text-blue-600 dark:text-blue-400">${searchQuery}</span>`;
        const lowerQuery = searchQuery.toLowerCase();
        results = sections.flatMap(s => s.articles ? s.articles.map(a => ({ ...a, section: s })) : [])
            .filter(a => a.en.title.toLowerCase().includes(lowerQuery) || a.te.title.toLowerCase().includes(lowerQuery) || a.en.fullStory.toLowerCase().includes(lowerQuery) || a.te.fullStory.toLowerCase().includes(lowerQuery));
    } else {
        sectionData = sections.find(s => s.id === sectionId);
        if (!sectionData) { router(); return; }
        viewTitle.innerText = sectionData[currentLanguage].title;
        results = (sectionData.articles || []).map(a => ({ ...a, section: sectionData }));
    }

    if (results.length === 0) {
        viewContent.innerHTML = `<p class="col-span-full">${getT('no_results')}</p>`;
        return;
    }

    viewContent.innerHTML = results.map(article => createArticleCard(article, article.section, true)).join('');
}

function renderArticlePage(article, sectionId) {
    const articleContentEl = document.getElementById('article-content');
    const articleSidebarEl = document.getElementById('article-sidebar');
    const articleLang = article[currentLanguage];
    const articleUrl = encodeURIComponent(window.location.href);
    const articleTitle = encodeURIComponent(articleLang.title);
    
    const paragraphs = marked.parse(articleLang.fullStory.replace(/\n/g, '\n\n'));

    articleContentEl.innerHTML = `
        <h1 class="font-playfair text-4xl md:text-5xl font-bold mb-4">${articleLang.title}</h1>
        <p class="opacity-60 mb-4">${getT('author')}: ${articleLang.author} | ${article.time}</p>
        <div class="flex gap-4 mb-6">
            <a href="https://www.facebook.com/sharer/sharer.php?u=${articleUrl}" target="_blank" class="p-2 bg-blue-800 text-white rounded-full w-10 h-10 flex items-center justify-center"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a4 4 0 0 0-4 4v2.01h-3l-.396 3.98h3.396v8.01Z"></path></svg></a>
            <a href="https://twitter.com/intent/tweet?url=${articleUrl}&text=${articleTitle}" target="_blank" class="p-2 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.6.75h2.478l-5.36 6.142L16 15.25h-4.937l-3.867-5.073L2.5 15.25H.021l5.898-6.816L0 0.75h5.063l3.495 4.631L12.6.75Zm-.806 13.022h1.22L4.386 2.02h-1.6l7.89 11.752Z"></path></svg></a>
            <a href="https://api.whatsapp.com/send?text=${articleTitle}%20${articleUrl}" target="_blank" class="p-2 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16.75 13.96c.25.42.42.58.59.67.33.17.59.25.84.25.33 0 .59-.08.75-.25.25-.25.25-.59.25-.92 0-.25-.08-.5-.25-.75l-.42-.42c-.25-.25-.5-.42-.75-.59l-1.17-1.17c-.17-.17-.33-.33-.5-.5s-.25-.33-.33-.5a.42.42 0 0 1 0-.42c.08-.17.25-.33.42-.5l.25-.25c.17-.17.25-.33.33-.5.17-.25.17-.5 0-.75a1.17 1.17 0 0 0-.5-.5c-.25-.08-.5-.08-.75 0l-.5.08c-.25.08-.5.25-.75.42l-.42.5c-.17.25-.33.5-.5.75s-.25.5-.33.75c-.08.25-.17.42-.17.59 0 .25.08.5.25.75l.42.42c.25.25.5.42.75.59l1.17 1.17c.17.17.33.33.5.5s.25.33.33.5c.08.17.08.33 0 .5-.08.17-.25.33-.42.5l-.25.25c-.17.17-.25.33-.33.5a.9.9 0 0 0 0 .75c.17.25.42.42.75.5.25.08.58.08.92 0 .33-.08.58-.25.75-.42.17-.17.33-.33.5-.59s.25-.5.33-.75c.08-.25.08-.5 0-.75l-.42-.42ZM12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"></path></svg></a>
        </div>
        <img src="${article.img}" alt="${articleLang.title}" class="w-full h-auto max-h-[500px] object-cover rounded-lg mb-8">
        <div class="prose max-w-none text-lg leading-relaxed dark:prose-invert">${paragraphs}</div>
        <div class="ad-placeholder ad-placeholder-in-article mt-8">In-Article Ad (300x250)</div>
    `;
    
    // Render related stories
    const section = sections.find(s => s.id === sectionId);
    const relatedArticles = section.articles.filter(a => a.id !== article.id).slice(0, 4);
    const relatedHtml = relatedArticles.map(relArt => {
        const relArtLang = relArt[currentLanguage];
        return `<div class="mb-4 pb-4 border-b border-[var(--border-color)] last:border-b-0 cursor-pointer group" onclick="navigateToArticle('${section.id}', '${relArt.id}')">
                    <h4 class="font-bold group-hover:underline">${relArtLang.title}</h4>
                </div>`;
    }).join('');

    articleSidebarEl.innerHTML = `
        <div class="p-4 rounded-lg shadow-lg article-card sticky top-24">
            <h3 class="font-playfair text-2xl font-bold border-b-4 border-blue-500 pb-2 mb-4">${getT('related_stories')}</h3>
            ${relatedHtml || `<p class="opacity-70">${getT('no_results')}</p>`}
        </div>`;
}

function renderFooter() {
    const footerContent = document.getElementById('footer-content');
    
    const quickLinksHtml = siteSettings.quickLinks.map(link => 
        `<li class="mb-2"><a href="${link.href}" class="hover:text-blue-400" data-lang-key="${link.text.toLowerCase().replace(' ', '_')}">${getT(link.text.toLowerCase().replace(' ', '_'))}</a></li>`
    ).join('');

    const socialIcons = {
        Facebook: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" /></svg>`,
        Twitter: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>`
    };
    const followUsHtml = siteSettings.followUs.map(link => 
        `<a href="${link.href}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white">${socialIcons[link.platform] || ''}</a>`
    ).join('');

    footerContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            <div>
                <h3 id="footer-site-title" class="font-playfair text-2xl font-bold mb-2">${getT('site_title')}</h3>
                <p id="footer-tagline" class="text-gray-400">${getT('footer_tagline')}</p>
            </div>
            <div>
                <h4 class="font-bold uppercase mb-3" data-lang-key="quick_links">${getT('quick_links')}</h4>
                <ul id="footer-quick-links">${quickLinksHtml}</ul>
            </div>
            <div>
                <h4 class="font-bold uppercase mb-3" data-lang-key="follow_us">${getT('follow_us')}</h4>
                <div id="footer-follow-us" class="flex justify-center md:justify-start space-x-4">${followUsHtml}</div>
            </div>
            <div>
                <h4 class="font-bold uppercase mb-3" data-lang-key="staff_login">${getT('staff_login')}</h4>
                <div id="admin-tools" class="hidden">
                    <a href="#/settings" class="block text-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full" data-lang-key="settings">${getT('settings')}</a>
                </div>
                <p id="login-prompt" class="text-gray-400">Login as Staff to access admin tools.</p>
            </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500">
            <p>&copy; <span id="current-year">${new Date().getFullYear()}</span> <span id="footer-copyright-title">${getT('site_title')}</span>. <span data-lang-key="rights_reserved">${getT('rights_reserved')}</span></p>
        </div>
    `;
    
    if(loggedInUserType === 'admin') {
        document.getElementById('admin-tools').classList.remove('hidden');
        document.getElementById('login-prompt').classList.add('hidden');
    }
}

function renderStaticPage(pageKey) {
    const page = siteSettings.pages[pageKey][currentLanguage];
    const view = document.getElementById(`${pageKey}-view`);
    if (page && view) {
        view.innerHTML = `<div class="p-6 md:p-10 rounded-lg shadow-xl bg-[var(--card-bg-color)] prose max-w-none dark:prose-invert">${marked.parse(page.content)}</div>`;
    }
}

function renderEPaperPage() {
    const view = document.getElementById('epaper-view');
    const papersHtml = siteSettings.epapers.map(paper => `
        <div class="article-card p-4 rounded-lg shadow-lg mb-4 text-center">
            <a href="${paper.url}" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">
                <h3 class="font-bold text-xl">E-Paper for ${paper.date}</h3>
                <p>Click to view PDF</p>
            </a>
        </div>
    `).join('');
    view.innerHTML = `
        <h1 class="font-playfair text-4xl font-bold mb-6" data-lang-key="epaper">${getT('epaper')}</h1>
        <div>${papersHtml}</div>
    `;
}

// --- Slideshow ---
function startSlideshow() {
    clearInterval(slideInterval);
    slideIndex = 0;
    const slides = document.querySelectorAll("#home-view .slide");
    if (slides.length > 1) {
        slideInterval = setInterval(showSlides, 5000);
    }
}
function showSlides(n) {
    let slides = document.querySelectorAll("#home-view .slide");
    let dots = document.querySelectorAll("#home-view .dot");
    if (slides.length === 0) return;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slideIndex = (n !== undefined) ? n : slideIndex + 1;
    if (slideIndex >= slides.length) {slideIndex = 0}
    if (slideIndex < 0) { slideIndex = slides.length - 1 }
    
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}
function currentSlide(n) {
    showSlides(n);
    clearInterval(slideInterval);
    slideInterval = setInterval(() => showSlides(), 5000);
}

// --- Navigation ---
function navigateToArticle(sectionId, articleId) {
    const article = getArticleByIds(sectionId, articleId);
    if (!article) return;
    article.views = (article.views || 0) + 1;
    location.hash = `/article/${sectionId}/${article.id}`;
}

// --- Admin & Modals ---
function toggleEditMode() {
    if (loggedInUserType !== 'admin') return;
    isEditMode = !isEditMode;
    document.body.classList.toggle('edit-mode', isEditMode);
    const key = isEditMode ? 'disable_editing' : 'enable_editing';
    const toggleButton = document.getElementById('edit-mode-toggle');
    if (toggleButton) toggleButton.innerText = getT(key);
}

function openEditModal(event, sectionId, articleId) {
    event.stopPropagation();
    const article = getArticleByIds(sectionId, articleId);
    if (!article) return;
    const editModalEl = document.getElementById('edit-modal');
    editModalEl.classList.remove('hidden');
    
    editModalEl.querySelector('#edit-section-id').value = sectionId;
    editModalEl.querySelector('#edit-article-id').value = articleId;
    editModalEl.querySelector('#edit-title-en').value = article.en.title;
    editModalEl.querySelector('#edit-author-en').value = article.en.author;
    editModalEl.querySelector('#edit-fullStory-en').value = article.en.fullStory;
    editModalEl.querySelector('#edit-title-te').value = article.te.title;
    editModalEl.querySelector('#edit-author-te').value = article.te.author;
    editModalEl.querySelector('#edit-fullStory-te').value = article.te.fullStory;
    editModalEl.querySelector('#edit-img').value = article.img;
}

function openAddModal() {
    document.getElementById('add-modal').classList.remove('hidden');
}

function handleEditSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const sectionId = form.querySelector('#edit-section-id').value;
    const articleId = form.querySelector('#edit-article-id').value;
    
    const section = sections.find(s => s.id === sectionId);
    const article = section.articles.find(a => a.id === articleId);
    
    article.en.title = form.querySelector('#edit-title-en').value;
    article.en.author = form.querySelector('#edit-author-en').value;
    article.en.fullStory = form.querySelector('#edit-fullStory-en').value;
    article.te.title = form.querySelector('#edit-title-te').value;
    article.te.author = form.querySelector('#edit-author-te').value;
    article.te.fullStory = form.querySelector('#edit-fullStory-te').value;
    article.img = form.querySelector('#edit-img').value;
    
    document.getElementById('edit-modal').classList.add('hidden');
    router();
}

function handleAddSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const sectionId = form.querySelector('#add-section').value;
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newArticle = {
        id: `article-${Date.now()}`,
        img: form.querySelector('#add-img').value,
        time: 'Just now',
        views: 0,
        en: { title: form.querySelector('#add-title-en').value, author: form.querySelector('#add-author-en').value, fullStory: form.querySelector('#add-fullStory-en').value },
        te: { title: form.querySelector('#add-title-te').value, author: form.querySelector('#add-author-te').value, fullStory: form.querySelector('#add-fullStory-te').value }
    };

    if (!section.articles) {
        section.articles = [];
    }
    section.articles.unshift(newArticle);
    document.getElementById('add-modal').classList.add('hidden');
    form.reset();
    router();
}

function renderModals() {
    const t = (key) => getT(key);

    // Edit Modal
    document.getElementById('edit-modal').innerHTML = `
        <div class="modal-content">
            <h2 class="text-2xl font-bold mb-4">${t('edit_article')}</h2>
            <form id="edit-form">
                <input type="hidden" id="edit-section-id"><input type="hidden" id="edit-article-id">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 class="font-bold text-lg mb-2">English Content</h3>
                        <div class="mb-4"><label for="edit-title-en" class="block font-bold mb-2">Title</label><input type="text" id="edit-title-en" class="w-full p-2 border rounded"></div>
                        <div class="mb-4"><label for="edit-author-en" class="block font-bold mb-2">Author</label><input type="text" id="edit-author-en" class="w-full p-2 border rounded"></div>
                        <div class="mb-4"><label for="edit-fullStory-en" class="block font-bold mb-2">Full Story</label><textarea id="edit-fullStory-en" rows="5" class="w-full p-2 border rounded"></textarea></div>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-2">Telugu Content</h3>
                        <div class="mb-4"><label for="edit-title-te" class="block font-bold mb-2">శీర్షిక</label><input type="text" id="edit-title-te" class="w-full p-2 border rounded"></div>
                        <div class="mb-4"><label for="edit-author-te" class="block font-bold mb-2">రచయిత</label><input type="text" id="edit-author-te" class="w-full p-2 border rounded"></div>
                        <div class="mb-4"><label for="edit-fullStory-te" class="block font-bold mb-2">పూర్తి కథనం</label><textarea id="edit-fullStory-te" rows="5" class="w-full p-2 border rounded"></textarea></div>
                    </div>
                </div>
                <div class="mb-4 border-t pt-4 mt-4"><label for="edit-img" class="block font-bold mb-2">${t('image_url')}</label><input type="text" id="edit-img" class="w-full p-2 border rounded"></div>
                <div class="flex justify-end space-x-4">
                    <button type="button" onclick="this.closest('.modal-overlay').classList.add('hidden')" class="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">${t('cancel')}</button>
                    <button type="submit" class="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">${t('save_changes')}</button>
                </div>
            </form>
        </div>`;
    
    // Add Modal
    const sectionOptions = sections.filter(s => s.articles).map(s => `<option value="${s.id}">${s[currentLanguage].title}</option>`).join('');
    document.getElementById('add-modal').innerHTML = `
        <div class="modal-content">
            <h2 class="text-2xl font-bold mb-4">${t('add_new_story')}</h2>
            <form id="add-form">
                <div class="mb-4"><label for="add-section" class="block font-bold mb-2">${t('select_section')}</label><select id="add-section" class="w-full p-2 border rounded">${sectionOptions}</select></div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 class="font-bold text-lg mb-2">English Content</h3>
                        <div class="mb-4"><label for="add-title-en" class="block font-bold mb-2">Title</label><input type="text" id="add-title-en" class="w-full p-2 border rounded" required></div>
                        <div class="mb-4"><label for="add-author-en" class="block font-bold mb-2">Author</label><input type="text" id="add-author-en" class="w-full p-2 border rounded" required></div>
                        <div class="mb-4"><label for="add-fullStory-en" class="block font-bold mb-2">Full Story</label><textarea id="add-fullStory-en" rows="5" class="w-full p-2 border rounded" required></textarea></div>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-2">Telugu Content</h3>
                        <div class="mb-4"><label for="add-title-te" class="block font-bold mb-2">శీర్షిక</label><input type="text" id="add-title-te" class="w-full p-2 border rounded" required></div>
                        <div class="mb-4"><label for="add-author-te" class="block font-bold mb-2">రచయిత</label><input type="text" id="add-author-te" class="w-full p-2 border rounded" required></div>
                        <div class="mb-4"><label for="add-fullStory-te" class="block font-bold mb-2">పూర్తి కథనం</label><textarea id="add-fullStory-te" rows="5" class="w-full p-2 border rounded" required></textarea></div>
                    </div>
                </div>
                <div class="mb-4 border-t pt-4 mt-4"><label for="add-img" class="block font-bold mb-2">${t('image_url')}</label><input type="text" id="add-img" class="w-full p-2 border rounded" value="https://placehold.co/400x250/cccccc/000000?text=New+Article" required></div>
                <div class="flex justify-end space-x-4">
                    <button type="button" onclick="this.closest('.modal-overlay').classList.add('hidden')" class="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">${t('cancel')}</button>
                    <button type="submit" class="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">${t('add_story')}</button>
                </div>
            </form>
        </div>`;
    
    document.getElementById('edit-form').addEventListener('submit', handleEditSubmit);
    document.getElementById('add-form').addEventListener('submit', handleAddSubmit);
}

// --- Authentication ---
function updateHeaderUI() {
    const loginLink = document.getElementById('header-login-link');
    const profileSection = document.getElementById('profile-section');
    const profileDropdown = document.getElementById('profile-dropdown');

    if (isLoggedIn) {
        loginLink.classList.add('hidden');
        profileSection.classList.remove('hidden');
        
        let dropdownHtml = '';
        if (loggedInUserType === 'admin') {
            dropdownHtml += `<a href="#/settings" class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600" data-lang-key="settings">${getT('settings')}</a>`;
            dropdownHtml += `<button id="edit-mode-toggle" class="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600" data-lang-key="${isEditMode ? 'disable_editing' : 'enable_editing'}">${isEditMode ? getT('disable_editing') : getT('enable_editing')}</button>`;
        }
        dropdownHtml += `<a href="#" id="logout-button-header" class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600" data-lang-key="logout">${getT('logout')}</a>`;
        profileDropdown.innerHTML = dropdownHtml;

        // Re-add event listeners
        document.getElementById('logout-button-header').addEventListener('click', handleLogout);
        const editModeToggle = document.getElementById('edit-mode-toggle');
        if (editModeToggle) {
            editModeToggle.addEventListener('click', toggleEditMode);
        }

    } else {
        loginLink.classList.remove('hidden');
        profileSection.classList.add('hidden');
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    if (document.getElementById('username').value === 'admin' && document.getElementById('password').value === 'password123') {
        isLoggedIn = true;
        loggedInUserType = 'admin';
        document.getElementById('login-error').classList.add('hidden');
        updateHeaderUI();
        renderFooter();
        renderNav();
        location.hash = '';
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
}

function handleUserLogin() {
    isLoggedIn = true;
    loggedInUserType = 'user';
    updateHeaderUI();
    renderFooter();
    renderNav();
    location.hash = '';
}

function handleLogout(e) {
    if(e) e.preventDefault();
    isLoggedIn = false;
    loggedInUserType = null;
    if (isEditMode) toggleEditMode(); // Turn off edit mode on logout
    updateHeaderUI();
    document.getElementById('profile-dropdown').classList.add('hidden');
    renderFooter();
    renderNav();
    router();
}

// --- Theme ---
function applyTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.getElementById('theme-icon-light').classList.toggle('hidden', theme === 'dark');
    document.getElementById('theme-icon-dark').classList.toggle('hidden', theme !== 'dark');
}

// --- Settings Page ---
function renderSettingsPage() {
    const view = document.getElementById('settings-view');
    const t = (key) => getT(key);

    if (loggedInUserType !== 'admin') {
        view.innerHTML = `
            <div class="text-center p-12 settings-card">
                <h1 class="text-3xl font-bold text-red-500">${t('access_denied')}</h1>
                <p class="mt-4">${t('access_denied_msg')}</p>
                <a href="#/login" class="mt-6 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">${t('login')}</a>
            </div>`;
        return;
    }

    view.innerHTML = `
        <h1 class="font-playfair text-4xl font-bold mb-6">${t('settings')}</h1>
        <div class="settings-tabs">
            <button class="settings-tab-button active" data-tab="general">${t('general_settings')}</button>
            <button class="settings-tab-button" data-tab="pages">${t('pages_content')}</button>
            <button class="settings-tab-button" data-tab="epaper">${t('epaper_settings')}</button>
        </div>

        <!-- General Settings Tab -->
        <div id="tab-general" class="settings-tab-content active">
            <form id="general-settings-form">
                 <div class="settings-card mb-6">
                    <h3 class="font-bold text-lg mb-4 border-b pb-2">${t('site_identity')}</h3>
                    <div>
                        <label for="logo-url" class="block font-bold mb-2">${t('logo_url')}</label>
                        <input type="text" id="logo-url" class="w-full p-2 border rounded" value="${siteSettings.logoUrl}">
                    </div>
                </div>
                <div class="settings-card mb-6">
                    <h3 class="font-bold text-lg mb-4 border-b pb-2">${t('breaking')}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="ticker-items-en" class="block font-bold mb-2">${t('ticker_items_en')}</label>
                            <textarea id="ticker-items-en" rows="4" class="w-full p-2 border rounded" placeholder="${t('one_per_line')}">${siteSettings.tickerItems.en.join('\n')}</textarea>
                        </div>
                        <div>
                            <label for="ticker-items-te" class="block font-bold mb-2">${t('ticker_items_te')}</label>
                            <textarea id="ticker-items-te" rows="4" class="w-full p-2 border rounded" placeholder="${t('one_per_line')}">${siteSettings.tickerItems.te.join('\n')}</textarea>
                        </div>
                    </div>
                </div>
                <div class="settings-card mb-6">
                    <h3 class="font-bold text-lg mb-4 border-b pb-2">${t('quick_links')}</h3>
                    <div id="quick-links-editor"></div>
                    <button type="button" id="add-quick-link" class="mt-2 text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">${t('add_link')}</button>
                </div>
                <div class="settings-card mb-6">
                    <h3 class="font-bold text-lg mb-4 border-b pb-2">${t('follow_us')}</h3>
                    <div id="social-links-editor"></div>
                    <button type="button" id="add-social-link" class="mt-2 text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">${t('add_link')}</button>
                </div>
                <button type="submit" class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded hover:bg-green-700">${t('save_settings')}</button>
            </form>
        </div>

        <!-- Pages Content Tab -->
        <div id="tab-pages" class="settings-tab-content">
             <form id="pages-settings-form">
                ${Object.keys(siteSettings.pages).map(key => `
                    <div class="settings-card mb-6">
                        <h3 class="font-bold text-lg mb-4 border-b pb-2">${siteSettings.pages[key].en.title} / ${siteSettings.pages[key].te.title}</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label for="page-${key}-en" class="block font-bold mb-2">English Content (Markdown supported)</label>
                                <textarea id="page-${key}-en" data-page-key="${key}" data-lang="en" rows="8" class="w-full p-2 border rounded">${siteSettings.pages[key].en.content}</textarea>
                            </div>
                            <div>
                                <label for="page-${key}-te" class="block font-bold mb-2">Telugu Content (Markdown supported)</label>
                                <textarea id="page-${key}-te" data-page-key="${key}" data-lang="te" rows="8" class="w-full p-2 border rounded">${siteSettings.pages[key].te.content}</textarea>
                            </div>
                        </div>
                    </div>
                `).join('')}
                <button type="submit" class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded hover:bg-green-700">${t('save_settings')}</button>
            </form>
        </div>

        <!-- E-Paper Tab -->
        <div id="tab-epaper" class="settings-tab-content">
             <form id="epaper-settings-form">
                <div class="settings-card mb-6">
                    <h3 class="font-bold text-lg mb-4 border-b pb-2">${t('epaper_settings')}</h3>
                    <div id="epaper-editor"></div>
                    <button type="button" id="add-epaper-link" class="mt-2 text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">${t('add_epaper')}</button>
                </div>
                <button type="submit" class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded hover:bg-green-700">${t('save_settings')}</button>
            </form>
        </div>
    `;

    // Populate dynamic editors
    renderQuickLinksEditor();
    renderSocialLinksEditor();
    renderEPaperEditor();
    
    // Add event listeners for the settings page
    addSettingsEventListeners();
}

function addSettingsEventListeners() {
    // Tab switching
    document.querySelectorAll('.settings-tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.settings-tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.settings-tab-content').forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(`tab-${button.dataset.tab}`).classList.add('active');
        });
    });

    // Form submissions
    document.getElementById('general-settings-form').addEventListener('submit', handleGeneralSettingsSave);
    document.getElementById('pages-settings-form').addEventListener('submit', handlePagesSettingsSave);
    document.getElementById('epaper-settings-form').addEventListener('submit', handleEPaperSettingsSave);

    // Add/Remove buttons
    document.getElementById('add-quick-link').addEventListener('click', () => {
        siteSettings.quickLinks.push({ text: '', href: '' });
        renderQuickLinksEditor();
    });
    document.getElementById('add-social-link').addEventListener('click', () => {
        siteSettings.followUs.push({ platform: '', href: '' });
        renderSocialLinksEditor();
    });
    document.getElementById('add-epaper-link').addEventListener('click', () => {
        siteSettings.epapers.unshift({ date: new Date().toISOString().split('T')[0], url: '' });
        renderEPaperEditor();
    });
}

function renderDynamicEditor(containerId, items, fields, removeCallback) {
    const container = document.getElementById(containerId);
    container.innerHTML = items.map((item, index) => `
        <div class="settings-field-group" data-index="${index}">
            ${fields.map(field => `
                <input type="text" value="${item[field.key] || ''}" class="w-full p-2 border rounded" placeholder="${getT(field.placeholder)}">
            `).join('')}
            <button type="button" class="remove-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">${getT('remove')}</button>
        </div>
    `).join('');

    container.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.closest('.settings-field-group').dataset.index;
            removeCallback(index);
        });
    });
}

function renderQuickLinksEditor() {
    renderDynamicEditor('quick-links-editor', siteSettings.quickLinks, 
        [{key: 'text', placeholder: 'link_text'}, {key: 'href', placeholder: 'link_url'}],
        (index) => {
            siteSettings.quickLinks.splice(index, 1);
            renderQuickLinksEditor();
        }
    );
}

function renderSocialLinksEditor() {
    renderDynamicEditor('social-links-editor', siteSettings.followUs, 
        [{key: 'platform', placeholder: 'platform'}, {key: 'href', placeholder: 'link_url'}],
        (index) => {
            siteSettings.followUs.splice(index, 1);
            renderSocialLinksEditor();
        }
    );
}

function renderEPaperEditor() {
     renderDynamicEditor('epaper-editor', siteSettings.epapers, 
        [{key: 'date', placeholder: 'epaper_date'}, {key: 'url', placeholder: 'epaper_url'}],
        (index) => {
            siteSettings.epapers.splice(index, 1);
            renderEPaperEditor();
        }
    );
}

function handleGeneralSettingsSave(e) {
    e.preventDefault();
    // Logo
    siteSettings.logoUrl = document.getElementById('logo-url').value;

    // Ticker
    siteSettings.tickerItems.en = document.getElementById('ticker-items-en').value.split('\n').filter(Boolean);
    siteSettings.tickerItems.te = document.getElementById('ticker-items-te').value.split('\n').filter(Boolean);
    
    // Quick Links
    const quickLinks = [];
    document.querySelectorAll('#quick-links-editor .settings-field-group').forEach(group => {
        const inputs = group.querySelectorAll('input');
        if (inputs[0].value && inputs[1].value) {
            quickLinks.push({ text: inputs[0].value, href: inputs[1].value });
        }
    });
    siteSettings.quickLinks = quickLinks;

    // Social Links
    const socialLinks = [];
    document.querySelectorAll('#social-links-editor .settings-field-group').forEach(group => {
        const inputs = group.querySelectorAll('input');
        if (inputs[0].value && inputs[1].value) {
            socialLinks.push({ platform: inputs[0].value, href: inputs[1].value });
        }
    });
    siteSettings.followUs = socialLinks;

    updateLogo();
    renderAndAnimateTicker();
    renderFooter();
    alert('General settings saved!');
}

function handlePagesSettingsSave(e) {
    e.preventDefault();
    document.querySelectorAll('#pages-settings-form textarea').forEach(area => {
        const key = area.dataset.pageKey;
        const lang = area.dataset.lang;
        siteSettings.pages[key][lang].content = area.value;
    });
    alert('Page content saved!');
}

function handleEPaperSettingsSave(e) {
    e.preventDefault();
    const epapers = [];
    document.querySelectorAll('#epaper-editor .settings-field-group').forEach(group => {
        const inputs = group.querySelectorAll('input');
        if (inputs[0].value && inputs[1].value) {
            epapers.push({ date: inputs[0].value, url: inputs[1].value });
        }
    });
    siteSettings.epapers = epapers;
    alert('E-Paper settings saved!');
}


// --- Initial Setup ---
window.addEventListener('DOMContentLoaded', () => {
    // Add hashchange listener immediately
    window.addEventListener('hashchange', router);

    // Set hash to empty to always start at home page.
    // This will trigger the hashchange listener which calls the router.
    if (location.hash !== '') {
        location.hash = '';
    }

    // Theme setup
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // Initial render
    const savedLang = localStorage.getItem('language') || 'te';
    document.getElementById('language-switcher').value = savedLang;
    switchLanguage(savedLang);
    
    // Event Listeners
    document.getElementById('language-switcher').addEventListener('change', (e) => {
        localStorage.setItem('language', e.target.value);
        switchLanguage(e.target.value);
        router(); // Re-route after language change
    });

    // Search
    const searchHandler = (e) => {
        e.preventDefault();
        const query = e.target.querySelector('input[type="search"]').value;
        if (query) location.hash = `#/search/${encodeURIComponent(query)}`;
    };
    document.getElementById('search-form').addEventListener('submit', searchHandler);
    document.getElementById('mobile-search-form').addEventListener('submit', searchHandler);
    document.getElementById('mobile-search-toggle').addEventListener('click', () => {
        document.getElementById('mobile-search-form').classList.toggle('hidden');
    });

    // Auth
    document.getElementById('admin-login-form').addEventListener('submit', handleAdminLogin);
    document.getElementById('google-login-btn').addEventListener('click', handleUserLogin);
    
    // Profile Dropdown
    document.getElementById('profile-button').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('profile-dropdown').classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
        if (!document.getElementById('profile-section').contains(e.target)) {
            document.getElementById('profile-dropdown').classList.add('hidden');
        }
    });

    // Home buttons
    document.querySelectorAll('a[href="#"], .back-to-home').forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        location.hash = '';
    }));
    
    // Final router call to render the correct initial page (which will be home)
    router();
});
