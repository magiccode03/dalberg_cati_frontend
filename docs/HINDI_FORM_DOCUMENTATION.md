# West Bengal Opinion Poll CATI 2025 - Hindi Form Documentation

## Overview
यह दस्तावेज़ Hindi form का पूरा structure दिखाता है। जहाँ Hindi translation उपलब्ध है वहाँ सिर्फ Hindi में है, जहाँ Hindi नहीं है वहाँ English में है।

---

## Section 1: Identification

| Q. | Questions and Filters | Options | Col code |
|----|----------------------|---------|----------|
| A1 | Region name and code | To be selected from the drop-down menu | |
| A2 | District name and code<br>CAPI INSTRUCTION: REFER TO MAPPING SHEET | To be selected from the drop-down menu | |
| A3 | Parliamentary Constituency name and code<br>CAPI INSTRUCTION: REFER TO MAPPING SHEET | To be selected from drop down menu | |
| A4 | Assembly constituency name and code<br>CAPI INSTRUCTION: REFER TO MAPPING SHEET | To be selected from the drop-down menu | |

---

## Section 2: Interviewer Introduction and Statement of Informed Consent

### Introduction Script

नमस्ते, मेरा नाम __________ है। हम कन्वर्जेंट नाम की एक संस्था से बात कर रहे हैं। हम पश्चिम बंगाल में लोगों से सरकार और राजनीति के बारे में उनकी राय जानने के लिए एक सर्वे कर रहे हैं। मैं आपसे कुछ सवाल पूछूँगा/पूछूँगी। आपके जवाब पूरी तरह गोपनीय रखे जाएंगे — किसी को भी आपकी जानकारी नहीं बताई जाएगी। ये सर्वे लगभग 5 से 10 मिनट का है, और आपकी सच्ची राय हमारे लिए बहुत ज़रूरी है।

### Consent Question

| Q. No. | Questions and Filters | Options | Code |
|--------|----------------------|---------|------|
| B.1 | क्या मैं आगे बढ़ूँ?<br>TERMINATE IF CODED 2 | हाँ<br>नहीं | 1<br>2 |

---

## Section 3: Basic Demographic Section:1

| Q. No. | Questions and Filters | Options | Code |
|--------|----------------------|---------|------|
| 1 | आप कितने साल के हो अभी?<br>TERMINATE IF LESS THAN 18 | _______________Years | NA |
| 2 | क्या आपका नाम इस विधानसभा में वोटर लिस्ट में है?<br>TERMINATE IF CODED 2 | हाँ<br>नहीं | 1<br>2 |
| 3 | जवाब देने वाला महिला है या पुरुष, ये नोट कर लीजिए।<br>SINGLE CODING ONLY | पुरुष<br>महिला | 1<br>2 |
| 4 | आपको राजनीतिक पार्टियों और उम्मीदवारों की जानकारी सबसे ज़्यादा कहाँ से मिलती है?<br>MULTIPLE CODING | Television news<br>Print media (newspapers, magazines)<br>Social media platforms (Facebook, Twitter, etc.)<br>Conversations with friends and family<br>Political rallies and events<br>Other (Please specify) | 1<br>2<br>3<br>4<br>5<br>44 |

---

## Section 4: Party Preferences

### Q5: Assembly Elections 2021

**Question:**
पिछले विधानसभा चुनाव (2021) में आपने किस पार्टी को वोट दिया था?

**CAPI INSTRUCTIONS:**
- ASK THIS QUESTION TO 22 YEARS+
- ROTATE THE OPTIONS
- SINGLE CODING ONLY
- IF OTHERS CHOSEN OPEN TO TYPE RESPONSE

**INTERVIEWER INSTRUCTIONS:**
PROBE BUT DO NOT PROMPT

**Options:**
| Option | Code |
|--------|------|
| AITC (Trinamool Congress) | 1 |
| BJP | 2 |
| INC (Congress) | 3 |
| Left Front | 4 |
| Independent | 12 |
| Others (specify) | 44 |
| NOTA | 55 |
| Did not vote | 66 |
| Not eligible for voting | 77 |
| No response/Refused to answer | 88 |

---

### Q6: Lok Sabha Elections 2024

**Question:**
पिछले लोकसभा चुनाव (2024) में आपने किस पार्टी को वोट दिया था?

**CAPI INSTRUCTIONS:**
- ASK THIS QUESTION TO 19 YEARS+
- ROTATE THE OPTIONS
- SINGLE CODING ONLY
- IF OTHERS CHOSEN OPEN TO TYPE RESPONSE

