// Complete translations for all form sections and questions

export const translations = {
  english: {
    // Page Title
    title: 'WB Opinion Poll CATI 2025',
    
    // Timer
    time: 'Time',
    language: 'Language',
    
    // Section 1: Identification
    section1: 'Section 1: Identification',
    identification: 'Identification',
    ac_code: 'Assembly Constituency code',
    ac_name: 'Assembly Constituency name',
    pc_name: 'Parliamentary Constituency Name',
    pc_code: 'Parliamentary Constituency Code',
    district_name: 'District Name',
    district_code: 'District Code',
    region_name: 'Region Name',
    region_code: 'Region Code',
    mla_name: 'MLA Name',
    mp_name: 'MP Name',
    
    // Call Status
    callStatus: 'Call Status',
    numberStatus: 'Number Status',
    numberStatus_3: 'Call Not Received to Telecaller',
    numberStatus_1: 'Ringing (Respondent Call)',
    numberStatus_2: 'Not Ringing (Respondent Call)',
    
    callNotRingStatus: 'Call Not Ring Status',
    callNotRing_1: 'Switch Off',
    callNotRing_2: 'Number Not Reachable',
    callNotRing_3: 'Number Does not exist',
    
    callRingStatus: 'Call Ring Status',
    callRing_1: 'Picked',
    callRing_2: 'Did not picked',
    
    qCallStatus: 'Call Status',
    qCallStatus_1: 'Continue',
    qCallStatus_2: 'Wrong Number',
    qCallStatus_5: 'Respondent Not available/Reschedule Interview',
    
    rescheduleInterview: 'Reschedule Interview',
    telecallerName: 'Telecaller Name',
    callId: 'Call ID',
    
    // Section 2: Consent
    section2: 'Section 2: Interviewer Introduction and Statement of Informed Consent',
    consentText: `Namaste, my name is {telecaller_name}. We are from Convergent, an independent research organization. We are conducting a survey on social and political issues in West Bengal, interviewing thousands of people. I will ask you a few questions about government performance and your preferences. Your responses will remain strictly confidential and will only be analysed in combination with others. No personal details will ever be shared. The survey will take about 5–10 minutes, and your honest opinions will greatly help us.`,
    shouldContinue: 'Should I continue?',
    consent_yes: 'Yes',
    consent_no: 'No',
    
    // Section 3: Basic Demographic
    section3: 'Section 3: Basic Demographic',
    respAge: 'Could you please tell me your age in complete years?',
    years: 'Years',
    registeredVoter: 'Are you a registered voter in this assembly Constituency?',
    registeredVoter_yes: 'Yes',
    registeredVoter_no: 'No',
    respGender: "Please note the respondent's gender",
    gender_male: 'Male',
    gender_female: 'Female',
    
    // Section 4: Party Preferences
    section4: 'Section 4: Party Preferences',
    q5: '5. Which party did you vote for in the last assembly elections (MLA) in 2021?',
    q6: '6. Which party did you vote for in the last Lok Sabha elections (MP) in 2024?',
    q7: '7. Which party did you vote for in the by elections held in your assembly constituency (MLA) after 2021?',
    q8: '8. If assembly elections (MLA) were to be held tomorrow, then which party would you vote for?',
    q9: "9. Let us assume that the above party of your choice doesn't contest elections in your assembly constituency, which party would you choose?",
    q10: '10. Could you tell us the reason for choosing the above party as your second choice?',
    q11: '11. In your opinion what are the top 3 reasons for voting for AITC?',
    q12: '12. In your opinion what are the top 3 reasons for voting for BJP?',
    q13: '13. According to you what are the three most pressing issues of your assembly constituency?',
    
    interviewerHint: 'INTERVIEWER INSTRUCTIONS: PROBE BUT DO NOT PROMPT',
    interviewerHintSpont: 'INTERVIEWER INSTRUCTION: DO NOT READ OPTIONS, SELECT THE MOST APPROPRIATE OPTION BASIS WHAT THE RESPONDENT SAYS SPONTANEOUSLY',
    
    otherSpecify: 'Other (Please specify)',
    independentSpecify: 'Independent (Please specify)',
    
    // Section 5: Satisfaction
    section5: 'Section 5: Satisfaction and Approval Ratings',
    q14: '14. How satisfied or dissatisfied are you with the performance of the state govt led by Mamata Banerjee?',
    q15: '15. How satisfied or dissatisfied are you with the performance of BJP as the opposition in the state?',
    q16: '16. How satisfied or dissatisfied are you with the work done by the following.',
    q16_a: 'A. Lok Sabha MP/ {mp_name} from your parliament constituency',
    q16_b: 'B. Your current MLA/ {mla_name}?',
    q17: '17. Who do you think is the best leader to be the Chief Minister of West Bengal?',
    q19: '19. In your opinion, which party would win the next elections in your constituency, when you would elect your MLA?',
    
    interviewerReadOptions: 'INTERVIEWER INSTRUCTIONS – READ THE OPTIONS',
    othersSpecify: 'Others (specify)',
    otherPleaseSpecify: 'Other (Please Specify)',
    
    // Section 6: Demographics
    section6: 'Section 6: Basic Demographic',
    q20: '20. Could you please tell me the religion that you belong to?',
    q21: '21. Which social category do you belong to?',
    q22: '22. Could you please tell me your caste?',
    q23: '23. Could you please tell me the highest educational level of the most educated female of the household?',
    q24: '24. Could you please tell me the highest educational level of the most educated male of the household?',
    q25: '25. What is the occupation of the chief wage earner?',
    q28: '28. Thank you for your excellent responses, can we contact you in future for similar surveys and get your valuable opinions?',
    
    // Call Drop & Submit
    callDropGroup: 'Call Drop Group',
    respondentCutCall: 'Respondent Cut the Call',
    submit: 'Submit',
  },
  bengali: {
    // Page Title
    title: 'WB Opinion Poll CATI 2025',
    
    // Timer
    time: 'সময়',
    language: 'ভাষা',
    
    // Section 1: Identification
    section1: 'ধারা ১: পরিচিতি',
    identification: 'পরিচিতি',
    ac_code: 'বিধানসভা কেন্দ্রের কোড',
    ac_name: 'বিধানসভা কেন্দ্রের নাম',
    pc_name: 'সংসদীয় নির্বাচনী এলাকার নাম',
    pc_code: 'সংসদীয় নির্বাচনী এলাকার কোড',
    district_name: 'জেলার নাম',
    district_code: 'জেলার কোড',
    region_name: 'অঞ্চলের নাম',
    region_code: 'অঞ্চলের কোড',
    mla_name: 'বিধায়কের নাম',
    mp_name: 'সাংসদের নাম',
    
    // Call Status
    callStatus: 'কল স্ট্যাটাস',
    numberStatus: 'নম্বর স্ট্যাটাস',
    numberStatus_3: 'টেলিকলারের কাছে কল আসেনি',
    numberStatus_1: 'রিং হচ্ছে (উত্তরদাতার কল)',
    numberStatus_2: 'রিং হচ্ছে না (উত্তরদাতার কল)',
    
    callNotRingStatus: 'কল রিং না হওয়ার স্ট্যাটাস',
    callNotRing_1: 'সুইচ অফ',
    callNotRing_2: 'নম্বর পৌঁছানো যাচ্ছে না',
    callNotRing_3: 'নম্বর বিদ্যমান নেই',
    
    callRingStatus: 'কল রিং স্ট্যাটাস',
    callRing_1: 'তুলেছেন',
    callRing_2: 'তোলেননি',
    
    qCallStatus: 'কল স্ট্যাটাস',
    qCallStatus_1: 'চালিয়ে যান',
    qCallStatus_2: 'ভুল নম্বর',
    qCallStatus_5: 'উত্তরদাতা উপলব্ধ নেই/সাক্ষাৎকার পুনঃনির্ধারণ করুন',
    
    rescheduleInterview: 'সাক্ষাৎকার পুনঃনির্ধারণ করুন',
    telecallerName: 'টেলিকলারের নাম',
    callId: 'কল আইডি',
    
    // Section 2: Consent
    section2: 'ধারা ২: সাক্ষাৎকারকারীর পরিচয় এবং অবহিত সম্মতির বিবৃতি',
    consentText: `নমস্কার, আমার নাম {telecaller_name}। আমরা কনভার্জেন্ট থেকে এসেছি, একটি স্বতন্ত্র গবেষণা সংস্থা। আমরা পশ্চিমবঙ্গে সামাজিক ও রাজনৈতিক বিষয়ে একটি সমীক্ষা পরিচালনা করছি, হাজার হাজার মানুষের সাক্ষাৎকার নিচ্ছি। আমি আপনাকে সরকারের কর্মক্ষমতা এবং আপনার পছন্দ সম্পর্কে কিছু প্রশ্ন জিজ্ঞাসা করব। আপনার উত্তরগুলি কঠোরভাবে গোপনীয় থাকবে এবং শুধুমাত্র অন্যদের সাথে মিলিয়ে বিশ্লেষণ করা হবে। কোনও ব্যক্তিগত বিবরণ কখনও শেয়ার করা হবে না। সমীক্ষাটি প্রায় ৫-১০ মিনিট সময় নেবে এবং আপনার সৎ মতামত আমাদের অত্যন্ত সাহায্য করবে।`,
    shouldContinue: 'আমি কি চালিয়ে যেতে পারি?',
    consent_yes: 'হ্যাঁ',
    consent_no: 'না',
    
    // Section 3: Basic Demographic
    section3: 'ধারা ৩: মৌলিক জনতাত্ত্বিক',
    respAge: 'আপনি কি দয়া করে আমাকে আপনার সম্পূর্ণ বয়স বছরে বলতে পারেন?',
    years: 'বছর',
    registeredVoter: 'আপনি কি এই বিধানসভা কেন্দ্রে নিবন্ধিত ভোটার?',
    registeredVoter_yes: 'হ্যাঁ',
    registeredVoter_no: 'না',
    respGender: 'উত্তরদাতার লিঙ্গ নোট করুন',
    gender_male: 'পুরুষ',
    gender_female: 'মহিলা',
    
    // Section 4: Party Preferences
    section4: 'ধারা ৪: দলীয় পছন্দ',
    q5: '৫. ২০২১ সালের শেষ বিধানসভা নির্বাচনে (বিধায়ক) আপনি কোন দলকে ভোট দিয়েছিলেন?',
    q6: '৬. ২০২৪ সালের শেষ লোকসভা নির্বাচনে (সাংসদ) আপনি কোন দলকে ভোট দিয়েছিলেন?',
    q7: '৭. ২০২১-এর পরে আপনার বিধানসভা কেন্দ্রে অনুষ্ঠিত উপনির্বাচনে আপনি কোন দলকে ভোট দিয়েছিলেন?',
    q8: '৮. যদি আগামীকাল বিধানসভা নির্বাচন (বিধায়ক) অনুষ্ঠিত হয়, তাহলে আপনি কোন দলকে ভোট দেবেন?',
    q9: '৯. ধরুন যে আপনার পছন্দের উপরোক্ত দল আপনার বিধানসভা কেন্দ্রে নির্বাচন প্রতিদ্বন্দ্বিতা করে না, তাহলে আপনি কোন দল বেছে নেবেন?',
    q10: '১০. আপনি কি আমাদের বলতে পারেন কেন আপনি দ্বিতীয় পছন্দ হিসাবে উপরোক্ত দল বেছে নিয়েছেন?',
    q11: '১১. আপনার মতে তৃণমূল কংগ্রেসকে ভোট দেওয়ার শীর্ষ ৩টি কারণ কী কী?',
    q12: '১২. আপনার মতে বিজেপিকে ভোট দেওয়ার শীর্ষ ৩টি কারণ কী কী?',
    q13: '১৩. আপনার মতে আপনার বিধানসভা কেন্দ্রের তিনটি সবচেয়ে গুরুত্বপূর্ণ সমস্যা কী কী?',
    
    interviewerHint: 'সাক্ষাৎকারকারীর নির্দেশনা: অনুসন্ধান করুন কিন্তু প্ররোচিত করবেন না',
    interviewerHintSpont: 'সাক্ষাৎকারকারীর নির্দেশনা: বিকল্পগুলি পড়বেন না, উত্তরদাতা স্বতঃস্ফূর্তভাবে যা বলেন তার ভিত্তিতে সবচেয়ে উপযুক্ত বিকল্পটি নির্বাচন করুন',
    
    otherSpecify: 'অন্যান্য (দয়া করে উল্লেখ করুন)',
    independentSpecify: 'স্বতন্ত্র (দয়া করে উল্লেখ করুন)',
    
    // Party Options
    party_aitc: 'তৃণমূল কংগ্রেস (AITC)',
    party_bjp: 'বিজেপি (BJP)',
    party_inc: 'কংগ্রেস (INC)',
    party_left: 'বাম ফ্রন্ট',
    party_independent: 'স্বতন্ত্র',
    party_others: 'অন্যান্য (উল্লেখ করুন)',
    party_nota: 'নোটা (NOTA)',
    party_didNotVote: 'ভোট দেননি',
    party_notEligible: 'ভোট দেওয়ার যোগ্য ছিলেন না',
    party_noResponse: 'কোনও উত্তর নেই/উত্তর দিতে অস্বীকার করেছেন',
    party_dontKnow: 'জানি না/বলতে পারি না',
    
    // Q10 Options
    q10_1: 'দলটি আমার জাতি ও সম্প্রদায়ের জন্য কাজ করে',
    q10_2: 'দলটি তাদের বক্তৃতায় কিছু ভালো যুক্তি দেয়',
    q10_3: 'দলটি আমার প্রথম পছন্দের দলকে সমর্থন করে',
    q10_4: 'দলের নেতারা বাংলার জন্য কাজ করেন',
    q10_5: 'অন্য কোনও দলকে ভোট দিতে চাই না',
    q10_44: 'অন্যান্য (উল্লেখ করুন)',
    q10_99: 'জানি না/বলতে পারি না',
    
    // Q11 Options
    q11_1: 'দলটি রাজ্যে ভালো কাজ করেছে',
    q11_2: 'সুশাসনের জন্য / সরকারি সেবা প্রদানের জন্য',
    q11_3: 'পশ্চিমবঙ্গের সুবিধার জন্য',
    q11_4: 'পশ্চিমবঙ্গের উন্নয়নের জন্য',
    q11_5: 'স্বাস্থ্যসেবা / শিক্ষা / পানীয় জল / বিদ্যুৎ / আবাসনের ক্ষেত্রে দলটি ভালো সেবা প্রদান করে',
    q11_6: 'কৃষকদের জন্য / কৃষি / সেচের জন্য কাজ করে',
    q11_7: 'ছোট ব্যবসা প্রচার করে',
    q11_8: 'গরীবদের জন্য কাজ করে',
    q11_9: 'দাম বৃদ্ধি নিয়ন্ত্রণ করতে',
    q11_11: 'দলটি আরও কর্মসংস্থান তৈরি করবে',
    q11_13: 'আরও সাম্প্রদায়িক সম্প্রীতির জন্য',
    q11_14: 'মমতা ব্যানার্জি এখন পর্যন্ত বাংলার সেরা মুখ্যমন্ত্রী',
    q11_15: 'সংখ্যালঘুদের কল্যাণের জন্য',
    q11_44: 'অন্যান্য (উল্লেখ করুন)',
    q11_99: 'জানি না / বলতে পারি না',
    
    // Q12 Options
    q12_1: 'বিজেপি কেন্দ্রে একটি স্থিতিশীল সরকার হিসাবে প্রমাণিত হয়েছে',
    q12_2: 'সুশাসনের জন্য / সরকারি সেবা প্রদানের জন্য',
    q12_3: 'নরেন্দ্র মোদীর কারণে',
    q12_5: 'পশ্চিমবঙ্গের আরও ভালো উন্নয়নের জন্য',
    q12_6: 'কৃষকদের / কৃষি / সেচের জন্য আরও ভালো',
    q12_7: 'ছোট ব্যবসার জন্য আরও ভালো',
    q12_8: 'আরও ভালো স্বাস্থ্যসেবা / শিক্ষা / পানীয় জল / বিদ্যুৎ / আবাসনের জন্য',
    q12_9: 'ভালো কল্যাণ প্রকল্পের জন্য',
    q12_11: 'বিজেপি হিন্দুদের জন্য ভালো',
    q12_12: 'বিজেপি গরীবদের যত্ন নেয়',
    q12_14: 'তৃণমূল পশ্চিমবঙ্গে ভালো কাজ করেনি',
    q12_44: 'অন্যান্য (উল্লেখ করুন)',
    q12_99: 'জানি না / বলতে পারি না',
    
    // Q13 Options
    q13_1: 'পেশাদার ডিগ্রি',
    q13_2: 'মূল্য বৃদ্ধি / মুদ্রাস্ফীতি',
    q13_3: 'বেকারত্ব / চাকরির অভাব',
    q13_4: 'বিদ্যুৎ/বিদ্যুৎ সমস্যা',
    q13_5: 'স্বাস্থ্যসেবা ভালো নয়',
    q13_6: 'শিক্ষা ব্যবস্থার সমস্যা',
    q13_7: 'ভোটার তালিকার সমস্যা / নাগরিকত্ব হারানোর ভয়',
    q13_8: 'পরিযায়ী শ্রমিকদের নিরাপত্তা',
    q13_9: 'শিক্ষক প্রতিবাদ এবং চাকরির নিরাপত্তাহীনতা',
    q13_10: 'বন্যা এবং প্রাকৃতিক দুর্যোগ',
    q13_11: 'সাম্প্রদায়িক উত্তেজনা / আইন-শৃঙ্খলা সংক্রান্ত উদ্বেগ',
    q13_12: 'মহিলাদের নিরাপত্তা (অপরাধ / নিরাপত্তা)',
    q13_13: 'অবকাঠামো (রাস্তা, সংযোগ)',
    q13_44: 'অন্যান্য (উল্লেখ করুন)',
    
    interviewerHint: 'সাক্ষাৎকারকারীর নির্দেশনা: অনুসন্ধান করুন কিন্তু প্ররোচিত করবেন না',
    interviewerHintSpont: 'সাক্ষাৎকারকারীর নির্দেশনা: বিকল্পগুলি পড়বেন না, উত্তরদাতা স্বতঃস্ফূর্তভাবে যা বলেন তার ভিত্তিতে সবচেয়ে উপযুক্ত বিকল্পটি নির্বাচন করুন',
    
    otherSpecify: 'অন্যান্য (দয়া করে উল্লেখ করুন)',
    independentSpecify: 'স্বতন্ত্র (দয়া করে উল্লেখ করুন)',
    
    // Section 5: Satisfaction
    section5: 'ধারা ৫: সন্তুষ্টি এবং অনুমোদন রেটিং',
    q14: '১৪. মমতা ব্যানার্জির নেতৃত্বাধীন রাজ্য সরকারের কর্মক্ষমতায় আপনি কতটা সন্তুষ্ট বা অসন্তুষ্ট?',
    q15: '১৫. রাজ্যে বিরোধী হিসাবে বিজেপির কর্মক্ষমতায় আপনি কতটা সন্তুষ্ট বা অসন্তুষ্ট?',
    q16: '১৬. নিম্নলিখিতদের কাজে আপনি কতটা সন্তুষ্ট বা অসন্তুষ্ট।',
    q16_a: 'ক. লোকসভা সাংসদ/ {mp_name} আপনার সংসদীয় কেন্দ্র থেকে',
    q16_b: 'খ. আপনার বর্তমান বিধায়ক/ {mla_name}?',
    q17: '১৭. পশ্চিমবঙ্গের মুখ্যমন্ত্রী হওয়ার জন্য সেরা নেতা কে বলে আপনি মনে করেন?',
    q19: '১৯. আপনার মতে, আপনার কেন্দ্রে পরবর্তী নির্বাচনে কোন দল জিতবে, যখন আপনি আপনার বিধায়ক নির্বাচন করবেন?',
    
    interviewerReadOptions: 'সাক্ষাৎকারকারীর নির্দেশনা - বিকল্পগুলি পড়ুন',
    othersSpecify: 'অন্যান্য (উল্লেখ করুন)',
    otherPleaseSpecify: 'অন্যান্য (দয়া করে উল্লেখ করুন)',
    
    // Satisfaction Options
    satisfaction_1: 'সম্পূর্ণ সন্তুষ্ট',
    satisfaction_2: 'কিছুটা সন্তুষ্ট',
    satisfaction_3: 'নিরপেক্ষ/জানি না/বলতে পারি না',
    satisfaction_4: 'কিছুটা অসন্তুষ্ট',
    satisfaction_5: 'সম্পূর্ণ অসন্তুষ্ট',
    
    // Q17 Options
    q17_1: 'মমতা ব্যানার্জি (AITC)',
    q17_2: 'দিলীপ ঘোষ (BJP)',
    q17_3: 'শুভেন্দু অধিকারী (BJP)',
    q17_4: 'সুকান্ত মজুমদার (BJP)',
    q17_5: 'অভিষেক ব্যানার্জি (AITC)',
    q17_6: 'সমিক ভট্টাচার্য (BJP)',
    q17_7: 'সুভঙ্কর সরকার (INC)',
    q17_8: 'বিমান বসু (বাম ফ্রন্ট)',
    q17_9: 'শ্রীদীপ ভট্টাচার্য (বাম ফ্রন্ট)',
    q17_10: 'তৃণমূল থেকে যে কেউ',
    q17_11: 'কংগ্রেস থেকে যে কেউ',
    q17_12: 'বিজেপি থেকে যে কেউ',
    q17_44: 'অন্যান্য (উল্লেখ করুন)',
    
    // Section 6: Demographics
    section6: 'ধারা ৬: মৌলিক জনতাত্ত্বিক',
    q20: '২০. আপনি কোন ধর্মের অন্তর্গত তা কি আমাকে বলতে পারেন?',
    q21: '২১. আপনি কোন সামাজিক শ্রেণীর অন্তর্গত?',
    q22: '২২. আপনি কি আমাকে আপনার জাতি বলতে পারেন?',
    q23: '২৩. পরিবারের সবচেয়ে শিক্ষিত মহিলার সর্বোচ্চ শিক্ষাগত স্তর কি আপনি আমাকে বলতে পারেন?',
    q24: '২৪. পরিবারের সবচেয়ে শিক্ষিত পুরুষের সর্বোচ্চ শিক্ষাগত স্তর কি আপনি আমাকে বলতে পারেন?',
    q25: '২৫. প্রধান উপার্জনকারীর পেশা কী?',
    q28: '২৮. আপনার চমৎকার উত্তরের জন্য ধন্যবাদ, আমরা কি ভবিষ্যতে অনুরূপ সমীক্ষার জন্য আপনার সাথে যোগাযোগ করতে এবং আপনার মূল্যবান মতামত পেতে পারি?',
    
    // Religion Options
    religion_1: 'হিন্দু',
    religion_2: 'মুসলিম',
    religion_3: 'খ্রিস্টান',
    religion_4: 'শিখ',
    religion_5: 'জৈন',
    religion_6: 'বৌদ্ধ',
    religion_7: 'কোনও উত্তর নেই',
    religion_44: 'অন্যান্য (উল্লেখ করুন)',
    
    // Social Category Options
    socialCat_1: 'সাধারণ/OC',
    socialCat_2: 'তফসিলি জাতি',
    socialCat_3: 'তফসিলি উপজাতি',
    socialCat_4: 'অন্যান্য অনগ্রসর শ্রেণী',
    socialCat_5: 'কোনও উত্তর নেই',
    
    // Caste Options (keeping names as is, commonly used)
    caste_1: 'আগুরি',
    caste_2: 'কাঁসা বানিক',
    caste_3: 'সাদগোপ',
    caste_4: 'শুনরি',
    caste_5: 'যাদব',
    caste_6: 'সাঁওতাল',
    caste_7: 'পোদ',
    caste_8: 'তাঁতি',
    caste_9: 'নমশূদ্র',
    caste_10: 'ব্রাহ্মণ',
    caste_11: 'কায়স্থ',
    caste_12: 'বৈদ্য',
    caste_13: 'রাজপুত',
    caste_14: 'ক্ষত্রিয়',
    caste_15: 'বারুই',
    caste_16: 'গন্ধবানিক',
    caste_17: 'কুলীন কায়স্থ',
    caste_18: 'মাহিষ্য',
    caste_19: 'নমশূদ্র',
    caste_20: 'রাজবংশী',
    caste_21: 'পৌন্ড্র',
    caste_22: 'ডোম',
    caste_23: 'বাগদি',
    caste_24: 'চামার',
    caste_25: 'মুচি',
    caste_26: 'কোরি',
    caste_27: 'হালদার',
    caste_28: 'সাঁওতাল',
    caste_29: 'মুন্ডা',
    caste_30: 'ওরাঁও',
    caste_31: 'ভূমিজ',
    caste_32: 'হো',
    caste_33: 'লোধা',
    caste_34: 'ভিল',
    caste_35: 'বিরহোর',
    caste_36: 'মাহালি',
    caste_37: 'তেলি/তেলি সাহু',
    caste_38: 'নাপিত',
    caste_39: 'কর্মকার',
    caste_40: 'রাজাক',
    caste_41: 'ধোপা',
    caste_42: 'হেলা',
    caste_43: 'কাহার',
    caste_47: 'কেওট',
    caste_45: 'কুর্মি',
    caste_46: 'পাসি',
    caste_44: 'অন্যান্য (উল্লেখ করুন)',
    caste_88: 'উত্তর দিতে অস্বীকার',
    
    // Education Options
    edu_1_female: 'কোনও প্রাপ্তবয়স্ক মহিলা নেই',
    edu_1_male: 'কোনও প্রাপ্তবয়স্ক পুরুষ নেই',
    edu_2: 'কোনও আনুষ্ঠানিক শিক্ষা নেই',
    edu_3: '৫ম শ্রেণী পর্যন্ত',
    edu_4: '৬ম-৯ম শ্রেণী',
    edu_5: '১০ম-১৪ম শ্রেণী',
    edu_6: 'ডিগ্রি (নিয়মিত)',
    edu_7: 'পেশাদার ডিগ্রি',
    
    // Occupation Options
    occupation_2: 'শ্রমিক',
    occupation_3: 'কৃষক',
    occupation_4: 'কর্মী',
    occupation_5: 'ব্যবসায়ী',
    occupation_6: 'ক্লারিক্যাল বিক্রয়/সুপারভাইজার',
    occupation_7: 'ব্যবস্থাপকীয়/পেশাদার',
    
    // Future Contact Options
    futureContact_1: 'হ্যাঁ, পারেন',
    futureContact_2: 'না দয়া করে',
    
    // Call Drop & Submit
    callDropGroup: 'কল ড্রপ গ্রুপ',
    respondentCutCall: 'উত্তরদাতা কল কেটে দিয়েছেন',
    submit: 'জমা দিন',
  }
};

export type TranslationKey = keyof typeof translations.english;
export type Language = 'english' | 'bengali';

