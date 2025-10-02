export interface FormData {
  // Timer
  time: number;
  
  // Section 1: Identification
  ac_code: string;
  ac_name: string;
  pc_name: string;
  pc_code: string;
  district_name: string;
  district_code: string;
  region_name: string;
  region_code: string;
  mla_name: string;
  mp_name: string;
  
  // Call Status
  number_status: string;
  call_not_ring: string;
  call_ring_status: string;
  q_call_status: string;
  call_reschedule: string;
  telecaller_id: string;
  telecaller_name: string;
  callid: string;
  
  // Section 2: Consent
  consent: string;
  
  // Section 3: Basic Demographic
  resp_age: string;
  resp_registered_voter: string;
  resp_gender: string;
  
  // Section 4: Party Preferences
  q5: string;
  q5_oth: string;
  q5_ind: string;
  q6: string;
  q6_oth: string;
  q6_ind: string;
  q7: string;
  q7_oth: string;
  q7_ind: string;
  q8: string;
  q8_oth: string;
  q8_ind: string;
  q9: string;
  q9_oth: string;
  q9_ind: string;
  q10: string[];
  q10_oth: string;
  q11: string[];
  q11_oth: string;
  q12: string[];
  q12_oth: string;
  q13: string[];
  q13_oth: string;
  
  // Section 5: Satisfaction and Approval Ratings
  q14: string;
  q15: string;
  q16_a: string;
  q16_b: string;
  q17: string;
  q17_oth: string;
  q19: string;
  q19_oth: string;
  
  // Section 6: Basic Demographic
  resp_religion: string;
  resp_religion_oth: string;
  resp_social_cat: string;
  resp_caste_jati: string;
  resp_caste_jati_oth: string;
  resp_female_edu: string;
  resp_male_edu: string;
  resp_occupation: string;
  thanks_future: string;
}

export const initialFormData: FormData = {
  time: 0,
  ac_code: '',
  ac_name: '',
  pc_name: '',
  pc_code: '',
  district_name: '',
  district_code: '',
  region_name: '',
  region_code: '',
  mla_name: '',
  mp_name: '',
  number_status: '1',
  call_not_ring: '',
  call_ring_status: '1',
  q_call_status: '1',
  call_reschedule: '',
  telecaller_id: '',
  telecaller_name: '',
  callid: '',
  consent: '1',
  resp_age: '',
  resp_registered_voter: '',
  resp_gender: '',
  q5: '',
  q5_oth: '',
  q5_ind: '',
  q6: '',
  q6_oth: '',
  q6_ind: '',
  q7: '',
  q7_oth: '',
  q7_ind: '',
  q8: '',
  q8_oth: '',
  q8_ind: '',
  q9: '',
  q9_oth: '',
  q9_ind: '',
  q10: [],
  q10_oth: '',
  q11: [],
  q11_oth: '',
  q12: [],
  q12_oth: '',
  q13: [],
  q13_oth: '',
  q14: '',
  q15: '',
  q16_a: '',
  q16_b: '',
  q17: '',
  q17_oth: '',
  q19: '',
  q19_oth: '',
  resp_religion: '',
  resp_religion_oth: '',
  resp_social_cat: '',
  resp_caste_jati: '',
  resp_caste_jati_oth: '',
  resp_female_edu: '',
  resp_male_edu: '',
  resp_occupation: '',
  thanks_future: '',
};