**INTERVIEWER INSTRUCTIONS:**
PROBE BUT DO NOT PROMPT

**Options:**
| Option | Code |
|--------|------|
| AITC (Trinamool Congress) | 1 |
| BJP | 2 |
| INC (Congress) | 3 |
| Left Front | 4 |
| Independent | 12 |
| Others (specify) | 44 |
| NOTA | 55 |
| Did not vote | 66 |
| Not eligible for voting | 77 |
| Refused to answer | 88 |

---

### Q7: By-Elections After 2021

**Question:**
2021 के बाद आपके विधानसभा क्षेत्र में हुए उपचुनाव में आपने किस पार्टी को वोट दिया?

**CAPI INSTRUCTIONS:**
- ASK THIS QUESTION TO 20 YEARS AND ABOVE
- ASK ONLY IF BYE-ELECTION HAPPENED IN THE AC AS PER THE EXCEL LIST
- ROTATE THE OPTIONS
- SINGLE CODING ONLY
- IF OTHERS CHOSEN OPEN TO TYPE RESPONSE

**INTERVIEWER INSTRUCTIONS:**
PROBE BUT DO NOT PROMPT

**Options:**
| Option | Code |
|--------|------|
| AITC (Trinamool Congress) | 1 |
| BJP | 2 |
| INC (Congress) | 3 |
| Left Front | 4 |
| Independent | 12 |
| Others (specify) | 44 |
| NOTA | 55 |
| Did not vote | 66 |
| Not eligible for voting | 77 |
| Refused to answer | 88 |

---

### Q8: Future Voting Intention

**Question:**
अगर कल विधानसभा चुनाव (MLA) हों, तो आप किस पार्टी को वोट देंगे?

**CAPI INSTRUCTIONS:**
- ROTATE THE OPTIONS
- SINGLE CODING ONLY
- IF OTHERS CHOSEN OPEN TO TYPE RESPONSE

**INTERVIEWER INSTRUCTIONS:**
PROBE BUT DO NOT PROMPT

**Options:**
| Option | Code |
|--------|------|
| AITC (Trinamool Congress) | 1 |
| BJP | 2 |
| INC (Congress) | 3 |
| Left Front | 4 |
| Independent | 12 |
| Others (specify) | 44 |
| NOTA | 55 |
| Will not vote | 67 |
| Not yet decided | 78 |
| Refused to answer | 88 |

---

### Q9: Second Choice Party

**Question:**
मान लीजिए कि आपकी पसंदीदा पार्टी आपके विधानसभा क्षेत्र से चुनाव नहीं लड़ती है, तो आप किस पार्टी को चुनेंगे?

**CAPI INSTRUCTIONS:**
- ROTATE THE OPTIONS
- SINGLE CODING ONLY
- IF OTHERS CHOSEN OPEN TO TYPE RESPONSE
- PARTY SELECTED IN Q8 SHOULD NOT APPEAR IN THIS LIST

**INTERVIEWER INSTRUCTIONS:**
PROBE BUT DO NOT PROMPT

**Options:**
| Option | Code |
|--------|------|
| AITC (Trinamool Congress) | 1 |
| BJP | 2 |
| INC (Congress) | 3 |
| Left Front | 4 |
| Independent | 12 |
| Others (specify) | 44 |
| NOTA | 55 |
| I will not vote for anyone else | 67 |
| Refused to answer | 88 |

---

### Q10: Reason for Second Choice

**Question:**
आपने जिस पार्टी को अपनी दूसरी पसंद चुना है, उसके पीछे क्या कारण हैं?

**CAPI INSTRUCTION:**
SINGLE CODING ONLY

**Options:**
| Option | Code |
|--------|------|
| The party works for my caste and community | 1 |
| The party makes some good arguments in their speeches | 2 |
| The party supports my first choice party | 3 |
| The leaders of the party work for Bengal | 4 |
| Do not wish to vote for any other party | 5 |
| Others(Specify) | 44 |
| Don't know/can't say | 99 |

---

### Q11: Top 3 Reasons for Voting AITC

**Question:**
आपकी राय में तृणमूल कांग्रेस (AITC) को वोट देने के शीर्ष 3 कारण क्या हैं?

**CAPI INSTRUCTION:**
SHOULD BE ABLE TO SELECT TOP 3 REASONS ONLY

