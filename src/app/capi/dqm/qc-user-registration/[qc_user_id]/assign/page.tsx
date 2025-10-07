'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import SuccessBanner from '@/components/ui/SuccessBanner';

const QCUserAssignPage = ({ params }: { params: Promise<{ qc_user_id: string }> }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const qcUserId = resolvedParams.qc_user_id;
  
  const [loading, setLoading] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [formData, setFormData] = useState({
    ac_codes: [] as string[],
    interviewer_ids: [] as string[]
  });
  
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [qcUserName, setQcUserName] = useState('');
  const { success, error: showError } = useToast();

  // AC Codes options (based on the provided HTML)
  const acCodeOptions = [
    { value: '1', label: 'Valmiki Nagar (1)' },
    { value: '2', label: 'Ramnagar (SC) (2)' },
    { value: '3', label: 'Narkatiaganj (3)' },
    { value: '4', label: 'Bagaha (4)' },
    { value: '5', label: 'Lauriya (5)' },
    { value: '6', label: 'Nautan (6)' },
    { value: '7', label: 'Chanpatia (7)' },
    { value: '8', label: 'Bettiah (8)' },
    { value: '9', label: 'Sikta (9)' },
    { value: '10', label: 'Raxaul (10)' },
    { value: '11', label: 'Sugauli (11)' },
    { value: '12', label: 'Narkatia (12)' },
    { value: '13', label: 'Harsidhi (SC) (13)' },
    { value: '14', label: 'Govindganj (14)' },
    { value: '15', label: 'Kesaria (15)' },
    { value: '16', label: 'Kalyanpur (16)' },
    { value: '17', label: 'Pipra (17)' },
    { value: '18', label: 'Madhuban (18)' },
    { value: '19', label: 'Motihari (19)' },
    { value: '20', label: 'Chiraia (20)' },
    { value: '21', label: 'Dhaka (21)' },
    { value: '22', label: 'Sheohar (22)' },
    { value: '23', label: 'Riga (23)' },
    { value: '24', label: 'Bathnaha (SC) (24)' },
    { value: '25', label: 'Parihar (25)' },
    { value: '26', label: 'Sursand (26)' },
    { value: '27', label: 'Bajpatti (27)' },
    { value: '28', label: 'Sitamarhi (28)' },
    { value: '29', label: 'Runnisaidpur (29)' },
    { value: '30', label: 'Belsand (30)' },
    { value: '31', label: 'Harlakhi (31)' },
    { value: '32', label: 'Benipatti (32)' },
    { value: '33', label: 'Khajauli (33)' },
    { value: '34', label: 'Babubarhi (34)' },
    { value: '35', label: 'Bisfi (35)' },
    { value: '36', label: 'Madhubani (36)' },
    { value: '37', label: 'Rajnagar (SC) (37)' },
    { value: '38', label: 'Jhanjharpur (38)' },
    { value: '39', label: 'Phulparas (39)' },
    { value: '40', label: 'Laukaha (40)' },
    { value: '41', label: 'Nirmali (41)' },
    { value: '42', label: 'Pipra (42)' },
    { value: '43', label: 'Supaul (43)' },
    { value: '44', label: 'Triveniganj (SC) (44)' },
    { value: '45', label: 'Chhatapur (45)' },
    { value: '46', label: 'Narpatganj (46)' },
    { value: '47', label: 'Raniganj (SC) (47)' },
    { value: '48', label: 'Forbesganj (48)' },
    { value: '49', label: 'Araria (49)' },
    { value: '50', label: 'Jokihat (50)' },
    { value: '51', label: 'Sikti (51)' },
    { value: '52', label: 'Bahadurganj (52)' },
    { value: '53', label: 'Thakurganj (53)' },
    { value: '54', label: 'Kishanganj (54)' },
    { value: '55', label: 'Kochadhaman (55)' },
    { value: '56', label: 'Amour (56)' },
    { value: '57', label: 'Baisi (57)' },
    { value: '58', label: 'Kasba (58)' },
    { value: '59', label: 'Banmankhi (SC) (59)' },
    { value: '60', label: 'Rupauli (60)' },
    { value: '61', label: 'Dhamdaha (61)' },
    { value: '62', label: 'Purnia (62)' },
    { value: '63', label: 'Katihar (63)' },
    { value: '64', label: 'Kadwa (64)' },
    { value: '65', label: 'Balrampur (65)' },
    { value: '66', label: 'Pranpur (66)' },
    { value: '67', label: 'Manihari (ST) (67)' },
    { value: '68', label: 'Barari (68)' },
    { value: '69', label: 'Korha (SC) (69)' },
    { value: '70', label: 'Alamnagar (70)' },
    { value: '71', label: 'Bihariganj (71)' },
    { value: '72', label: 'Singheshwar (SC) (72)' },
    { value: '73', label: 'Madhepura (73)' },
    { value: '74', label: 'Sonbarsha (SC) (74)' },
    { value: '75', label: 'Saharsa (75)' },
    { value: '76', label: 'Simri Bakhtiarpur (76)' },
    { value: '77', label: 'Mahishi (77)' },
    { value: '78', label: 'Kusheshwar Asthan (SC) (78)' },
    { value: '79', label: 'Gaura Bauram (79)' },
    { value: '80', label: 'Benipur (80)' },
    { value: '81', label: 'Alinagar (81)' },
    { value: '82', label: 'Darbhanga Rural (82)' },
    { value: '83', label: 'Darbhanga (83)' },
    { value: '84', label: 'Hayaghat (84)' },
    { value: '85', label: 'Bahadurpur (85)' },
    { value: '86', label: 'Keoti (86)' },
    { value: '87', label: 'Jale (87)' },
    { value: '88', label: 'Gaighat (88)' },
    { value: '89', label: 'Aurai (89)' },
    { value: '90', label: 'Minapur (90)' },
    { value: '91', label: 'Bochaha (SC) (91)' },
    { value: '92', label: 'Sakra (SC) (92)' },
    { value: '93', label: 'Kurhani (93)' },
    { value: '94', label: 'Muzaffarpur (94)' },
    { value: '95', label: 'Kanti (95)' },
    { value: '96', label: 'Baruraj (96)' },
    { value: '97', label: 'Paroo (97)' },
    { value: '98', label: 'Sahebganj (98)' },
    { value: '99', label: 'Baikunthpur (99)' },
    { value: '100', label: 'Barauli (100)' },
    { value: '101', label: 'Gopalganj (101)' },
    { value: '102', label: 'Kuchaikote (102)' },
    { value: '103', label: 'Bhorey (SC) (103)' },
    { value: '104', label: 'Hathua (104)' },
    { value: '105', label: 'Siwan (105)' },
    { value: '106', label: 'Ziradei (106)' },
    { value: '107', label: 'Darauli (SC) (107)' },
    { value: '108', label: 'Raghunathpur (108)' },
    { value: '109', label: 'Daraundha (109)' },
    { value: '110', label: 'Barharia (110)' },
    { value: '111', label: 'Goriakothi (111)' },
    { value: '112', label: 'Maharajganj (112)' },
    { value: '113', label: 'Ekma (113)' },
    { value: '114', label: 'Manjhi (114)' },
    { value: '115', label: 'Baniapur (115)' },
    { value: '116', label: 'Taraiya (116)' },
    { value: '117', label: 'Marhaura (117)' },
    { value: '118', label: 'Chapra (118)' },
    { value: '119', label: 'Garkha (SC) (119)' },
    { value: '120', label: 'Amnour (120)' },
    { value: '121', label: 'Parsa (121)' },
    { value: '122', label: 'Sonepur (122)' },
    { value: '123', label: 'Hajipur (123)' },
    { value: '124', label: 'Lalganj (124)' },
    { value: '125', label: 'Vaishali (125)' },
    { value: '126', label: 'Mahua (126)' },
    { value: '127', label: 'Raja Pakar (SC) (127)' },
    { value: '128', label: 'Raghopur (128)' },
    { value: '129', label: 'Mahnar (129)' },
    { value: '130', label: 'Patepur (SC) (130)' },
    { value: '131', label: 'Kalyanpur (SC) (131)' },
    { value: '132', label: 'Warisnagar (132)' },
    { value: '133', label: 'Samastipur (133)' },
    { value: '134', label: 'Ujiarpur (134)' },
    { value: '135', label: 'Morwa (135)' },
    { value: '136', label: 'Sarairanjan (136)' },
    { value: '137', label: 'Mohiuddinnagar (137)' },
    { value: '138', label: 'Bibhutipur (138)' },
    { value: '139', label: 'Rosera (SC) (139)' },
    { value: '140', label: 'Hasanpur (140)' },
    { value: '141', label: 'Cheria Bariarpur (141)' },
    { value: '142', label: 'Bachhwara (142)' },
    { value: '143', label: 'Teghra (143)' },
    { value: '144', label: 'Matihani (144)' },
    { value: '145', label: 'Sahebpur Kamal (145)' },
    { value: '146', label: 'Begusarai (146)' },
    { value: '147', label: 'Bakhri (SC) (147)' },
    { value: '148', label: 'Alauli (SC) (148)' },
    { value: '149', label: 'Khagaria (149)' },
    { value: '150', label: 'Beldaur (150)' },
    { value: '151', label: 'Parbatta (151)' },
    { value: '152', label: 'Bihpur (152)' },
    { value: '153', label: 'Gopalpur (153)' },
    { value: '154', label: 'Pirpainti (SC) (154)' },
    { value: '155', label: 'Kahalgaon (155)' },
    { value: '156', label: 'Bhagalpur (156)' },
    { value: '157', label: 'Sultanganj (157)' },
    { value: '158', label: 'Nathnagar (158)' },
    { value: '159', label: 'Amarpur (159)' },
    { value: '160', label: 'Dhauraiya (SC) (160)' },
    { value: '161', label: 'Banka (161)' },
    { value: '162', label: 'Katoria (ST) (162)' },
    { value: '163', label: 'Belhar (163)' },
    { value: '164', label: 'Tarapur (164)' },
    { value: '165', label: 'Munger (165)' },
    { value: '166', label: 'Jamalpur (166)' },
    { value: '167', label: 'Suryagarha (167)' },
    { value: '168', label: 'Lakhisarai (168)' },
    { value: '169', label: 'Sheikhpura (169)' },
    { value: '170', label: 'Barbigha (170)' },
    { value: '171', label: 'Asthawan (171)' },
    { value: '172', label: 'Biharsharif (172)' },
    { value: '173', label: 'Rajgir (SC) (173)' },
    { value: '174', label: 'Islampur (174)' },
    { value: '175', label: 'Hilsa (175)' },
    { value: '176', label: 'Nalanda (176)' },
    { value: '177', label: 'Harnaut (177)' },
    { value: '178', label: 'Mokama (178)' },
    { value: '179', label: 'Barh (179)' },
    { value: '180', label: 'Bakhtiarpur (180)' },
    { value: '181', label: 'Digha (181)' },
    { value: '182', label: 'Bankipur (182)' },
    { value: '183', label: 'Kumhrar (183)' },
    { value: '184', label: 'Patna Sahib (184)' },
    { value: '185', label: 'Fatuha (185)' },
    { value: '186', label: 'Danapur (186)' },
    { value: '187', label: 'Maner (187)' },
    { value: '188', label: 'Phulwari (SC) (188)' },
    { value: '189', label: 'Masaurhi (SC) (189)' },
    { value: '190', label: 'Paliganj (190)' },
    { value: '191', label: 'Bikram (191)' },
    { value: '192', label: 'Sandesh (192)' },
    { value: '193', label: 'Barhara (193)' },
    { value: '194', label: 'Arrah (194)' },
    { value: '195', label: 'Agiaon (SC) (195)' },
    { value: '196', label: 'Tarari (196)' },
    { value: '197', label: 'Jagdishpur (197)' },
    { value: '198', label: 'Shahpur (198)' },
    { value: '199', label: 'Brahampur (199)' },
    { value: '200', label: 'Buxar (200)' },
    { value: '201', label: 'Dumraon (201)' },
    { value: '202', label: 'Rajpur (SC) (202)' },
    { value: '203', label: 'Ramgarh (203)' },
    { value: '204', label: 'Mohania (SC) (204)' },
    { value: '205', label: 'Bhabua (205)' },
    { value: '206', label: 'Chainpur (206)' },
    { value: '207', label: 'Chenari (SC) (207)' },
    { value: '208', label: 'Sasaram (208)' },
    { value: '209', label: 'Kargahar (209)' },
    { value: '210', label: 'Dinara (210)' },
    { value: '211', label: 'Nokha (211)' },
    { value: '212', label: 'Dehri (212)' },
    { value: '213', label: 'Karakat (213)' },
    { value: '214', label: 'Arwal (214)' },
    { value: '215', label: 'Kurtha (215)' },
    { value: '216', label: 'Jahanabad (216)' },
    { value: '217', label: 'Ghosi (217)' },
    { value: '218', label: 'Makhadumapur (SC) (218)' },
    { value: '219', label: 'Goh (219)' },
    { value: '220', label: 'Obra (220)' },
    { value: '221', label: 'Nabinagar (221)' },
    { value: '222', label: 'Kutumba (SC) (222)' },
    { value: '223', label: 'Aurangabad (223)' },
    { value: '224', label: 'Rafiganj (224)' },
    { value: '225', label: 'Gurua (225)' },
    { value: '226', label: 'Sherghati (226)' },
    { value: '227', label: 'Imamganj (SC) (227)' },
    { value: '228', label: 'Barachatti (SC) (228)' },
    { value: '229', label: 'Bodh Gaya (SC) (229)' },
    { value: '230', label: 'Gaya Town (230)' },
    { value: '231', label: 'Tikari (231)' },
    { value: '232', label: 'Belaganj (232)' },
    { value: '233', label: 'Atri (233)' },
    { value: '234', label: 'Wazirganj (234)' },
    { value: '235', label: 'Rajauli (SC) (235)' },
    { value: '236', label: 'Hisua (236)' },
    { value: '237', label: 'Nawada (237)' },
    { value: '238', label: 'Gobindpur (238)' },
    { value: '239', label: 'Warsaliganj (239)' },
    { value: '240', label: 'Sikandra (SC) (240)' },
    { value: '241', label: 'Jamui (241)' },
    { value: '242', label: 'Jhajha (242)' },
    { value: '243', label: 'Chakai (243)' }
  ];

  // Interviewer IDs options (based on the provided HTML - Valmiki Nagar group)
  const interviewerOptions = [
    { value: '1_101', label: '101' },
    { value: '1_102', label: '102' },
    { value: '1_104', label: '104' }
  ];

  // Fetch QC user data on component mount
  useEffect(() => {
    if (qcUserId) {
      fetchQCUserData();
    } else {
      showError('No QC user ID provided');
      router.push('/capi/dqm/qc-user-registration');
    }
  }, [qcUserId]);

  const fetchQCUserData = async () => {
    if (!qcUserId) {
      showError('No QC user ID provided');
      router.push('/capi/dqm/qc-user-registration');
      return;
    }

    try {
      setFetchLoading(true);
      setFetchError(null);
      
      console.log('🔍 Fetching QC user data for ID:', qcUserId);
      
      // TODO: Replace with actual API call
      // const qcUserData = await getQCUserById(parseInt(qcUserId));
      
      // Mock data for now - replace with actual API call
      const mockQCUserData = {
        name: 'Kundan',
        assigned_ac_codes: ['1'], // Valmiki Nagar is pre-selected
        assigned_interviewer_ids: ['1_101', '1_102', '1_104'] // Pre-selected interviewers
      };
      
      console.log('📊 Mock QC user data:', mockQCUserData);
      
      if (mockQCUserData) {
        setQcUserName(mockQCUserData.name);
        setFormData({
          ac_codes: mockQCUserData.assigned_ac_codes || [],
          interviewer_ids: mockQCUserData.assigned_interviewer_ids || []
        });
      } else {
        console.error('❌ No QC user data received from API');
        setFetchError('Failed to fetch QC user data - no data returned');
      }
    } catch (err) {
      console.error('❌ Error fetching QC user data:', err);
      setFetchError(`Failed to fetch QC user data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: Array.isArray(value) ? value : [value]
    }));
  };

  const validateForm = () => {
    if (formData.ac_codes.length === 0) {
      showError('Please select at least one AC Code');
      return false;
    }
    
    if (formData.interviewer_ids.length === 0) {
      showError('Please select at least one Interviewer ID');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!qcUserId) {
      showError('No QC user ID provided');
      return;
    }
    
    console.log('Assigning AC/Interviewer to QC user:', qcUserId, 'with data:', formData);
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setUpdateError(null);
      
      // TODO: Replace with actual API call
      // const result = await assignACInterviewerToQCUser(parseInt(qcUserId), {
      //   ac_codes: formData.ac_codes,
      //   interviewer_ids: formData.interviewer_ids
      // });

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccessBanner(true);
      // Navigate back to QC user registration list after showing success message
      setTimeout(() => {
        router.push('/capi/dqm/qc-user-registration');
      }, 2000); // Show banner for 2 seconds before navigating
      
    } catch (err) {
      console.error('Error assigning AC/Interviewer:', err);
      setUpdateError('Failed to assign AC/Interviewer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/capi/dqm/qc-user-registration');
  };

  if (fetchLoading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading QC user data...</Text>
          </div>
        </div>
      </Container>
    );
  }

  if (fetchError) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <Card className="mb-6">
          <div className="card-body text-center">
            <div className="text-red-500 mb-4">
              <AlertCircle className="w-16 h-16 mx-auto" />
            </div>
            <Heading level={3} className="text-red-600 mb-2">Error Loading QC User Data</Heading>
            <Text className="text-gray-600 mb-4">{fetchError}</Text>
            <div className="flex space-x-3 justify-center">
              <Button 
                onClick={() => fetchQCUserData()} 
                variant="primary"
              >
                Retry
              </Button>
              <Button 
                onClick={handleBack} 
                variant="destructive"
              >
                Back to List
              </Button>
            </div>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="mb-6">
          <SuccessBanner message="AC/Interviewer Assigned Successfully" />
        </div>
      )}

      {/* Page Title */}
      <Heading level={3} className="mb-6 text-gray-800">
        Assign AC/Interviewer to QC User: {qcUserName}
      </Heading>

      {/* Main Content Card */}
      <Card>
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 mb-5"></div>
            <Heading level={4} className="text-gray-800 font-bold mb-5">
              AC/Interviewer Assignment
            </Heading>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Assignment Section */}
          <div>
            <Heading level={5} className="text-gray-800 mb-4">
              Assignment Details
            </Heading>
            
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  AC Codes
                </Text>
                <SelectDropdown
                  value={formData.ac_codes}
                  onChange={(value) => handleInputChange('ac_codes', Array.isArray(value) ? value : [value])}
                  options={acCodeOptions}
                  multiple
                  placeholder="Select AC Codes"
                />
              </div>

              <div>
                <Text className="block text-sm font-medium text-gray-700 mb-2">
                  Interviewer IDs
                </Text>
                <SelectDropdown
                  value={formData.interviewer_ids}
                  onChange={(value) => handleInputChange('interviewer_ids', Array.isArray(value) ? value : [value])}
                  options={interviewerOptions}
                  multiple
                  placeholder="Select Interviewer IDs"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleSubmit}
              variant="primary"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Assigning...
                </div>
              ) : (
                'Submit'
              )}
            </Button>
            <Button
              onClick={handleBack}
              variant="destructive"
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>

          {/* Error Display */}
          {updateError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <Text className="text-red-700">{updateError}</Text>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default QCUserAssignPage;
