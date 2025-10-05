'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { SuccessAlert } from '@/components/ui/Alert';
import { Loader2, Save, X, ChevronDown } from 'lucide-react';
import { apiService } from '@/lib/api';

// Mock AC data - replace with actual API call
const allACs = [
  { value: 1, label: 'Mekliganj (1)' },
  { value: 2, label: 'Mathabhanga (2)' },
  { value: 3, label: 'Cooch Behar Uttar (3)' },
  { value: 4, label: 'Cooch Behar Dakshin (4)' },
  { value: 5, label: 'Sitalkuchi (5)' },
  { value: 6, label: 'Sitai (6)' },
  { value: 7, label: 'Dinhata (7)' },
  { value: 8, label: 'Natabari (8)' },
  { value: 9, label: 'Tufanganj (9)' },
  { value: 10, label: 'Kumargram (10)' },
  { value: 11, label: 'Kalchini (11)' },
  { value: 12, label: 'Alipurduars (12)' },
  { value: 13, label: 'Falakata (13)' },
  { value: 14, label: 'Madarihat (14)' },
  { value: 15, label: 'Dhupguri (15)' },
  { value: 16, label: 'Maynaguri (16)' },
  { value: 17, label: 'Jalpaiguri (17)' },
  { value: 18, label: 'Rajganj (18)' },
  { value: 19, label: 'Dabgram-Fulbari (19)' },
  { value: 20, label: 'Mal (20)' },
  { value: 21, label: 'Nagarkata (21)' },
  { value: 22, label: 'Kalimpong (22)' },
  { value: 23, label: 'Darjeeling (23)' },
  { value: 24, label: 'Kurseong (24)' },
  { value: 25, label: 'Matigara-Naxalbari (25)' },
  { value: 26, label: 'Siliguri (26)' },
  { value: 27, label: 'Phansidewa (27)' },
  { value: 28, label: 'Chopra (28)' },
  { value: 29, label: 'Islamapur (29)' },
  { value: 30, label: 'Goalpokhar (30)' },
  { value: 31, label: 'Chakulia (31)' },
  { value: 32, label: 'Karandighi (32)' },
  { value: 33, label: 'Hemtabad (33)' },
  { value: 34, label: 'Kaliaganj (34)' },
  { value: 35, label: 'Raiganj (35)' },
  { value: 36, label: 'Itahar (36)' },
  { value: 37, label: 'Kushmandi (37)' },
  { value: 38, label: 'Kumarganj (38)' },
  { value: 39, label: 'Balurghat (39)' },
  { value: 40, label: 'Tapan (40)' },
  { value: 41, label: 'Gangarampur (41)' },
  { value: 42, label: 'Harirampur (42)' },
  { value: 43, label: 'Habibpur (43)' },
  { value: 44, label: 'Gazole (44)' },
  { value: 45, label: 'Chanchal (45)' },
  { value: 46, label: 'Harischandrapur (46)' },
  { value: 47, label: 'Malatipur (47)' },
  { value: 48, label: 'Ratua (48)' },
  { value: 49, label: 'Manikchak (49)' },
  { value: 50, label: 'Maldaha (50)' },
  { value: 51, label: 'Englishbazar (51)' },
  { value: 52, label: 'Mothabari (52)' },
  { value: 53, label: 'Sujapur (53)' },
  { value: 54, label: 'Baisnabnagar (54)' },
  { value: 55, label: 'Farakka (55)' },
  { value: 56, label: 'Samserganj (56)' },
  { value: 57, label: 'Suti (57)' },
  { value: 58, label: 'Jangipur (58)' },
  { value: 59, label: 'Raghunathganj (59)' },
  { value: 60, label: 'Sagardighi (60)' },
  { value: 61, label: 'Lalgola (61)' },
  { value: 62, label: 'Bhagabangola (62)' },
  { value: 63, label: 'Raninagar (63)' },
  { value: 64, label: 'Murshidabad (64)' },
  { value: 65, label: 'Nabagram (65)' },
  { value: 66, label: 'Khargram (66)' },
  { value: 67, label: 'Burwan (67)' },
  { value: 68, label: 'Kandi (68)' },
  { value: 69, label: 'Bharatpur (69)' },
  { value: 70, label: 'Rejinagar (70)' },
  { value: 71, label: 'Beldanga (71)' },
  { value: 72, label: 'Baharampur (72)' },
  { value: 73, label: 'Hariharpara (73)' },
  { value: 74, label: 'Naoda (74)' },
  { value: 75, label: 'Domkal (75)' },
  { value: 76, label: 'Jalangi (76)' },
  { value: 77, label: 'Karimpur (77)' },
  { value: 78, label: 'Tehatta (78)' },
  { value: 79, label: 'Palashipara (79)' },
  { value: 80, label: 'Kaliganj (80)' },
  { value: 81, label: 'Nakashipara (81)' },
  { value: 82, label: 'Chapra (82)' },
  { value: 83, label: 'Krishnanagar Uttar (83)' },
  { value: 84, label: 'Nabadwip (84)' },
  { value: 85, label: 'Krishnanagar Dakshin (85)' },
  { value: 86, label: 'Santipur (86)' },
  { value: 87, label: 'Ranaghat Uttar Paschim (87)' },
  { value: 88, label: 'Krishnaganj (88)' },
  { value: 89, label: 'Ranaghat Uttar Purba (89)' },
  { value: 90, label: 'Ranaghat Dakshin (90)' },
  { value: 91, label: 'Chakdaha (91)' },
  { value: 92, label: 'Kalyani (92)' },
  { value: 93, label: 'Haringhata (93)' },
  { value: 94, label: 'Bagda (94)' },
  { value: 95, label: 'Bangaon Uttar (95)' },
  { value: 96, label: 'Bangaon Dakshin (96)' },
  { value: 97, label: 'Gaighata (97)' },
  { value: 98, label: 'Swarupnagar (98)' },
  { value: 99, label: 'Baduria (99)' },
  { value: 100, label: 'Habra (100)' },
  { value: 101, label: 'Ashoknagar (101)' },
  { value: 102, label: 'Amdanga (102)' },
  { value: 103, label: 'Bijpur (103)' },
  { value: 104, label: 'Naihati (104)' },
  { value: 105, label: 'Bhatpara (105)' },
  { value: 106, label: 'Jagatdal (106)' },
  { value: 107, label: 'Noapara (107)' },
  { value: 108, label: 'Barrackpur (108)' },
  { value: 109, label: 'Khardaha (109)' },
  { value: 110, label: 'Dum Dum Uttar (110)' },
  { value: 111, label: 'Panihati (111)' },
  { value: 112, label: 'Kamarhati (112)' },
  { value: 113, label: 'Baranagar (113)' },
  { value: 114, label: 'Dum Dum (114)' },
  { value: 115, label: 'Rajarhat New Town (115)' },
  { value: 116, label: 'Bidhannagar (116)' },
  { value: 117, label: 'Rajarhat Gopalpur (117)' },
  { value: 118, label: 'Madhyamgram (118)' },
  { value: 119, label: 'Barasat (119)' },
  { value: 120, label: 'Deganga (120)' },
  { value: 121, label: 'Haroa (121)' },
  { value: 122, label: 'Minakhan (122)' },
  { value: 123, label: 'Sandeshkhali (123)' },
  { value: 124, label: 'Basirhat Dakshin (124)' },
  { value: 125, label: 'Basirhat Uttar (125)' },
  { value: 126, label: 'Hingalganj (126)' },
  { value: 127, label: 'Gosaba (127)' },
  { value: 128, label: 'Basanti (128)' },
  { value: 129, label: 'Kultali (129)' },
  { value: 130, label: 'Patharpratima (130)' },
  { value: 131, label: 'Kakdwip (131)' },
  { value: 132, label: 'Sagar (132)' },
  { value: 133, label: 'Kulpi (133)' },
  { value: 134, label: 'Raidighi (134)' },
  { value: 135, label: 'Mandirbazar (135)' },
  { value: 136, label: 'Joynagar (136)' },
  { value: 137, label: 'Baruipur Purba (137)' },
  { value: 138, label: 'Canning Paschim (138)' },
  { value: 139, label: 'Canning Purba (139)' },
  { value: 140, label: 'Baruipur Paschim (140)' },
  { value: 141, label: 'Magrahat Purba (141)' },
  { value: 142, label: 'Magrahat Paschim (142)' },
  { value: 143, label: 'Diamond Harbour (143)' },
  { value: 144, label: 'Falta (144)' },
  { value: 145, label: 'Satgachhia (145)' },
  { value: 146, label: 'Bishnupur (146)' },
  { value: 147, label: 'Sonarpur Dakshin (147)' },
  { value: 148, label: 'Bhangar (148)' },
  { value: 149, label: 'Kasba (149)' },
  { value: 150, label: 'Jadavpur (150)' },
  { value: 151, label: 'Sonarpur Uttar (151)' },
  { value: 152, label: 'Tollyganj (152)' },
  { value: 153, label: 'Behala Purba (153)' },
  { value: 154, label: 'Behala Paschim (154)' },
  { value: 155, label: 'Maheshtala (155)' },
  { value: 156, label: 'Budge Budge (156)' },
  { value: 157, label: 'Metiaburuz (157)' },
  { value: 158, label: 'Kolkata Port (158)' },
  { value: 159, label: 'Bhabanipur (159)' },
  { value: 160, label: 'Rashbehari (160)' },
  { value: 161, label: 'Ballygunge (161)' },
  { value: 162, label: 'Chowrangee (162)' },
  { value: 163, label: 'Entally (163)' },
  { value: 164, label: 'Beleghata (164)' },
  { value: 165, label: 'Jorasanko (165)' },
  { value: 166, label: 'Shyampukur (166)' },
  { value: 167, label: 'Maniktola (167)' },
  { value: 168, label: 'Kashipur-Belgachhia (168)' },
  { value: 169, label: 'Bally (169)' },
  { value: 170, label: 'Howrah Uttar (170)' },
  { value: 171, label: 'Howrah Madhya (171)' },
  { value: 172, label: 'Shibpur (172)' },
  { value: 173, label: 'Howrah Dakshin (173)' },
  { value: 174, label: 'Sankrail (174)' },
  { value: 175, label: 'Panchla (175)' },
  { value: 176, label: 'Uluberia Purba (176)' },
  { value: 177, label: 'Uluberia Uttar (177)' },
  { value: 178, label: 'Uluberia Dakshin (178)' },
  { value: 179, label: 'Shyampur (179)' },
  { value: 180, label: 'Bagnan (180)' },
  { value: 181, label: 'Amta (181)' },
  { value: 182, label: 'Udaynarayanpur (182)' },
  { value: 183, label: 'Jagatballavpur (183)' },
  { value: 184, label: 'Domjur (184)' },
  { value: 185, label: 'Uttarpara (185)' },
  { value: 186, label: 'Sreerampur (186)' },
  { value: 187, label: 'Champdani (187)' },
  { value: 188, label: 'Singur (188)' },
  { value: 189, label: 'Chandannagar (189)' },
  { value: 190, label: 'Chunchura (190)' },
  { value: 191, label: 'Balagarh (191)' },
  { value: 192, label: 'Pandua (192)' },
  { value: 193, label: 'Saptagram (193)' },
  { value: 194, label: 'Chanditala (194)' },
  { value: 195, label: 'Jangipara (195)' },
  { value: 196, label: 'Haripal (196)' },
  { value: 197, label: 'Dhanekhali (197)' },
  { value: 198, label: 'Tarakeswar (198)' },
  { value: 199, label: 'Pursurah (199)' },
  { value: 200, label: 'Arambag (200)' },
  { value: 201, label: 'Goghat (201)' },
  { value: 202, label: 'Khanakul (202)' },
  { value: 203, label: 'Tamluk (203)' },
  { value: 204, label: 'Panskura Purba (204)' },
  { value: 205, label: 'Panskura Paschim (205)' },
  { value: 206, label: 'Moyna (206)' },
  { value: 207, label: 'Nandakumar (207)' },
  { value: 208, label: 'Mahishadal (208)' },
  { value: 209, label: 'Haldia (209)' },
  { value: 210, label: 'Nandigram (210)' },
  { value: 211, label: 'Chandipur (211)' },
  { value: 212, label: 'Patashpur (212)' },
  { value: 213, label: 'Kanthi Uttar (213)' },
  { value: 214, label: 'Bhagabanpur (214)' },
  { value: 215, label: 'Khejuri (215)' },
  { value: 216, label: 'Kanthi Dakshin (216)' },
  { value: 217, label: 'Ramnagar (217)' },
  { value: 218, label: 'Egra (218)' },
  { value: 219, label: 'Dantan (219)' },
  { value: 220, label: 'Nayagram (220)' },
  { value: 221, label: 'Gopiballavpur (221)' },
  { value: 222, label: 'Jhargram (222)' },
  { value: 223, label: 'Keshiary (223)' },
  { value: 224, label: 'Kharagpur Sadar (224)' },
  { value: 225, label: 'Narayangarh (225)' },
  { value: 226, label: 'Sabang (226)' },
  { value: 227, label: 'Pingla (227)' },
  { value: 228, label: 'Kharagpur (228)' },
  { value: 229, label: 'Debra (229)' },
  { value: 230, label: 'Daspur (230)' },
  { value: 231, label: 'Ghatal (231)' },
  { value: 232, label: 'Chandrakona (232)' },
  { value: 233, label: 'Garbeta (233)' },
  { value: 234, label: 'Salboni (234)' },
  { value: 235, label: 'Keshpur (235)' },
  { value: 236, label: 'Medinipur (236)' },
  { value: 237, label: 'Binpur (237)' },
  { value: 238, label: 'Bandwan (238)' },
  { value: 239, label: 'Balarampur (239)' },
  { value: 240, label: 'Baghmundi (240)' },
  { value: 241, label: 'Joypur (241)' },
  { value: 242, label: 'Purulia (242)' },
  { value: 243, label: 'Manbazar (243)' },
  { value: 244, label: 'Kashipur (244)' },
  { value: 245, label: 'Para (245)' },
  { value: 246, label: 'Raghunathpur (246)' },
  { value: 247, label: 'Saltora (247)' },
  { value: 248, label: 'Chhatna (248)' },
  { value: 249, label: 'Ranibandh (249)' },
  { value: 250, label: 'Raipur (250)' },
  { value: 251, label: 'Taldangra (251)' },
  { value: 252, label: 'Bankura (252)' },
  { value: 253, label: 'Barjora (253)' },
  { value: 254, label: 'Onda (254)' },
  { value: 255, label: 'Bishnupure (255)' },
  { value: 256, label: 'Katulpur (256)' },
  { value: 257, label: 'Indus (257)' },
  { value: 258, label: 'Sonamukhi (258)' },
  { value: 259, label: 'Khandaghosh (259)' },
  { value: 260, label: 'Burdwan Dakshin (260)' },
  { value: 261, label: 'Raina (261)' },
  { value: 262, label: 'Jamalpur (262)' },
  { value: 263, label: 'Monteswar (263)' },
  { value: 264, label: 'Kalna (264)' },
  { value: 265, label: 'Memari (265)' },
  { value: 266, label: 'Burdwan Uttar (266)' },
  { value: 267, label: 'Bhatar (267)' },
  { value: 268, label: 'Purbasthali Dakshin (268)' },
  { value: 269, label: 'Purbasthali Uttar (269)' },
  { value: 270, label: 'Katwa (270)' },
  { value: 271, label: 'Ketugram (271)' },
  { value: 272, label: 'Mongalkote (272)' },
  { value: 273, label: 'Ausgram (273)' },
  { value: 274, label: 'Galsi (274)' },
  { value: 275, label: 'Pandabeswar (275)' },
  { value: 276, label: 'Durgapur Purba (276)' },
  { value: 277, label: 'Durgapur Paschim (277)' },
  { value: 278, label: 'Raniganj (278)' },
  { value: 279, label: 'Jamuria (279)' },
  { value: 280, label: 'Asansol Dakshin (280)' },
  { value: 281, label: 'Asansol Uttar (281)' },
  { value: 282, label: 'Kulti (282)' },
  { value: 283, label: 'Barabani (283)' },
  { value: 284, label: 'Dubrajpur (284)' },
  { value: 285, label: 'Suri (285)' },
  { value: 286, label: 'Bolpur (286)' },
  { value: 287, label: 'Nanoor (287)' },
  { value: 288, label: 'Labhpur (288)' },
  { value: 289, label: 'Sainthia (289)' },
  { value: 290, label: 'Mayureswar (290)' },
  { value: 291, label: 'Rampurhat (291)' },
  { value: 292, label: 'Hansan (292)' },
  { value: 293, label: 'Nalhati (293)' },
  { value: 294, label: 'Murarai (294)' },
  { value: 295, label: 'AC 295 (295)' },
];

const AssignedACContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('user_id');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [selectedACs, setSelectedACs] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const filteredACs = allACs.filter(ac =>
      ac.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const allFilteredSelected = filteredACs.every(ac => selectedACs.includes(ac.value));
    setSelectAllChecked(allFilteredSelected && filteredACs.length > 0);
  }, [selectedACs, searchTerm]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!userId) {
        setError('User ID is required');
        setLoading(false);
        return;
      }
      
      const response = await apiService.getInterviewerAssignedACs(userId);
      
      if (response.success && response.data) {
        setUserName(response.data.fullname);
        setSelectedACs(response.data.assigned_ac || []);
      } else {
        setError('Failed to fetch user data');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Error fetching user data');
    } finally {
      setLoading(false);
    }
  };

  const handleACToggle = (acValue: number) => {
    setSelectedACs(prev => {
      if (prev.includes(acValue)) {
        return prev.filter(v => v !== acValue);
      } else {
        return [...prev, acValue];
      }
    });
  };

  const handleSelectAllToggle = () => {
    const filteredACs = allACs
      .filter(ac => ac.label.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(ac => ac.value);
    
    if (selectAllChecked) {
      // Deselect all filtered
      setSelectedACs(prev => prev.filter(v => !filteredACs.includes(v)));
    } else {
      // Select all filtered
      setSelectedACs(prev => [...new Set([...prev, ...filteredACs])]);
    }
  };

  const removeSelectedAC = (acValue: number) => {
    setSelectedACs(prev => prev.filter(v => v !== acValue));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      if (!userId) {
        setError('User ID is required');
        setSaving(false);
        return;
      }
      
      const response = await apiService.updateInterviewerAssignedACs(userId, selectedACs);
      
      if (response.success) {
        setSuccess('Assigned ACs updated successfully!');
        // Redirect to master interviewer page after 2 seconds
        setTimeout(() => {
          router.push('/capi/ppm/interviewer/master');
        }, 2000);
      } else {
        setError('Failed to update assigned ACs');
      }
    } catch (err) {
      console.error('Error saving assigned ACs:', err);
      setError('Error saving assigned ACs');
    } finally {
      setSaving(false);
    }
  };

  const filteredACs = allACs.filter(ac =>
    ac.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading user data...</Text>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={3} className="text-gray-800">
            Update Enumerator User: {userName}
          </Heading>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6">
          <SuccessAlert dismissible onDismiss={() => setSuccess(null)}>
            {success}
          </SuccessAlert>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
          <Text className="text-red-800">{error}</Text>
        </div>
      )}

      {/* Main Card */}
      <Card>
        <div className="space-y-6">
          {/* Multi-Select Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Assigned AC
            </label>
            
            {/* Selected Items Display */}
            <div className="min-h-[60px] border border-gray-300 rounded-lg p-3 bg-white">
              <div className="flex flex-wrap gap-2">
                {selectedACs.map((acValue) => {
                  const ac = allACs.find(a => a.value === acValue);
                  return ac ? (
                    <div
                      key={acValue}
                      className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{ac.label}</span>
                      <button
                        onClick={() => removeSelectedAC(acValue)}
                        className="ml-2 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
              
              {/* Dropdown Toggle */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left text-gray-500 hover:text-gray-700"
                >
                  <span>Select AC</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Search ACs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Select All Checkbox */}
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectAllChecked}
                          onChange={handleSelectAllToggle}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">Select all</span>
                      </label>
                    </div>

                    {/* AC Options */}
                    <div className="max-h-40 overflow-y-auto">
                      {filteredACs.map((ac) => (
                        <label
                          key={ac.value}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedACs.includes(ac.value)}
                            onChange={() => handleACToggle(ac.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">{ac.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-start">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
};

const AssignedACPage = () => {
  return (
    <Suspense fallback={
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading...</Text>
          </div>
        </div>
      </Container>
    }>
      <AssignedACContent />
    </Suspense>
  );
};

export default AssignedACPage;