**INTERVIEWER INSTRUCTION:**
DO NOT READ OPTIONS, SELECT THE MOST APPROPRIATE OPTION BASIS WHAT THE RESPONDENT SAYS SPONTANEOUSLY

**Options:**
| Option | Code |
|--------|------|
| The party has performed well in the state | 1 |
| For Good governance /delivering government services | 2 |
| For the benefit of West Bengal | 3 |
| For the development of WB | 4 |
| The party provides good services when it comes to healthcare/education/drinking water/electricity/housing | 5 |
| Works for farmers/agriculture/irrigation | 6 |
| Promotes small businesses | 7 |
| Works for the poor | 8 |
| To control price rise | 9 |
| The party will generate more employment | 11 |
| For greater communal harmony | 13 |
| Mamata B. is the best CM of Bengal so far | 14 |
| For minorities' welfare | 15 |
| Others_______ (specify) | 44 |
| Don't know/ Can't Say | 99 |

---

### Q12: Top 3 Reasons for Voting BJP

**Question:**
आपकी राय में भारतीय जनता पार्टी (भाजपा) को वोट देने के शीर्ष 3 कारण क्या हैं?

**CAPI INSTRUCTION:**
SHOULD BE ABLE TO SELECT TOP 3 REASONS ONLY

**INTERVIEWER INSTRUCTION:**
DO NOT READ OPTIONS, SELECT THE MOST APPROPRIATE OPTION BASIS WHAT THE RESPONDENT SAYS SPONTANEOUSLY

**Options:**
| Option | Code |
|--------|------|
| BJP has proven to be a stable govt. at the centre | 1 |
| For Good governance /delivering government services | 2 |
| Because of Narendra Modi: good/ strong/decisive leader | 3 |
| For the better development of WB | 5 |
| Better for farmers/agriculture/irrigation | 6 |
| Better for small businesses | 7 |
| For better healthcare/education/drinking water/electricity/housing | 8 |
| For good welfare schemes | 9 |
| BJP is better for Hindus | 11 |
| BJP cares for the poor | 12 |
| TMC has not performed in West Bengal | 14 |
| Others (Specify) | 44 |
| Don't Know/Can't say | 99 |

---

### Q13: Top 3 Pressing Issues

**Question:**
आपको क्या लगता है, आपके इलाके की सबसे बड़ी 3 दिक़्क़तें कौन-सी हैं?

**CAPI INSTRUCTION:**
SHOULD BE ABLE TO SELECT TOP 3 REASONS ONLY

**INTERVIEWER INSTRUCTION:**
DO NOT READ OPTIONS, SELECT THE MOST APPROPRIATE OPTION BASIS WHAT THE RESPONDENT SAYS SPONTANEOUSLY

**Options:**
| Option | Code |
|--------|------|
| Professional Degree | 1 |
| Price rise / inflation | 2 |
| Unemployment / lack of jobs | 3 |
| Electricity/power problems | 4 |
| Healthcare not good | 5 |
| Education system issues | 6 |
| Voter list issues / fear of losing citizenship | 7 |
| Safety for migrant workers | 8 |
| Teacher protests & job insecurity | 9 |
| Floods and natural disasters | 10 |
| Communal tensions / law-and-order concerns | 11 |
| Safety of women (crime / security) | 12 |
| Infrastructure (roads, connectivity) | 13 |
| Others(Specify) | 44 |

---

## Section 5: Satisfaction and Approval Ratings

### Q14: Satisfaction with State Government

**Question:**
ममता बनर्जी की सरकार के काम से आप कितने खुश या नाखुश हैं?

**CAPI INSTRUCTIONS:**
SINGLE CODING ONLY

**INTERVIEWER INSTRUCTIONS:**
READ THE OPTIONS

**Options:**
| Option | Code |
|--------|------|
| पूरी तरह संतुष्ट | 1 |
| कुछ हद तक संतुष्ट | 2 |
| तटस्थ/पता नहीं | 3 |
| कुछ हद तक असंतुष्ट | 4 |
| पूरी तरह असंतुष्ट | 5 |

---

### Q15: Satisfaction with BJP Opposition

**Question:**
भाजपा ने राज्य में विपक्ष का जो काम किया है, उससे आप कितने खुश या नाखुश हैं?

**CAPI INSTRUCTIONS:**
SINGLE CODING ONLY

**INTERVIEWER INSTRUCTIONS:**
READ THE OPTIONS

