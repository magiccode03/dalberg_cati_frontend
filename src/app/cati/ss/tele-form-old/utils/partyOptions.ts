// Party options for Q5, Q6, Q7, Q8 (from party_2019.csv)
export const getPartyOptions2019 = (lang: 'english' | 'bengali') => [
  { value: '1', label: lang === 'english' ? 'AITC (Trinamool Congress)' : 'তৃণমূল কংগ্রেস (AITC)' },
  { value: '2', label: 'BJP' },
  { value: '3', label: lang === 'english' ? 'INC (Congress)' : 'কংগ্রেস (INC)' },
  { value: '4', label: lang === 'english' ? 'Left Front' : 'বাম ফ্রন্ট' },
  { value: '12', label: lang === 'english' ? 'Independent' : 'স্বতন্ত্র' },
  { value: '44', label: lang === 'english' ? 'Others (specify)' : 'অন্যান্য (উল্লেখ করুন)' },
  { value: '55', label: lang === 'english' ? 'NOTA' : 'নোটা (NOTA)' },
  { value: '66', label: lang === 'english' ? 'Did not vote' : 'ভোট দেননি' },
  { value: '77', label: lang === 'english' ? 'Not eligible for voting' : 'ভোট দেওয়ার যোগ্য ছিলেন না' },
  { value: '88', label: lang === 'english' ? 'No response/Refused to answer' : 'কোনও উত্তর নেই/উত্তর দিতে অস্বীকার করেছেন' },
];

// Party options for Q9 (without "No response/Refused to answer" option)
export const getPartyOptions2019ForQ9 = (lang: 'english' | 'bengali') => [
  { value: '1', label: lang === 'english' ? 'AITC (Trinamool Congress)' : 'তৃণমূল কংগ্রেস (AITC)' },
  { value: '2', label: 'BJP' },
  { value: '3', label: lang === 'english' ? 'INC (Congress)' : 'কংগ্রেস (INC)' },
  { value: '4', label: lang === 'english' ? 'Left Front' : 'বাম ফ্রন্ট' },
  { value: '12', label: lang === 'english' ? 'Independent' : 'স্বতন্ত্র' },
  { value: '44', label: lang === 'english' ? 'Others (specify)' : 'অন্যান্য (উল্লেখ করুন)' },
  { value: '55', label: lang === 'english' ? 'NOTA' : 'নোটা (NOTA)' },
  { value: '66', label: lang === 'english' ? 'Did not vote' : 'ভোট দেননি' },
  { value: '77', label: lang === 'english' ? 'Not eligible for voting' : 'ভোট দেওয়ার যোগ্য ছিলেন না' },
];

// Party options for Q19 (from party_2020.csv)
export const getPartyOptions2020 = (lang: 'english' | 'bengali') => [
  { value: '1', label: lang === 'english' ? 'AITC (Trinamool Congress)' : 'তৃণমূল কংগ্রেস (AITC)' },
  { value: '2', label: 'BJP' },
  { value: '3', label: lang === 'english' ? 'INC (Congress)' : 'কংগ্রেস (INC)' },
  { value: '4', label: lang === 'english' ? 'Left Front' : 'বাম ফ্রন্ট' },
  { value: '44', label: lang === 'english' ? 'Others (specify)' : 'অন্যান্য (উল্লেখ করুন)' },
  { value: '99', label: lang === 'english' ? "Don't know/can't say" : 'জানি না/বলতে পারি না' },
];

// Q10 options
export const getQ10Options = (lang: 'english' | 'bengali') => [
  { value: '1', label: lang === 'english' ? 'The party works for my caste and community' : 'দলটি আমার জাতি ও সম্প্রদায়ের জন্য কাজ করে' },
  { value: '2', label: lang === 'english' ? 'The party makes some good arguments in their speeches' : 'দলটি তাদের বক্তৃতায় কিছু ভালো যুক্তি দেয়' },
  { value: '3', label: lang === 'english' ? 'The party supports my first choice party' : 'দলটি আমার প্রথম পছন্দের দলকে সমর্থন করে' },
  { value: '4', label: lang === 'english' ? 'The leaders of the party work for Bengal' : 'দলের নেতারা বাংলার জন্য কাজ করেন' },
  { value: '5', label: lang === 'english' ? 'Do not wish to vote for any other party' : 'অন্য কোনও দলকে ভোট দিতে চাই না' },
  { value: '44', label: lang === 'english' ? 'Others (Specify)' : 'অন্যান্য (উল্লেখ করুন)' },
  { value: '99', label: lang === 'english' ? "Don't know/can't say" : 'জানি না/বলতে পারি না' },
];

