[
  {
    "key": "number_status",
    "type": "radio",
    "label": "Number Status",
    "required": true,
    "options": [
      { "key": "opt_ringing", "label": "Number Ringing", "value": "1" },
      { "key": "opt_not_ringing", "label": "Number Not Ringing", "value": "2" },
      { "key": "opt_wrong_number", "label": "Wrong Number", "value": "3" }
    ],
    "rules": {
      "clearFields": {
        "opt_ringing": ["call_not_ring", "call_ring_status", "q_call_status", "call_reschedule", "consent", "resp_age", "resp_registered_voter", "resp_gender"],
        "opt_not_ringing": ["call_ring_status", "q_call_status", "call_reschedule", "consent", "resp_age", "resp_registered_voter", "resp_gender"],
        "opt_wrong_number": ["call_not_ring", "call_ring_status", "q_call_status", "call_reschedule", "consent", "resp_age", "resp_registered_voter", "resp_gender"]
      },
      "showFields": {
        "opt_ringing": ["call_ring_status"],
        "opt_not_ringing": ["call_not_ring"]
      }
    }
  },
  {
    "key": "call_not_ring",
    "type": "radio",
    "label": "Call Not Ring Status",
    "conditional": "number_status === '2'",
    "options": [
      { "key": "opt_switched_off", "label": "Switched Off", "value": "1" },
      { "key": "opt_out_of_reach", "label": "Out of Reach", "value": "2" },
      { "key": "opt_busy", "label": "Busy", "value": "3" }
    ]
  },
  {
    "key": "call_ring_status",
    "type": "radio",
    "label": "Call Ring Status",
    "conditional": "number_status === '1'",
    "options": [
      { "key": "opt_picked_up", "label": "Picked Up", "value": "1" },
      { "key": "opt_not_picked_up", "label": "Not Picked Up", "value": "2" }
    ],
    "rules": {
      "clearFields": {
        "opt_picked_up": ["q_call_status", "call_reschedule", "consent", "resp_age", "resp_registered_voter", "resp_gender"],
        "opt_not_picked_up": ["q_call_status", "call_reschedule", "consent", "resp_age", "resp_registered_voter", "resp_gender"]
      },
      "showFields": {
        "opt_picked_up": ["q_call_status"]
      }
    }
  },
  {
    "key": "q_call_status",
    "type": "radio",
    "label": "Q Call Status",
    "conditional": "call_ring_status === '1'",
    "options": [
      { "key": "opt_respondent_available", "label": "Respondent Available", "value": "1" },
      { "key": "opt_respondent_not_available", "label": "Respondent Not Available", "value": "2" },
      { "key": "opt_reschedule", "label": "Reschedule", "value": "5" }
    ],
    "rules": {
      "clearFields": {
        "opt_respondent_available": ["call_reschedule", "consent", "resp_age", "resp_registered_voter", "resp_gender"],
        "opt_respondent_not_available": ["call_reschedule", "consent", "resp_age", "resp_registered_voter", "resp_gender"],
        "opt_reschedule": ["consent", "resp_age", "resp_registered_voter", "resp_gender"]
      },
      "showFields": {
        "opt_respondent_available": ["consent"],
        "opt_reschedule": ["call_reschedule"]
      }
    }
  },
  {
    "key": "call_reschedule",
    "type": "datetime-local",
    "label": "Reschedule Interview",
    "conditional": "q_call_status === '5'",
    "placeholder": "Select date and time"
  },
  {
    "key": "consent",
    "type": "radio",
    "label": "Should I continue? क्या मैं आगे बढ़ूँ?",
    "conditional": "q_call_status === '1'",
    "required": true,
    "options": [
      { "key": "opt_yes", "label": "Yes हाँ", "value": "1" },
      { "key": "opt_no", "label": "No नहीं", "value": "2" }
    ],
    "rules": {
      "clearFields": {
        "opt_no": ["resp_age", "resp_registered_voter", "resp_gender", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15", "q16_a", "q16_b", "q17", "q19", "resp_religion", "resp_social_cat", "resp_caste_jati", "resp_female_edu", "resp_male_edu", "resp_occupation", "thanks_future"]
      },
      "showFields": {
        "opt_yes": ["resp_age"]
      }
    }
  },
  {
    "key": "resp_age",
    "type": "number",
    "label": "आप कितने साल के हो अभी?",
    "conditional": "consent === '1'",
    "required": true,
    "min": 10,
    "max": 99,
    "placeholder": "Enter age",
    "rules": {
      "clearFields": {
        "age_validation": {
          "condition": "value < 18",
          "fields": ["resp_registered_voter", "resp_gender", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15", "q16_a", "q16_b", "q17", "q19", "resp_religion", "resp_social_cat", "resp_caste_jati", "resp_female_edu", "resp_male_edu", "resp_occupation", "thanks_future"]
        }
      },
      "showFields": {
        "age_18_plus": {
          "condition": "value >= 18",
          "fields": ["resp_registered_voter"]
        }
      }
    }
  },
  {
    "key": "resp_registered_voter",
    "type": "radio",
    "label": "क्या आपका नाम इस विधानसभा में वोटर लिस्ट में है?",
    "conditional": "resp_age >= 18",
    "required": true,
    "options": [
      { "key": "opt_yes", "label": "हाँ", "value": "1" },
      { "key": "opt_no", "label": "नहीं", "value": "2" }
    ],
    "rules": {
      "clearFields": {
        "opt_no": ["resp_gender", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15", "q16_a", "q16_b", "q17", "q19", "resp_religion", "resp_social_cat", "resp_caste_jati", "resp_female_edu", "resp_male_edu", "resp_occupation", "thanks_future"]
      },
      "showFields": {
        "opt_yes": ["resp_gender"]
      }
    }
  },
  {
    "key": "resp_gender",
    "type": "radio",
    "label": "जवाब देने वाला महिला है या पुरुष, ये नोट कर लीजिए।",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_male", "label": "पुरुष", "value": "1" },
      { "key": "opt_female", "label": "महिला", "value": "2" }
    ],
    "rules": {
      "showFields": {
        "opt_male": ["q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15", "q16_a", "q16_b", "q17", "q19", "resp_religion", "resp_social_cat", "resp_caste_jati", "resp_female_edu", "resp_male_edu", "resp_occupation", "thanks_future"],
        "opt_female": ["q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15", "q16_a", "q16_b", "q17", "q19", "resp_religion", "resp_social_cat", "resp_caste_jati", "resp_female_edu", "resp_male_edu", "resp_occupation", "thanks_future"]
      }
    }
  },
  {
    "key": "q5",
    "type": "radio",
    "label": "पिछले विधानसभा चुनाव (2021) में आपने किस पार्टी को वोट दिया था?",
    "conditional": "resp_age >= 22 && resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_aitc", "label": "AITC (Trinamool Congress)", "value": "1" },
      { "key": "opt_bjp", "label": "BJP", "value": "2" },
      { "key": "opt_inc", "label": "INC (Congress)", "value": "3" },
      { "key": "opt_left", "label": "Left Front", "value": "4" },
      { "key": "opt_independent", "label": "Independent", "value": "12" },
      { "key": "opt_others", "label": "Others (specify)", "value": "44" },
      { "key": "opt_nota", "label": "NOTA", "value": "55" },
      { "key": "opt_did_not_vote", "label": "Did not vote", "value": "66" },
      { "key": "opt_not_eligible", "label": "Not eligible for voting", "value": "77" },
      { "key": "opt_no_response", "label": "No response/Refused to answer", "value": "88" }
    ],
    "rules": {
      "showFields": {
        "opt_others": ["q5_oth"],
        "opt_independent": ["q5_ind"]
      },
      "clearFields": {
        "opt_others": ["q5_ind"],
        "opt_independent": ["q5_oth"]
      }
    }
  },
  {
    "key": "q5_oth",
    "type": "text",
    "label": "Others (specify)",
    "conditional": "q5 === '44'",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "q5_ind",
    "type": "text",
    "label": "Independent (specify)",
    "conditional": "q5 === '12'",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "q6",
    "type": "radio",
    "label": "पिछले लोकसभा चुनाव (2024) में आपने किस पार्टी को वोट दिया था?",
    "conditional": "resp_age >= 19 && resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_aitc", "label": "AITC (Trinamool Congress)", "value": "1" },
      { "key": "opt_bjp", "label": "BJP", "value": "2" },
      { "key": "opt_inc", "label": "INC (Congress)", "value": "3" },
      { "key": "opt_left", "label": "Left Front", "value": "4" },
      { "key": "opt_independent", "label": "Independent", "value": "12" },
      { "key": "opt_others", "label": "Others (specify)", "value": "44" },
      { "key": "opt_nota", "label": "NOTA", "value": "55" },
      { "key": "opt_did_not_vote", "label": "Did not vote", "value": "66" },
      { "key": "opt_not_eligible", "label": "Not eligible for voting", "value": "77" },
      { "key": "opt_refused", "label": "Refused to answer", "value": "88" }
    ],
    "rules": {
      "showFields": {
        "opt_others": ["q6_oth"],
        "opt_independent": ["q6_ind"]
      },
      "clearFields": {
        "opt_others": ["q6_ind"],
        "opt_independent": ["q6_oth"]
      }
    }
  },
  {
    "key": "q6_oth",
    "type": "text",
    "label": "Others (specify)",
    "conditional": "q6 === '44'",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "q6_ind",
    "type": "text",
    "label": "Independent (specify)",
    "conditional": "q6 === '12'",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "q7",
    "type": "radio",
    "label": "2021 के बाद आपके विधानसभा क्षेत्र में हुए उपचुनाव में आपने किस पार्टी को वोट दिया?",
    "conditional": "resp_age >= 20 && resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_aitc", "label": "AITC (Trinamool Congress)", "value": "1" },
      { "key": "opt_bjp", "label": "BJP", "value": "2" },
      { "key": "opt_inc", "label": "INC (Congress)", "value": "3" },
      { "key": "opt_left", "label": "Left Front", "value": "4" },
      { "key": "opt_independent", "label": "Independent", "value": "12" },
      { "key": "opt_others", "label": "Others (specify)", "value": "44" },
      { "key": "opt_nota", "label": "NOTA", "value": "55" },
      { "key": "opt_did_not_vote", "label": "Did not vote", "value": "66" },
      { "key": "opt_not_eligible", "label": "Not eligible for voting", "value": "77" },
      { "key": "opt_refused", "label": "Refused to answer", "value": "88" }
    ],
    "rules": {
      "showFields": {
        "opt_others": ["q7_oth"],
        "opt_independent": ["q7_ind"]
      },
      "clearFields": {
        "opt_others": ["q7_ind"],
        "opt_independent": ["q7_oth"]
      }
    }
  },
  {
    "key": "q7_oth",
    "type": "text",
    "label": "Others (specify)",
    "conditional": "q7 === '44'",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "q7_ind",
    "type": "text",
    "label": "Independent (specify)",
    "conditional": "q7 === '12'",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "q8",
    "type": "radio",
    "label": "अगर कल विधानसभा चुनाव (MLA) हों, तो आप किस पार्टी को वोट देंगे?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_aitc", "label": "AITC (Trinamool Congress)", "value": "1" },
      { "key": "opt_bjp", "label": "BJP", "value": "2" },
      { "key": "opt_inc", "label": "INC (Congress)", "value": "3" },
      { "key": "opt_left", "label": "Left Front", "value": "4" },
      { "key": "opt_independent", "label": "Independent", "value": "12" },
      { "key": "opt_others", "label": "Others (specify)", "value": "44" },
      { "key": "opt_nota", "label": "NOTA", "value": "55" },
      { "key": "opt_will_not_vote", "label": "Will not vote", "value": "67" },
      { "key": "opt_not_decided", "label": "Not yet decided", "value": "78" },
      { "key": "opt_refused", "label": "Refused to answer", "value": "88" }
    ],
    "rules": {
      "showFields": {
        "opt_others": ["q8_oth"],
        "opt_independent": ["q8_ind"]
      },
      "clearFields": {
        "opt_others": ["q8_ind"],
        "opt_independent": ["q8_oth"]
      }
    }
  },
  {
    "key": "q8_oth",
    "type": "text",
    "label": "Others (specify)",
    "conditional": "q8 === '44'",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "q8_ind",
    "type": "text",
    "label": "Independent (specify)",
    "conditional": "q8 === '12'",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "q9",
    "type": "radio",
    "label": "मान लीजिए कि आपकी पसंदीदा पार्टी आपके विधानसभा क्षेत्र से चुनाव नहीं लड़ती है, तो आप किस पार्टी को चुनेंगे?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_aitc", "label": "AITC (Trinamool Congress)", "value": "1" },
      { "key": "opt_bjp", "label": "BJP", "value": "2" },
      { "key": "opt_inc", "label": "INC (Congress)", "value": "3" },
      { "key": "opt_left", "label": "Left Front", "value": "4" },
      { "key": "opt_independent", "label": "Independent", "value": "12" },
      { "key": "opt_others", "label": "Others (specify)", "value": "44" },
      { "key": "opt_nota", "label": "NOTA", "value": "55" },
      { "key": "opt_will_not_vote", "label": "I will not vote for anyone else", "value": "67" },
      { "key": "opt_refused", "label": "Refused to answer", "value": "88" }
    ],
    "rules": {
      "showFields": {
        "opt_others": ["q9_oth"],
        "opt_independent": ["q9_ind"]
      },
      "clearFields": {
        "opt_others": ["q9_ind"],
        "opt_independent": ["q9_oth"]
      },
      "excludeOptions": "q8"
    }
  },
  {
    "key": "q9_oth",
    "type": "text",
    "label": "Others (specify)",
    "conditional": "q9 === '44'",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "q9_ind",
    "type": "text",
    "label": "Independent (specify)",
    "conditional": "q9 === '12'",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "q10",
    "type": "checkbox",
    "label": "आपने जिस पार्टी को अपनी दूसरी पसंद चुना है, उसके पीछे क्या कारण हैं?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "maxSelections": 1,
    "options": [
      { "key": "opt_caste_community", "label": "The party works for my caste and community", "value": "1" },
      { "key": "opt_good_arguments", "label": "The party makes some good arguments in their speeches", "value": "2" },
      { "key": "opt_supports_first_choice", "label": "The party supports my first choice party", "value": "3" },
      { "key": "opt_leaders_work_bengal", "label": "The leaders of the party work for Bengal", "value": "4" },
      { "key": "opt_do_not_wish", "label": "Do not wish to vote for any other party", "value": "5" },
      { "key": "opt_others", "label": "Others(Specify)", "value": "44" },
      { "key": "opt_dont_know", "label": "Don't know/can't say", "value": "99" }
    ],
    "rules": {
      "exclusiveOptions": ["5", "99"],
      "showFields": {
        "opt_others": ["q10_oth"]
      }
    }
  },
  {
    "key": "q10_oth",
    "type": "text",
    "label": "Others (specify)",
    "conditional": "q10.includes('44')",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "q11",
    "type": "checkbox",
    "label": "आपकी राय में तृणमूल कांग्रेस (AITC) को वोट देने के शीर्ष 3 कारण क्या हैं?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "maxSelections": 3,
    "options": [
      { "key": "opt_performed_well", "label": "The party has performed well in the state", "value": "1" },
      { "key": "opt_good_governance", "label": "For Good governance /delivering government services", "value": "2" },
      { "key": "opt_benefit_wb", "label": "For the benefit of West Bengal", "value": "3" },
      { "key": "opt_development_wb", "label": "For the development of WB", "value": "4" },
      { "key": "opt_good_services", "label": "The party provides good services when it comes to healthcare/education/drinking water/electricity/housing", "value": "5" },
      { "key": "opt_farmers", "label": "Works for farmers/agriculture/irrigation", "value": "6" },
      { "key": "opt_small_business", "label": "Promotes small businesses", "value": "7" },
      { "key": "opt_works_poor", "label": "Works for the poor", "value": "8" },
      { "key": "opt_control_price", "label": "To control price rise", "value": "9" },
      { "key": "opt_employment", "label": "The party will generate more employment", "value": "11" },
      { "key": "opt_communal_harmony", "label": "For greater communal harmony", "value": "13" },
      { "key": "opt_mamata_best_cm", "label": "Mamata B. is the best CM of Bengal so far", "value": "14" },
      { "key": "opt_minorities_welfare", "label": "For minorities' welfare", "value": "15" },
      { "key": "opt_others", "label": "Others_______ (specify)", "value": "44" },
      { "key": "opt_dont_know", "label": "Don't know/ Can't Say", "value": "99" }
    ],
    "rules": {
      "exclusiveOptions": ["99"],
      "showFields": {
        "opt_others": ["q11_oth"]
      }
    }
  },
  {
    "key": "q11_oth",
    "type": "text",
    "label": "Others (specify)",
    "conditional": "q11.includes('44')",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "q12",
    "type": "checkbox",
    "label": "आपकी राय में भारतीय जनता पार्टी (भाजपा) को वोट देने के शीर्ष 3 कारण क्या हैं?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "maxSelections": 3,
    "options": [
      { "key": "opt_stable_govt", "label": "BJP has proven to be a stable govt. at the centre", "value": "1" },
      { "key": "opt_good_governance", "label": "For Good governance /delivering government services", "value": "2" },
      { "key": "opt_narendra_modi", "label": "Because of Narendra Modi: good/ strong/decisive leader", "value": "3" },
      { "key": "opt_better_development", "label": "For the better development of WB", "value": "5" },
      { "key": "opt_better_farmers", "label": "Better for farmers/agriculture/irrigation", "value": "6" },
      { "key": "opt_better_small_business", "label": "Better for small businesses", "value": "7" },
      { "key": "opt_better_healthcare", "label": "For better healthcare/education/drinking water/electricity/housing", "value": "8" },
      { "key": "opt_welfare_schemes", "label": "For good welfare schemes", "value": "9" },
      { "key": "opt_better_hindus", "label": "BJP is better for Hindus", "value": "11" },
      { "key": "opt_cares_poor", "label": "BJP cares for the poor", "value": "12" },
      { "key": "opt_tmc_not_performed", "label": "TMC has not performed in West Bengal", "value": "14" },
      { "key": "opt_others", "label": "Others (Specify)", "value": "44" },
      { "key": "opt_dont_know", "label": "Don't Know/Can't say", "value": "99" }
    ],
    "rules": {
      "exclusiveOptions": ["99"],
      "showFields": {
        "opt_others": ["q12_oth"]
      }
    }
  },
  {
    "key": "q12_oth",
    "type": "text",
    "label": "Others (specify)",
    "conditional": "q12.includes('44')",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "q13",
    "type": "checkbox",
    "label": "आपको क्या लगता है, आपके इलाके की सबसे बड़ी 3 दिक़्क़तें कौन-सी हैं?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "maxSelections": 3,
    "options": [
      { "key": "opt_professional_degree", "label": "Professional Degree", "value": "1" },
      { "key": "opt_price_rise", "label": "Price rise / inflation", "value": "2" },
      { "key": "opt_unemployment", "label": "Unemployment / lack of jobs", "value": "3" },
      { "key": "opt_electricity", "label": "Electricity/power problems", "value": "4" },
      { "key": "opt_healthcare", "label": "Healthcare not good", "value": "5" },
      { "key": "opt_education", "label": "Education system issues", "value": "6" },
      { "key": "opt_voter_list", "label": "Voter list issues / fear of losing citizenship", "value": "7" },
      { "key": "opt_migrant_safety", "label": "Safety for migrant workers", "value": "8" },
      { "key": "opt_teacher_protests", "label": "Teacher protests & job insecurity", "value": "9" },
      { "key": "opt_floods", "label": "Floods and natural disasters", "value": "10" },
      { "key": "opt_communal_tensions", "label": "Communal tensions / law-and-order concerns", "value": "11" },
      { "key": "opt_women_safety", "label": "Safety of women (crime / security)", "value": "12" },
      { "key": "opt_infrastructure", "label": "Infrastructure (roads, connectivity)", "value": "13" },
      { "key": "opt_others", "label": "Others(Specify)", "value": "44" }
    ],
    "rules": {
      "showFields": {
        "opt_others": ["q13_oth"]
      }
    }
  },
  {
    "key": "q13_oth",
    "type": "text",
    "label": "Others (specify)",
    "conditional": "q13.includes('44')",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "q14",
    "type": "radio",
    "label": "ममता बनर्जी की सरकार के काम से आप कितने खुश या नाखुश हैं?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_fully_satisfied", "label": "पूरी तरह संतुष्ट", "value": "1" },
      { "key": "opt_somewhat_satisfied", "label": "कुछ हद तक संतुष्ट", "value": "2" },
      { "key": "opt_neutral", "label": "तटस्थ/पता नहीं", "value": "3" },
      { "key": "opt_somewhat_dissatisfied", "label": "कुछ हद तक असंतुष्ट", "value": "4" },
      { "key": "opt_fully_dissatisfied", "label": "पूरी तरह असंतुष्ट", "value": "5" }
    ]
  },
  {
    "key": "q15",
    "type": "radio",
    "label": "भाजपा ने राज्य में विपक्ष का जो काम किया है, उससे आप कितने खुश या नाखुश हैं?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_fully_satisfied", "label": "पूरी तरह संतुष्ट", "value": "1" },
      { "key": "opt_somewhat_satisfied", "label": "कुछ हद तक संतुष्ट", "value": "2" },
      { "key": "opt_neutral", "label": "तटस्थ/पता नहीं", "value": "3" },
      { "key": "opt_somewhat_dissatisfied", "label": "कुछ हद तक असंतुष्ट", "value": "4" },
      { "key": "opt_fully_dissatisfied", "label": "पूरी तरह असंतुष्ट", "value": "5" }
    ]
  },
  {
    "key": "q16_a",
    "type": "radio",
    "label": "आपके संसदीय क्षेत्र (लोकसभा) के सांसद के कार्य से आप कितने संतुष्ट या असंतुष्ट हैं?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_fully_satisfied", "label": "पूरी तरह संतुष्ट", "value": "1" },
      { "key": "opt_somewhat_satisfied", "label": "कुछ हद तक संतुष्ट", "value": "2" },
      { "key": "opt_neutral", "label": "तटस्थ/पता नहीं", "value": "3" },
      { "key": "opt_somewhat_dissatisfied", "label": "कुछ हद तक असंतुष्ट", "value": "4" },
      { "key": "opt_fully_dissatisfied", "label": "पूरी तरह असंतुष्ट", "value": "5" }
    ]
  },
  {
    "key": "q16_b",
    "type": "radio",
    "label": "आपके वर्तमान विधायक (MLA) के कार्य से आप कितने संतुष्ट या असंतुष्ट हैं?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_fully_satisfied", "label": "पूरी तरह संतुष्ट", "value": "1" },
      { "key": "opt_somewhat_satisfied", "label": "कुछ हद तक संतुष्ट", "value": "2" },
      { "key": "opt_neutral", "label": "तटस्थ/पता नहीं", "value": "3" },
      { "key": "opt_somewhat_dissatisfied", "label": "कुछ हद तक असंतुष्ट", "value": "4" },
      { "key": "opt_fully_dissatisfied", "label": "पूरी तरह असंतुष्ट", "value": "5" }
    ]
  },
  {
    "key": "q17",
    "type": "radio",
    "label": "आपके विचार में पश्चिम बंगाल का मुख्यमंत्री बनने के लिए सबसे अच्छा नेता कौन है?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_mamata_banerjee", "label": "Mamata Banerjee(TMC)", "value": "1" },
      { "key": "opt_dilip_ghosh", "label": "Dilip Ghosh (BJP)", "value": "2" },
      { "key": "opt_suvendu_adhikari", "label": "Suvendu Adhikari (BJP)", "value": "3" },
      { "key": "opt_sukanta_majumudar", "label": "Sukanta Majumudar (BJP)", "value": "4" },
      { "key": "opt_abhishek_banerjee", "label": "Abhishek Banerjee (TMC)", "value": "5" },
      { "key": "opt_samik_bhattacharya", "label": "Samik Bhattacharya (BJP)", "value": "6" },
      { "key": "opt_subhankar_sarkar", "label": "Subhankar Sarkar (INC)", "value": "7" },
      { "key": "opt_biman_bose", "label": "Biman Bose( Left Front)", "value": "8" },
      { "key": "opt_srideep_bhattacharya", "label": "Srideep (Sridip) Bhattacharya (Left Front)", "value": "9" },
      { "key": "opt_anyone_tmc", "label": "Anyone from TMC", "value": "10" },
      { "key": "opt_anyone_inc", "label": "Anyone from INC", "value": "11" },
      { "key": "opt_anyone_bjp", "label": "Anyone from BJP", "value": "12" },
      { "key": "opt_others", "label": "Others (specify)", "value": "44" }
    ],
    "rules": {
      "showFields": {
        "opt_others": ["q17_oth"]
      }
    }
  },
  {
    "key": "q17_oth",
    "type": "text",
    "label": "Others (specify)",
    "conditional": "q17 === '44'",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "q19",
    "type": "radio",
    "label": "आपके अनुसार, जब अगला विधानसभा चुनाव होगा, तो आपके क्षेत्र से कौन-सी पार्टी जीत सकती है?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_aitc", "label": "AITC (Trinamool Congress)", "value": "1" },
      { "key": "opt_bjp", "label": "BJP", "value": "2" },
      { "key": "opt_inc", "label": "INC (Congress)", "value": "3" },
      { "key": "opt_left", "label": "Left Front", "value": "4" },
      { "key": "opt_others", "label": "Others (specify)", "value": "44" },
      { "key": "opt_dont_know", "label": "Don't know/Can't say", "value": "99" }
    ],
    "rules": {
      "showFields": {
        "opt_others": ["q19_oth"]
      }
    }
  },
  {
    "key": "q19_oth",
    "type": "text",
    "label": "Others (specify)",
    "conditional": "q19 === '44'",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "resp_religion",
    "type": "radio",
    "label": "अगर आप चाहें तो हमें अपना धर्म बता सकते हैं?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_hindu", "label": "Hindu", "value": "1" },
      { "key": "opt_muslim", "label": "Muslim", "value": "2" },
      { "key": "opt_christian", "label": "Christian", "value": "3" },
      { "key": "opt_sikh", "label": "Sikh", "value": "4" },
      { "key": "opt_jain", "label": "Jain", "value": "5" },
      { "key": "opt_buddhist", "label": "Buddhist", "value": "6" },
      { "key": "opt_no_response", "label": "No response", "value": "7" },
      { "key": "opt_others", "label": "Others (Specify)", "value": "44" }
    ],
    "rules": {
      "showFields": {
        "opt_others": ["resp_religion_oth"]
      }
    }
  },
  {
    "key": "resp_religion_oth",
    "type": "text",
    "label": "Others (specify)",
    "conditional": "resp_religion === '44'",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "resp_social_cat",
    "type": "radio",
    "label": "आप किस सामाजिक वर्ग से हैं?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_general", "label": "General/OC", "value": "1" },
      { "key": "opt_sc", "label": "Schedule Castes", "value": "2" },
      { "key": "opt_st", "label": "Schedule Tribes", "value": "3" },
      { "key": "opt_obc", "label": "Other Backward Caste", "value": "4" },
      { "key": "opt_no_response", "label": "No response", "value": "88" }
    ]
  },
  {
    "key": "resp_caste_jati",
    "type": "radio",
    "label": "अगर आप चाहें तो हमें अपनी जाति बता सकते हैं?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_aguri", "label": "Aguri", "value": "1" },
      { "key": "opt_kansabanik", "label": "Kansabanik", "value": "2" },
      { "key": "opt_sadgop", "label": "Sadgop", "value": "3" },
      { "key": "opt_shunri", "label": "Shunri", "value": "4" },
      { "key": "opt_yadav", "label": "Yadav", "value": "5" },
      { "key": "opt_santal", "label": "Santal", "value": "6" },
      { "key": "opt_pod", "label": "Pod", "value": "7" },
      { "key": "opt_tanti", "label": "Tanti", "value": "8" },
      { "key": "opt_namaseej", "label": "Namaseej", "value": "9" },
      { "key": "opt_brahmins", "label": "Brahmins", "value": "10" },
      { "key": "opt_kayasthas", "label": "Kayasthas", "value": "11" },
      { "key": "opt_baidyas", "label": "Baidyas", "value": "12" },
      { "key": "opt_rajputs", "label": "Rajputs", "value": "13" },
      { "key": "opt_kshatriyas", "label": "Kshatriyas", "value": "14" },
      { "key": "opt_barui", "label": "Barui", "value": "15" },
      { "key": "opt_gandha_banik", "label": "Gandha Banik", "value": "16" },
      { "key": "opt_kulin_kayasthas", "label": "Kulin Kayasthas", "value": "17" },
      { "key": "opt_mahishya", "label": "Mahishya", "value": "18" },
      { "key": "opt_namasudra", "label": "Namasudra", "value": "19" },
      { "key": "opt_rajbanshi", "label": "Rajbanshi", "value": "20" },
      { "key": "opt_poundra", "label": "Poundra", "value": "21" },
      { "key": "opt_dom", "label": "Dom", "value": "22" },
      { "key": "opt_bagdi", "label": "Bagdi", "value": "23" },
      { "key": "opt_chamar", "label": "Chamar", "value": "24" },
      { "key": "opt_muchi", "label": "Muchi", "value": "25" },
      { "key": "opt_kori", "label": "Kori", "value": "26" },
      { "key": "opt_haldar", "label": "Haldar", "value": "27" },
      { "key": "opt_santhal", "label": "Santhal", "value": "28" },
      { "key": "opt_munda", "label": "Munda", "value": "29" },
      { "key": "opt_oraon", "label": "Oraon", "value": "30" },
      { "key": "opt_bhumij", "label": "Bhumij", "value": "31" },
      { "key": "opt_ho", "label": "Ho", "value": "32" },
      { "key": "opt_lodha", "label": "Lodha", "value": "33" },
      { "key": "opt_bhil", "label": "Bhil", "value": "34" },
      { "key": "opt_birhor", "label": "Birhor", "value": "35" },
      { "key": "opt_mahali", "label": "Mahali", "value": "36" },
      { "key": "opt_teli", "label": "Teli/Teli Sahu", "value": "37" },
      { "key": "opt_napit", "label": "Napit", "value": "38" },
      { "key": "opt_karmakar", "label": "Karmakar", "value": "39" },
      { "key": "opt_rajak", "label": "Rajak", "value": "40" },
      { "key": "opt_dhoba", "label": "Dhoba", "value": "41" },
      { "key": "opt_hela", "label": "Hela", "value": "42" },
      { "key": "opt_kahar", "label": "Kahar", "value": "43" },
      { "key": "opt_keot", "label": "Keot", "value": "47" },
      { "key": "opt_kurmi", "label": "Kurmi", "value": "45" },
      { "key": "opt_pasi", "label": "Pasi", "value": "46" },
      { "key": "opt_others", "label": "Others (Specify)", "value": "44" },
      { "key": "opt_refused", "label": "Refused to respond", "value": "88" }
    ],
    "rules": {
      "showFields": {
        "opt_others": ["resp_caste_jati_oth"]
      }
    }
  },
  {
    "key": "resp_caste_jati_oth",
    "type": "text",
    "label": "Others (specify)",
    "conditional": "resp_caste_jati === '44'",
    "required": true,
    "placeholder": "Please specify",
    "maxLength": 150
  },
  {
    "key": "resp_female_edu",
    "type": "radio",
    "label": "आपके घर की सबसे पढ़ी-लिखी महिला ने कितनी पढ़ाई की है?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_no_female_adult", "label": "No female adult", "value": "1" },
      { "key": "opt_no_formal_education", "label": "No formal education", "value": "2" },
      { "key": "opt_upto_class_5", "label": "Upto class 5", "value": "3" },
      { "key": "opt_class_6_9", "label": "Class 6-9", "value": "4" },
      { "key": "opt_class_10_14", "label": "Class 10-14", "value": "5" },
      { "key": "opt_degree_regular", "label": "Degree(regular)", "value": "6" },
      { "key": "opt_professional_degree", "label": "Professional Degree", "value": "7" }
    ]
  },
  {
    "key": "resp_male_edu",
    "type": "radio",
    "label": "आपके घर के सबसे पढ़े-लिखे पुरुष की पढ़ाई कितनी हुई है?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_no_male_adult", "label": "No male adult", "value": "1" },
      { "key": "opt_no_formal_education", "label": "No formal education", "value": "2" },
      { "key": "opt_upto_class_5", "label": "Upto class 5", "value": "3" },
      { "key": "opt_class_6_9", "label": "Class 6-9", "value": "4" },
      { "key": "opt_class_10_14", "label": "Class 10-14", "value": "5" },
      { "key": "opt_degree_regular", "label": "Degree(regular)", "value": "6" },
      { "key": "opt_professional_degree", "label": "Professional Degree", "value": "7" }
    ]
  },
  {
    "key": "resp_occupation",
    "type": "radio",
    "label": "आपके घर में जो सबसे ज़्यादा कमाते हैं, उनका काम क्या है?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_labour", "label": "Labour", "value": "2" },
      { "key": "opt_farmer", "label": "Farmer", "value": "3" },
      { "key": "opt_worker", "label": "Worker", "value": "4" },
      { "key": "opt_trader", "label": "Trader", "value": "5" },
      { "key": "opt_clerical", "label": "Clerical Sales/Supervisor", "value": "6" },
      { "key": "opt_managerial", "label": "Managerial/Professional", "value": "7" }
    ]
  },
  {
    "key": "thanks_future",
    "type": "radio",
    "label": "आपके अच्छे सुझावों के लिए धन्यवाद। क्या हम आगे भी आपसे ऐसे ही सर्वे के लिए राय ले सकते हैं?",
    "conditional": "resp_registered_voter === '1'",
    "required": true,
    "options": [
      { "key": "opt_yes", "label": "हाँ", "value": "1" },
      { "key": "opt_no", "label": "नहीं", "value": "2" }
    ]
  }
]