**Options:**
| Option | Code |
|--------|------|
| पूरी तरह संतुष्ट | 1 |
| कुछ हद तक संतुष्ट | 2 |
| तटस्थ/पता नहीं | 3 |
| कुछ हद तक असंतुष्ट | 4 |
| पूरी तरह असंतुष्ट | 5 |

---

### Q16: Satisfaction with Representatives

**Question:**
निम्नलिखित के कार्य से आप कितने संतुष्ट या असंतुष्ट हैं?

a. आपके संसदीय क्षेत्र (लोकसभा) के सांसद

b. आपके वर्तमान विधायक (MLA)

**CAPI INSTRUCTIONS:**
NAMES OF THE MLA AND MP TO APPEAR AS PER THE ASSEMBLY CONSTITUENCY

**INTERVIEWER INSTRUCTIONS:**
PROBE BUT DO NOT PROMPT

**Options:**
| Option | Code |
|--------|------|
| पूरी तरह संतुष्ट | 1 |
| कुछ हद तक संतुष्ट | 2 |
| तटस्थ/पता नहीं | 3 |
| कुछ हद तक असंतुष्ट | 4 |
| पूरी तरह असंतुष्ट | 5 |

---

### Q17: Best Leader for Chief Minister

**Question:**
आपके विचार में पश्चिम बंगाल का मुख्यमंत्री बनने के लिए सबसे अच्छा नेता कौन है?

**CAPI INSTRUCTIONS:**
SINGLE CODING ONLY

**Options:**
| Option | Code |
|--------|------|
| Mamata Banerjee(TMC) | 1 |
| Dilip Ghosh (BJP) | 2 |
| Suvendu Adhikari (BJP) | 3 |
| Sukanta Majumudar (BJP) | 4 |
| Abhishek Banerjee (TMC) | 5 |
| Samik Bhattacharya (BJP) | 6 |
| Subhankar Sarkar (INC) | 7 |
| Biman Bose( Left Front) | 8 |
| Srideep (Sridip) Bhattacharya (Left Front) | 9 |
| Anyone from TMC | 10 |
| Anyone from INC | 11 |
| Anyone from BJP | 12 |
| Others (specify) | 44 |

---

### Q18: Most Suitable MLA Candidate

**Question:**
मैं कुछ नाम लूँगा/लूँगी, आप बताइए कि आपके इलाके से एमएलए बनने के लिए कौन सबसे सही उम्मीदवार है?

**CAPI INSTRUCTIONS:**
SINGLE CODING ONLY

**Options:**
List to be Provided

---

### Q19: Party Winning Prediction

**Question:**
आपके अनुसार, जब अगला विधानसभा चुनाव होगा, तो आपके क्षेत्र से कौन-सी पार्टी जीत सकती है?

**CAPI INSTRUCTIONS:**
SINGLE CODING ONLY
ROTATE THE TOP 4 PARTIES

**Options:**
| Option | Code |
|--------|------|
| AITC (Trinamool Congress) | 1 |
| BJP | 2 |
| INC (Congress) | 3 |
| Left Front | 4 |
| Others (specify) | 44 |
| Don't know/Can't say | 99 |

---

## Section 6: Basic Demographic Section 2

### Q20: Religion

**Question:**
अगर आप चाहें तो हमें अपना धर्म बता सकते हैं?

**CAPI INSTRUCTIONS:**
SINGLE CODING ONLY

**Options:**
| Option | Code |
|--------|------|
| Hindu | 1 |
| Muslim | 2 |
| Christian | 3 |
| Sikh | 4 |
| Jain | 5 |
| Buddhist | 6 |
| No response | 7 |
| Others (Specify) | 44 |

---

### Q21: Social Category

**Question:**
आप किस सामाजिक वर्ग से हैं?

**CAPI INSTRUCTIONS:**
SINGLE CODING ONLY

**Options:**
| Option | Code |
|--------|------|
| General/OC | 1 |
| Schedule Castes | 2 |
| Schedule Tribes | 3 |
| Other Backward Caste | 4 |
| No response | 88 |

---

### Q22: Caste

**Question:**
अगर आप चाहें तो हमें अपनी जाति बता सकते हैं?

**CAPI INSTRUCTIONS:**
SINGLE CODING ONLY