// Q11 options
export const getQ11Options = (lang: 'english' | 'bengali') => [
  { value: '1', label: lang === 'english' ? 'The party has performed well in the state' : 'দলটি রাজ্যে ভালো কাজ করেছে' },
  { value: '2', label: lang === 'english' ? 'For good governance / delivering government services' : 'সুশাসনের জন্য / সরকারি সেবা প্রদানের জন্য' },
  { value: '3', label: lang === 'english' ? 'For the benefit of West Bengal' : 'পশ্চিমবঙ্গের সুবিধার জন্য' },
  { value: '4', label: lang === 'english' ? 'For the development of WB' : 'পশ্চিমবঙ্গের উন্নয়নের জন্য' },
  { value: '5', label: lang === 'english' ? 'The party provides good services when it comes to healthcare / education / drinking water / electricity / housing' : 'স্বাস্থ্যসেবা / শিক্ষা / পানীয় জল / বিদ্যুৎ / আবাসনের ক্ষেত্রে দলটি ভালো সেবা প্রদান করে' },
  { value: '6', label: lang === 'english' ? 'Works for farmers / agriculture / irrigation' : 'কৃষকদের জন্য / কৃষি / সেচের জন্য কাজ করে' },
  { value: '7', label: lang === 'english' ? 'Promotes small businesses' : 'ছোট ব্যবসা প্রচার করে' },
  { value: '8', label: lang === 'english' ? 'Works for the poor' : 'গরীবদের জন্য কাজ করে' },
  { value: '9', label: lang === 'english' ? 'To control price rise' : 'দাম বৃদ্ধি নিয়ন্ত্রণ করতে' },
  { value: '11', label: lang === 'english' ? 'The party will generate more employment' : 'দলটি আরও কর্মসংস্থান তৈরি করবে' },
  { value: '13', label: lang === 'english' ? 'For greater communal harmony' : 'আরও সাম্প্রদায়িক সম্প্রীতির জন্য' },
  { value: '14', label: lang === 'english' ? 'Mamata B. is the best CM of Bengal so far' : 'মমতা ব্যানার্জি এখন পর্যন্ত বাংলার সেরা মুখ্যমন্ত্রী' },
  { value: '15', label: lang === 'english' ? "For minorities' welfare" : 'সংখ্যালঘুদের কল্যাণের জন্য' },
  { value: '44', label: lang === 'english' ? 'Others (specify)' : 'অন্যান্য (উল্লেখ করুন)' },
  { value: '99', label: lang === 'english' ? "Don't know / Can't say" : 'জানি না / বলতে পারি না' },
];

// Q12 options
export const getQ12Options = (lang: 'english' | 'bengali') => [
  { value: '1', label: lang === 'english' ? 'BJP has proven to be a stable govt. at the centre' : 'বিজেপি কেন্দ্রে একটি স্থিতিশীল সরকার হিসাবে প্রমাণিত হয়েছে' },
  { value: '2', label: lang === 'english' ? 'For good governance / delivering government services' : 'সুশাসনের জন্য / সরকারি সেবা প্রদানের জন্য' },
  { value: '3', label: lang === 'english' ? 'Because of Narendra Modi: good / strong / decisive leader' : 'নজ্রন্দ্র দমাদী ভাজ্লা / শরিশালী / রসদ্ধান্ত রনজ্ে পাজ্র এমন দনো' },
  { value: '5', label: lang === 'english' ? 'For the better development of WB' : 'পশ্চিমবঙ্গের আরও ভালো উন্নয়নের জন্য' },
  { value: '6', label: lang === 'english' ? 'Better for farmers / agriculture / irrigation' : 'কৃষকদের / কৃষি / সেচের জন্য আরও ভালো' },
  { value: '7', label: lang === 'english' ? 'Better for small businesses' : 'ছোট ব্যবসার জন্য আরও ভালো' },
  { value: '8', label: lang === 'english' ? 'For better healthcare / education / drinking water / electricity / housing' : 'আরও ভালো স্বাস্থ্যসেবা / শিক্ষা / পানীয় জল / বিদ্যুৎ / আবাসনের জন্য' },
  { value: '9', label: lang === 'english' ? 'For good welfare schemes' : 'ভালো কল্যাণ প্রকল্পের জন্য' },
  { value: '11', label: lang === 'english' ? 'BJP is better for Hindus' : 'বিজেপি হিন্দুদের জন্য ভালো' },
  { value: '12', label: lang === 'english' ? 'BJP cares for the poor' : 'বিজেপি গরীবদের যত্ন নেয়' },
  { value: '14', label: lang === 'english' ? 'TMC has not performed in West Bengal' : 'তৃণমূল পশ্চিমবঙ্গে ভালো কাজ করেনি' },
  { value: '44', label: lang === 'english' ? 'Others (Specify)' : 'অন্যান্য (উল্লেখ করুন)' },
  { value: '99', label: lang === 'english' ? "Don't know / Can't say" : 'জানি না / বলতে পারি না' },
];

// Q13 options
export const getQ13Options = (lang: 'english' | 'bengali') => [
  { value: '2', label: lang === 'english' ? 'Price rise / inflation' : 'মূল্য বৃদ্ধি / মুদ্রাস্ফীতি' },
  { value: '3', label: lang === 'english' ? 'Unemployment / lack of jobs' : 'বেকারত্ব / চাকরির অভাব' },
  { value: '4', label: lang === 'english' ? 'Electricity/power problems' : 'বিদ্যুৎ/বিদ্যুৎ সমস্যা' },
  { value: '5', label: lang === 'english' ? 'Healthcare not good' : 'স্বাস্থ্যসেবা ভালো নয়' },
  { value: '6', label: lang === 'english' ? 'Education system issues' : 'শিক্ষা ব্যবস্থার সমস্যা' },
  { value: '7', label: lang === 'english' ? 'Voter list issues / fear of losing citizenship' : 'ভোটার তালিকার সমস্যা / নাগরিকত্ব হারানোর ভয়' },
  { value: '8', label: lang === 'english' ? 'Safety for migrant workers' : 'পরিযায়ী শ্রমিকদের নিরাপত্তা' },
  { value: '9', label: lang === 'english' ? 'Teacher protests & job insecurity' : 'শিক্ষক প্রতিবাদ এবং চাকরির নিরাপত্তাহীনতা' },
  { value: '10', label: lang === 'english' ? 'Floods and natural disasters' : 'বন্যা এবং প্রাকৃতিক দুর্যোগ' },
  { value: '11', label: lang === 'english' ? 'Communal tensions / law-and-order concerns' : 'সাম্প্রদায়িক উত্তেজনা / আইন-শৃঙ্খলা সংক্রান্ত উদ্বেগ' },
  { value: '12', label: lang === 'english' ? 'Safety of women (crime / security)' : 'মহিলাদের নিরাপত্তা (অপরাধ / নিরাপত্তা)' },
  { value: '13', label: lang === 'english' ? 'Infrastructure (roads, connectivity)' : 'অবকাঠামো (রাস্তা, সংযোগ)' },
  { value: '44', label: lang === 'english' ? 'Others (Specify)' : 'অন্যান্য (উল্লেখ করুন)' },
];

// Satisfaction rating options
export const getSatisfactionOptions = (lang: 'english' | 'bengali') => [
  { value: '1', label: lang === 'english' ? 'Fully satisfied' : 'সম্পূর্ণ সন্তুষ্ট' },
  { value: '2', label: lang === 'english' ? 'Somewhat satisfied' : 'কিছুটা সন্তুষ্ট' },
  { value: '3', label: lang === 'english' ? "Neutral/Don't know/Can't say" : 'নিরপেক্ষ/জানি না/বলতে পারি না' },
  { value: '4', label: lang === 'english' ? 'Somewhat dissatisfied' : 'কিছুটা অসন্তুষ্ট' },
  { value: '5', label: lang === 'english' ? 'Fully dissatisfied' : 'সম্পূর্ণ অসন্তুষ্ট' },
];