**Options:**
| Option | Code |
|--------|------|
| Aguri | 1 |
| Kansabanik | 2 |
| sadgop | 3 |
| shunri | 4 |
| Yadav | 5 |
| Santal | 6 |
| Pod | 7 |
| Tanti | 8 |
| Namaseej | 9 |
| Brahmins | 10 |
| Kayasthas | 11 |
| Baidyas | 12 |
| Rajputs | 13 |
| Kshatriyas | 14 |
| Barui | 15 |
| Gandha Banik | 16 |
| Kulin Kayasthas | 17 |
| Mahishya | 18 |
| Namasudra | 19 |
| Rajbanshi | 20 |
| Poundra | 21 |
| Dom | 22 |
| Bagdi | 23 |
| Chamar | 24 |
| Muchi | 25 |
| Kori | 26 |
| Haldar | 27 |
| Santhal | 28 |
| Munda | 29 |
| Oraon | 30 |
| Bhumij | 31 |
| Ho | 32 |
| Lodha | 33 |
| Bhil | 34 |
| Birhor | 35 |
| Mahali | 36 |
| Teli/Teli Sahu | 37 |
| Napit | 38 |
| Karmakar | 39 |
| Rajak | 40 |
| Dhoba | 41 |
| Hela | 42 |
| Kahar | 43 |
| Keot | 47 |
| Kurmi | 45 |
| Pasi | 46 |
| Others (Specify) | 44 |
| Refused to respond | 88 |

---

### Q23: Female Education Level

**Question:**
आपके घर की सबसे पढ़ी-लिखी महिला ने कितनी पढ़ाई की है?

**CAPI INSTRUCTIONS:**
SINGLE CODING ONLY

**Options:**
| Option | Code |
|--------|------|
| No female adult | 1 |
| No formal education | 2 |
| Upto class 5 | 3 |
| Class 6-9 | 4 |
| Class 10-14 | 5 |
| Degree(regular) | 6 |
| Professional Degree | 7 |

---

### Q24: Male Education Level

**Question:**
आपके घर के सबसे पढ़े-लिखे पुरुष की पढ़ाई कितनी हुई है?

**CAPI INSTRUCTIONS:**
SINGLE CODING ONLY

**Options:**
| Option | Code |
|--------|------|
| No male adult | 1 |
| No formal education | 2 |
| Upto class 5 | 3 |
| Class 6-9 | 4 |
| Class 10-14 | 5 |
| Degree(regular) | 6 |
| Professional Degree | 7 |

---

### Q25: Occupation

**Question:**
आपके घर में जो सबसे ज़्यादा कमाते हैं, उनका काम क्या है?

**CAPI INSTRUCTIONS:**
SINGLE CODING ONLY

**Options:**
| Option | Code |
|--------|------|
| Labour | 2 |
| Farmer | 3 |
| Worker | 4 |
| Trader | 5 |
| Clerical Sales/Supervisor | 6 |
| Managerial/Professional | 7 |

---

### Q26: Respondent Name

**Question:**
क्या आप हमें अपना नाम बताना चाहेंगे?

We assure you we shall keep it confidential

**Response:**
_________________Name

---

### Q27: Future Contact

**Question:**
आपके अच्छे सुझावों के लिए धन्यवाद। क्या हम आगे भी आपसे ऐसे ही सर्वे के लिए राय ले सकते हैं?

**CAPI INSTRUCTIONS:**
SINGLE CODING ONLY

**Options:**
| Option | Code |
|--------|------|
| हाँ | 1 |
| नहीं | 2 |

---

## Implementation Notes

### Language Support
- जहाँ Hindi translation उपलब्ध है वहाँ सिर्फ Hindi में दिखाया गया है
- Technical terms, party names, और जिन options का Hindi नहीं है वो English में हैं
- Telecaller name को Section 2 introduction में dynamically insert किया जाना चाहिए

### Data Collection Guidelines
1. **Mandatory Fields**: Age, Registered Voter Status, Gender, Consent
2. **Conditional Logic**: 
   - Questions based on age thresholds (18+, 19+, 20+, 22+)
   - Q7 only if bye-election occurred in the AC
   - Q9 excludes party selected in Q8
3. **Multi-select Questions**: Q4, Q11, Q12, Q13 (top 3 selections)
4. **Text Fields**: Available for "Others" and "Specify" options
5. **Auto-save**: Form should auto-save as draft on every change
6. **Final Submission**: Full validation required

### Technical Requirements
- Response time tracking (form duration in seconds)
- Language selection (English/Bengali/Hindi)
- Timezone and local datetime capture
- Draft save capability
- Call drop partial submission support

---

## Document Version
- **Version**: 1.0
- **Last Updated**: October 2024
- **Source**: form_hindi.txt
- **Language**: Hindi (जहाँ available है), English (जहाँ Hindi नहीं है)