// Q17 options
export const getQ17Options = (lang: 'english' | 'bengali') => [
  { value: '1', label: lang === 'english' ? 'Mamata Banerjee(AITC)' : 'মমতা ব্যানার্জি (AITC)' },
  { value: '2', label: lang === 'english' ? 'Dilip Ghosh (BJP)' : 'দিলীপ ঘোষ (BJP)' },
  { value: '3', label: lang === 'english' ? 'Suvendu Adhikari (BJP)' : 'শুভেন্দু অধিকারী (BJP)' },
  { value: '4', label: lang === 'english' ? 'Sukanta Majumudar (BJP)' : 'সুকান্ত মজুমদার (BJP)' },
  { value: '5', label: lang === 'english' ? 'Abhishek Banerjee (AITC)' : 'অভিষেক ব্যানার্জি (AITC)' },
  { value: '6', label: lang === 'english' ? 'Samik Bhattacharya (BJP)' : 'সমিক ভট্টাচার্য (BJP)' },
  { value: '7', label: lang === 'english' ? 'Subhankar Sarkar (INC)' : 'সুভঙ্কর সরকার (INC)' },
  { value: '8', label: lang === 'english' ? 'Biman Bose( Left Front)' : 'বিমান বসু (বাম ফ্রন্ট)' },
  { value: '9', label: lang === 'english' ? 'Srideep (Sridip) Bhattacharya (Left Front)' : 'শ্রীদীপ ভট্টাচার্য (বাম ফ্রন্ট)' },
  { value: '10', label: lang === 'english' ? 'Anyone from TMC' : 'তৃণমূল থেকে যে কেউ' },
  { value: '11', label: lang === 'english' ? 'Anyone from INC' : 'কংগ্রেস থেকে যে কেউ' },
  { value: '12', label: lang === 'english' ? 'Anyone from BJP' : 'বিজেপি থেকে যে কেউ' },
  { value: '44', label: lang === 'english' ? 'Others (specify)' : 'অন্যান্য (উল্লেখ করুন)' },
];

// Religion options
export const getReligionOptions = (lang: 'english' | 'bengali') => [
  { value: '1', label: lang === 'english' ? 'Hindu' : 'হিন্দু' },
  { value: '2', label: lang === 'english' ? 'Muslim' : 'মুসলিম' },
  { value: '3', label: lang === 'english' ? 'Christian' : 'খ্রিস্টান' },
  { value: '4', label: lang === 'english' ? 'Sikh' : 'শিখ' },
  { value: '5', label: lang === 'english' ? 'Jain' : 'জৈন' },
  { value: '6', label: lang === 'english' ? 'Buddhist' : 'বৌদ্ধ' },
  { value: '7', label: lang === 'english' ? 'No response' : 'কোনও উত্তর নেই' },
  { value: '44', label: lang === 'english' ? 'Others (Specify)' : 'অন্যান্য (উল্লেখ করুন)' },
];

// Social category options
export const getSocialCategoryOptions = (lang: 'english' | 'bengali') => [
  { value: '1', label: lang === 'english' ? 'General/OC' : 'সাধারণ/OC' },
  { value: '2', label: lang === 'english' ? 'Schedule Castes' : 'তফসিলি জাতি' },
  { value: '3', label: lang === 'english' ? 'Schedule Tribes' : 'তফসিলি উপজাতি' },
  { value: '4', label: lang === 'english' ? 'Other Backward Caste' : 'অন্যান্য অনগ্রসর শ্রেণী' },
  { value: '5', label: lang === 'english' ? 'No response' : 'কোনও উত্তর নেই' },
];

// Caste options (names kept in original form as commonly used)
export const getCasteOptions = (lang: 'english' | 'bengali') => [
  { value: '1', label: 'Aguri' },
  { value: '2', label: 'Kansabanik' },
  { value: '3', label: 'Sadgop' },
  { value: '4', label: 'Shunri' },
  { value: '5', label: 'Yadav' },
  { value: '6', label: 'Santal' },
  { value: '7', label: 'Pod' },
  { value: '8', label: 'Tanti' },
  { value: '9', label: 'Namaseej' },
  { value: '10', label: 'Brahmins' },
  { value: '11', label: 'Kayasthas' },
  { value: '12', label: 'Baidyas' },
  { value: '13', label: 'Rajputs' },
  { value: '14', label: 'Kshatriyas' },
  { value: '15', label: 'Barui' },
  { value: '16', label: 'Gandha Banik' },
  { value: '17', label: 'Kulin Kayasthas' },
  { value: '18', label: 'Mahishya' },
  { value: '19', label: 'Namasudra' },
  { value: '20', label: 'Rajbanshi' },
  { value: '21', label: 'Poundra' },
  { value: '22', label: 'Dom' },
  { value: '23', label: 'Bagdi' },
  { value: '24', label: 'Chamar' },
  { value: '25', label: 'Muchi' },
  { value: '26', label: 'Kori' },
  { value: '27', label: 'Haldar' },
  { value: '28', label: 'Santhal' },
  { value: '29', label: 'Munda' },
  { value: '30', label: 'Oraon' },
  { value: '31', label: 'Bhumij' },
  { value: '32', label: 'Ho' },
  { value: '33', label: 'Lodha' },
  { value: '34', label: 'Bhil' },
  { value: '35', label: 'Birhor' },
  { value: '36', label: 'Mahali' },
  { value: '37', label: 'Teli/Teli Sahu' },
  { value: '38', label: 'Napit' },
  { value: '39', label: 'Karmakar' },
  { value: '40', label: 'Rajak' },
  { value: '41', label: 'Dhoba' },
  { value: '42', label: 'Hela' },
  { value: '43', label: 'Kahar' },
  { value: '47', label: 'Keot' },
  { value: '45', label: 'Kurmi' },
  { value: '46', label: 'Pasi' },
  { value: '44', label: lang === 'english' ? 'Others (Specify)' : 'অন্যান্য (উল্লেখ করুন)' },
  { value: '88', label: lang === 'english' ? 'Refused to respond' : 'উত্তর দিতে অস্বীকার' },
];

// Female Education options
export const getFemaleEducationOptions = (lang: 'english' | 'bengali') => [
  { value: '1', label: lang === 'english' ? 'No female adult' : 'কোনও প্রাপ্তবয়স্ক মহিলা নেই' },
  { value: '2', label: lang === 'english' ? 'No formal education' : 'কোনও আনুষ্ঠানিক শিক্ষা নেই' },
  { value: '3', label: lang === 'english' ? 'Upto class 5' : '৫ম শ্রেণী পর্যন্ত' },
  { value: '4', label: lang === 'english' ? 'Class 6–9' : '৬ম-৯ম শ্রেণী' },
  { value: '5', label: lang === 'english' ? 'Class 10–14' : '১০ম-১৪ম শ্রেণী' },
  { value: '6', label: lang === 'english' ? 'Degree (regular)' : 'ডিগ্রি (নিয়মিত)' },
  { value: '7', label: lang === 'english' ? 'Professional Degree' : 'পেশাদার ডিগ্রি' },
];

// Male Education options
export const getMaleEducationOptions = (lang: 'english' | 'bengali') => [
  { value: '1', label: lang === 'english' ? 'No male adult' : 'কোনও প্রাপ্তবয়স্ক পুরুষ নেই' },
  { value: '2', label: lang === 'english' ? 'No formal education' : 'কোনও আনুষ্ঠানিক শিক্ষা নেই' },
  { value: '3', label: lang === 'english' ? 'Upto class 5' : '৫ম শ্রেণী পর্যন্ত' },
  { value: '4', label: lang === 'english' ? 'Class 6–9' : '৬ম-৯ম শ্রেণী' },
  { value: '5', label: lang === 'english' ? 'Class 10–14' : '১০ম-১৪ম শ্রেণী' },
  { value: '6', label: lang === 'english' ? 'Degree (regular)' : 'ডিগ্রি (নিয়মিত)' },
  { value: '7', label: lang === 'english' ? 'Professional Degree' : 'পেশাদার ডিগ্রি' },
];

// Occupation options
export const getOccupationOptions = (lang: 'english' | 'bengali') => [
  { value: '2', label: lang === 'english' ? 'Labour' : 'শ্রমিক' },
  { value: '3', label: lang === 'english' ? 'Farmer' : 'কৃষক' },
  { value: '4', label: lang === 'english' ? 'Worker' : 'কর্মী' },
  { value: '5', label: lang === 'english' ? 'Trader' : 'ব্যবসায়ী' },
  { value: '6', label: lang === 'english' ? 'Clerical Sales/Supervisor' : 'ক্লারিক্যাল বিক্রয়/সুপারভাইজার' },
  { value: '7', label: lang === 'english' ? 'Managerial/Professional' : 'ব্যবস্থাপকীয়/পেশাদার' },
];

// Future contact options
export const getFutureContactOptions = (lang: 'english' | 'bengali') => [
  { value: '1', label: lang === 'english' ? 'Yes, you can' : 'হ্যাঁ, পারেন' },
  { value: '2', label: lang === 'english' ? 'No please' : 'না দয়া করে' },
];

