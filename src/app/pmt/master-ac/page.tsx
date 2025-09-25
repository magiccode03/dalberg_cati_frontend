'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import DataTable from '@/components/tables/DataTable';
import Pagination from '@/components/ui/Pagination';
import { Search, RefreshCw, Download } from 'lucide-react';

interface ACData {
  acCode: number;
  acName: string;
  agencyId: number;
  agencyName: string;
  totalInterview: number;
  validInterview: number;
  action?: any; // For the action column
}

const agencyOptions = [
  { value: '', label: 'Select State Teams' },
  { value: '1', label: 'Kadence' },
  { value: '2', label: 'Chandan' },
  { value: '3', label: 'Rohit' },
  { value: '4', label: 'Parbhat' },
  { value: '5', label: 'Navin' },
  { value: '6', label: 'Aeon' },
  { value: '7', label: 'Abhinav' },
  { value: '8', label: 'Inhouse' },
];

const acOptions = [
  { value: '', label: 'Select AC' },
  { value: '195', label: 'Agiaon (SC) (195)' },
  { value: '70', label: 'Alamnagar (70)' },
  { value: '148', label: 'Alauli (SC) (148)' },
  { value: '81', label: 'Alinagar (81)' },
  { value: '159', label: 'Amarpur (159)' },
  { value: '120', label: 'Amnour (120)' },
  { value: '56', label: 'Amour (56)' },
  { value: '49', label: 'Araria (49)' },
  { value: '194', label: 'Arrah (194)' },
  { value: '214', label: 'Arwal (214)' },
  { value: '171', label: 'Asthawan (171)' },
  { value: '233', label: 'Atri (233)' },
  { value: '89', label: 'Aurai (89)' },
  { value: '223', label: 'Aurangabad (223)' },
  { value: '34', label: 'Babubarhi (34)' },
  { value: '142', label: 'Bachhwara (142)' },
  { value: '4', label: 'Bagaha (4)' },
  { value: '52', label: 'Bahadurganj (52)' },
  { value: '85', label: 'Bahadurpur (85)' },
  { value: '99', label: 'Baikunthpur (99)' },
  { value: '57', label: 'Baisi (57)' },
  { value: '27', label: 'Bajpatti (27)' },
  { value: '147', label: 'Bakhri (SC) (147)' },
  { value: '180', label: 'Bakhtiarpur (180)' },
  { value: '65', label: 'Balrampur (65)' },
  { value: '115', label: 'Baniapur (115)' },
  { value: '161', label: 'Banka (161)' },
  { value: '182', label: 'Bankipur (182)' },
  { value: '59', label: 'Banmankhi (SC) (59)' },
  { value: '228', label: 'Barachatti (SC) (228)' },
  { value: '68', label: 'Barari (68)' },
  { value: '100', label: 'Barauli (100)' },
  { value: '170', label: 'Barbigha (170)' },
  { value: '179', label: 'Barh (179)' },
  { value: '193', label: 'Barhara (193)' },
  { value: '110', label: 'Barharia (110)' },
  { value: '96', label: 'Baruraj (96)' },
  { value: '24', label: 'Bathnaha (SC) (24)' },
  { value: '146', label: 'Begusarai (146)' },
  { value: '232', label: 'Belaganj (232)' },
  { value: '150', label: 'Beldaur (150)' },
  { value: '163', label: 'Belhar (163)' },
  { value: '30', label: 'Belsand (30)' },
  { value: '32', label: 'Benipatti (32)' },
  { value: '80', label: 'Benipur (80)' },
  { value: '8', label: 'Bettiah (8)' },
  { value: '205', label: 'Bhabua (205)' },
  { value: '156', label: 'Bhagalpur (156)' },
  { value: '103', label: 'Bhorey (SC) (103)' },
  { value: '138', label: 'Bibhutipur (138)' },
  { value: '71', label: 'Bihariganj (71)' },
  { value: '172', label: 'Biharsharif (172)' },
  { value: '152', label: 'Bihpur (152)' },
  { value: '191', label: 'Bikram (191)' },
  { value: '35', label: 'Bisfi (35)' },
  { value: '91', label: 'Bochaha (SC) (91)' },
  { value: '229', label: 'Bodh Gaya (SC) (229)' },
  { value: '199', label: 'Brahampur (199)' },
  { value: '200', label: 'Buxar (200)' },
  { value: '206', label: 'Chainpur (206)' },
  { value: '243', label: 'Chakai (243)' },
  { value: '7', label: 'Chanpatia (7)' },
  { value: '118', label: 'Chapra (118)' },
  { value: '207', label: 'Chenari (SC) (207)' },
  { value: '141', label: 'Cheria Bariarpur (141)' },
  { value: '45', label: 'Chhatapur (45)' },
  { value: '20', label: 'Chiraia (20)' },
  { value: '186', label: 'Danapur (186)' },
  { value: '107', label: 'Darauli (SC) (107)' },
  { value: '109', label: 'Daraundha (109)' },
  { value: '83', label: 'Darbhanga (83)' },
  { value: '82', label: 'Darbhanga Rural (82)' },
  { value: '212', label: 'Dehri (212)' },
  { value: '21', label: 'Dhaka (21)' },
  { value: '61', label: 'Dhamdaha (61)' },
  { value: '160', label: 'Dhauraiya (SC) (160)' },
  { value: '181', label: 'Digha (181)' },
  { value: '210', label: 'Dinara (210)' },
  { value: '201', label: 'Dumraon (201)' },
  { value: '113', label: 'Ekma (113)' },
  { value: '185', label: 'Fatuha (185)' },
  { value: '48', label: 'Forbesganj (48)' },
  { value: '88', label: 'Gaighat (88)' },
  { value: '119', label: 'Garkha (SC) (119)' },
  { value: '79', label: 'Gaura Bauram (79)' },
  { value: '230', label: 'Gaya Town (230)' },
  { value: '217', label: 'Ghosi (217)' },
  { value: '238', label: 'Gobindpur (238)' },
  { value: '219', label: 'Goh (219)' },
  { value: '101', label: 'Gopalganj (101)' },
  { value: '153', label: 'Gopalpur (153)' },
  { value: '111', label: 'Goriakothi (111)' },
  { value: '14', label: 'Govindganj (14)' },
  { value: '225', label: 'Gurua (225)' },
  { value: '123', label: 'Hajipur (123)' },
  { value: '31', label: 'Harlakhi (31)' },
  { value: '177', label: 'Harnaut (177)' },
  { value: '13', label: 'Harsidhi (SC) (13)' },
  { value: '140', label: 'Hasanpur (140)' },
  { value: '104', label: 'Hathua (104)' },
  { value: '84', label: 'Hayaghat (84)' },
  { value: '175', label: 'Hilsa (175)' },
  { value: '236', label: 'Hisua (236)' },
  { value: '227', label: 'Imamganj (SC) (227)' },
  { value: '174', label: 'Islampur (174)' },
  { value: '197', label: 'Jagdishpur (197)' },
  { value: '216', label: 'Jahanabad (216)' },
  { value: '87', label: 'Jale (87)' },
  { value: '166', label: 'Jamalpur (166)' },
  { value: '241', label: 'Jamui (241)' },
  { value: '242', label: 'Jhajha (242)' },
  { value: '38', label: 'Jhanjharpur (38)' },
  { value: '50', label: 'Jokihat (50)' },
  { value: '64', label: 'Kadwa (64)' },
  { value: '155', label: 'Kahalgaon (155)' },
  { value: '16', label: 'Kalyanpur (16)' },
  { value: '131', label: 'Kalyanpur (SC) (131)' },
  { value: '95', label: 'Kanti (95)' },
  { value: '213', label: 'Karakat (213)' },
  { value: '209', label: 'Kargahar (209)' },
  { value: '58', label: 'Kasba (58)' },
  { value: '63', label: 'Katihar (63)' },
  { value: '162', label: 'Katoria (ST) (162)' },
  { value: '86', label: 'Keoti (86)' },
  { value: '15', label: 'Kesaria (15)' },
  { value: '149', label: 'Khagaria (149)' },
  { value: '33', label: 'Khajauli (33)' },
  { value: '54', label: 'Kishanganj (54)' },
  { value: '55', label: 'Kochadhaman (55)' },
  { value: '69', label: 'Korha (SC) (69)' },
  { value: '102', label: 'Kuchaikote (102)' },
  { value: '183', label: 'Kumhrar (183)' },
  { value: '93', label: 'Kurhani (93)' },
  { value: '215', label: 'Kurtha (215)' },
  { value: '78', label: 'Kusheshwar Asthan (SC) (78)' },
  { value: '222', label: 'Kutumba (SC) (222)' },
  { value: '168', label: 'Lakhisarai (168)' },
  { value: '124', label: 'Lalganj (124)' },
  { value: '40', label: 'Laukaha (40)' },
  { value: '5', label: 'Lauriya (5)' },
  { value: '73', label: 'Madhepura (73)' },
  { value: '18', label: 'Madhuban (18)' },
  { value: '36', label: 'Madhubani (36)' },
  { value: '112', label: 'Maharajganj (112)' },
  { value: '77', label: 'Mahishi (77)' },
  { value: '129', label: 'Mahnar (129)' },
  { value: '126', label: 'Mahua (126)' },
  { value: '218', label: 'Makhadumapur (SC) (218)' },
  { value: '187', label: 'Maner (187)' },
  { value: '67', label: 'Manihari (ST) (67)' },
  { value: '114', label: 'Manjhi (114)' },
  { value: '117', label: 'Marhaura (117)' },
  { value: '189', label: 'Masaurhi (SC) (189)' },
  { value: '144', label: 'Matihani (144)' },
  { value: '90', label: 'Minapur (90)' },
  { value: '204', label: 'Mohania (SC) (204)' },
  { value: '137', label: 'Mohiuddinnagar (137)' },
  { value: '178', label: 'Mokama (178)' },
  { value: '135', label: 'Morwa (135)' },
  { value: '19', label: 'Motihari (19)' },
  { value: '165', label: 'Munger (165)' },
  { value: '94', label: 'Muzaffarpur (94)' },
  { value: '221', label: 'Nabinagar (221)' },
  { value: '176', label: 'Nalanda (176)' },
  { value: '12', label: 'Narkatia (12)' },
  { value: '3', label: 'Narkatiaganj (3)' },
  { value: '46', label: 'Narpatganj (46)' },
  { value: '158', label: 'Nathnagar (158)' },
  { value: '6', label: 'Nautan (6)' },
  { value: '237', label: 'Nawada (237)' },
  { value: '41', label: 'Nirmali (41)' },
  { value: '211', label: 'Nokha (211)' },
  { value: '220', label: 'Obra (220)' },
  { value: '190', label: 'Paliganj (190)' },
  { value: '151', label: 'Parbatta (151)' },
  { value: '25', label: 'Parihar (25)' },
  { value: '97', label: 'Paroo (97)' },
  { value: '121', label: 'Parsa (121)' },
  { value: '130', label: 'Patepur (SC) (130)' },
  { value: '184', label: 'Patna Sahib (184)' },
  { value: '39', label: 'Phulparas (39)' },
  { value: '188', label: 'Phulwari (SC) (188)' },
  { value: '17', label: 'Pipra (17)' },
  { value: '42', label: 'Pipra (42)' },
  { value: '154', label: 'Pirpainti (SC) (154)' },
  { value: '66', label: 'Pranpur (66)' },
  { value: '62', label: 'Purnia (62)' },
  { value: '224', label: 'Rafiganj (224)' },
  { value: '128', label: 'Raghopur (128)' },
  { value: '108', label: 'Raghunathpur (108)' },
  { value: '127', label: 'Raja Pakar (SC) (127)' },
  { value: '235', label: 'Rajauli (SC) (235)' },
  { value: '173', label: 'Rajgir (SC) (173)' },
  { value: '37', label: 'Rajnagar (SC) (37)' },
  { value: '202', label: 'Rajpur (SC) (202)' },
  { value: '203', label: 'Ramgarh (203)' },
  { value: '2', label: 'Ramnagar (SC) (2)' },
  { value: '47', label: 'Raniganj (SC) (47)' },
  { value: '10', label: 'Raxaul (10)' },
  { value: '23', label: 'Riga (23)' },
  { value: '139', label: 'Rosera (SC) (139)' },
  { value: '29', label: 'Runnisaidpur (29)' },
  { value: '60', label: 'Rupauli (60)' },
  { value: '75', label: 'Saharsa (75)' },
  { value: '98', label: 'Sahebganj (98)' },
  { value: '145', label: 'Sahebpur Kamal (145)' },
  { value: '92', label: 'Sakra (SC) (92)' },
  { value: '133', label: 'Samastipur (133)' },
  { value: '192', label: 'Sandesh (192)' },
  { value: '136', label: 'Sarairanjan (136)' },
  { value: '208', label: 'Sasaram (208)' },
  { value: '198', label: 'Shahpur (198)' },
  { value: '169', label: 'Sheikhpura (169)' },
  { value: '22', label: 'Sheohar (22)' },
  { value: '226', label: 'Sherghati (226)' },
  { value: '240', label: 'Sikandra (SC) (240)' },
  { value: '9', label: 'Sikta (9)' },
  { value: '51', label: 'Sikti (51)' },
  { value: '76', label: 'Simri Bakhtiarpur (76)' },
  { value: '72', label: 'Singheshwar (SC) (72)' },
  { value: '28', label: 'Sitamarhi (28)' },
  { value: '105', label: 'Siwan (105)' },
  { value: '74', label: 'Sonbarsha (SC) (74)' },
  { value: '122', label: 'Sonepur (122)' },
  { value: '11', label: 'Sugauli (11)' },
  { value: '157', label: 'Sultanganj (157)' },
  { value: '43', label: 'Supaul (43)' },
  { value: '26', label: 'Sursand (26)' },
  { value: '167', label: 'Suryagarha (167)' },
  { value: '116', label: 'Taraiya (116)' },
  { value: '164', label: 'Tarapur (164)' },
  { value: '196', label: 'Tarari (196)' },
  { value: '143', label: 'Teghra (143)' },
  { value: '53', label: 'Thakurganj (53)' },
  { value: '231', label: 'Tikari (231)' },
  { value: '44', label: 'Triveniganj (SC) (44)' },
  { value: '134', label: 'Ujiarpur (134)' },
  { value: '125', label: 'Vaishali (125)' },
  { value: '1', label: 'Valmiki Nagar (1)' },
  { value: '132', label: 'Warisnagar (132)' },
  { value: '239', label: 'Warsaliganj (239)' },
  { value: '234', label: 'Wazirganj (234)' },
  { value: '106', label: 'Ziradei (106)' },
];

// Mock data - replace with actual API call
const mockACData: ACData[] = [
  { acCode: 1, acName: 'Valmiki Nagar', agencyId: 4, agencyName: 'Parbhat', totalInterview: 330, validInterview: 310 },
  { acCode: 2, acName: 'Ramnagar (SC)', agencyId: 4, agencyName: 'Parbhat', totalInterview: 395, validInterview: 346 },
  { acCode: 3, acName: 'Narkatiaganj', agencyId: 4, agencyName: 'Parbhat', totalInterview: 400, validInterview: 315 },
  { acCode: 4, acName: 'Bagaha', agencyId: 4, agencyName: 'Parbhat', totalInterview: 345, validInterview: 306 },
  { acCode: 5, acName: 'Lauriya', agencyId: 4, agencyName: 'Parbhat', totalInterview: 462, validInterview: 337 },
  { acCode: 6, acName: 'Nautan', agencyId: 4, agencyName: 'Parbhat', totalInterview: 408, validInterview: 326 },
  { acCode: 7, acName: 'Chanpatia', agencyId: 4, agencyName: 'Parbhat', totalInterview: 388, validInterview: 314 },
  { acCode: 8, acName: 'Bettiah', agencyId: 4, agencyName: 'Parbhat', totalInterview: 738, validInterview: 318 },
  { acCode: 9, acName: 'Sikta', agencyId: 4, agencyName: 'Parbhat', totalInterview: 393, validInterview: 351 },
  { acCode: 10, acName: 'Raxaul', agencyId: 4, agencyName: 'Parbhat', totalInterview: 447, validInterview: 325 },
  { acCode: 11, acName: 'Sugauli', agencyId: 4, agencyName: 'Parbhat', totalInterview: 466, validInterview: 238 },
  { acCode: 12, acName: 'Narkatia', agencyId: 4, agencyName: 'Parbhat', totalInterview: 325, validInterview: 303 },
  { acCode: 13, acName: 'Harsidhi (SC)', agencyId: 8, agencyName: 'Inhouse', totalInterview: 361, validInterview: 171 },
  { acCode: 14, acName: 'Govindganj', agencyId: 8, agencyName: 'Inhouse', totalInterview: 352, validInterview: 148 },
  { acCode: 15, acName: 'Kesaria', agencyId: 1, agencyName: 'Kadence', totalInterview: 575, validInterview: 291 },
  { acCode: 16, acName: 'Kalyanpur', agencyId: 8, agencyName: 'Inhouse', totalInterview: 518, validInterview: 192 },
  { acCode: 17, acName: 'Pipra', agencyId: 8, agencyName: 'Inhouse', totalInterview: 573, validInterview: 189 },
  { acCode: 18, acName: 'Madhuban', agencyId: 5, agencyName: 'Navin', totalInterview: 313, validInterview: 209 },
  { acCode: 19, acName: 'Motihari', agencyId: 8, agencyName: 'Inhouse', totalInterview: 356, validInterview: 118 },
  { acCode: 20, acName: 'Chiraia', agencyId: 2, agencyName: 'Chandan', totalInterview: 578, validInterview: 89 },
];

export default function MasterACPage() {
  const { user } = useAuth();
  const [selectedAgency, setSelectedAgency] = useState('');
  const [selectedAC, setSelectedAC] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);


  const handleSearch = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleUpdateAgency = (acCode: number) => {
    // Navigate to update agency page
    window.location.href = `/pmt/master-ac/acupdate?ac_code=${acCode}`;
  };

  const handleUpdateDataAgencyWise = () => {
    // Navigate to update data agency wise page
    window.location.href = '/pmt/master-ac/dataupdate';
  };

  const tableColumns = [
    { key: 'acCode' as keyof ACData, label: 'AC Code', sortable: true },
    { key: 'acName' as keyof ACData, label: 'AC Name', sortable: true },
    { key: 'agencyId' as keyof ACData, label: 'Agency ID', sortable: true },
    { key: 'agencyName' as keyof ACData, label: 'Agency Name', sortable: true },
    { key: 'totalInterview' as keyof ACData, label: 'Total Interview', sortable: true },
    { key: 'validInterview' as keyof ACData, label: 'Valid Interview', sortable: true },
    { 
      key: 'action' as keyof ACData, 
      label: 'Action', 
      render: (value: any, row: ACData) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleUpdateAgency(row.acCode)}
        >
          Update Agency
        </Button>
      )
    },
  ];

  const totalPages = Math.ceil(243 / 20); // Total items / items per page

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AC List
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage Assembly Constituency data and agency assignments
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleSearch}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <Card className="mb-6">
          <div>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State Teams
                  </label>
                  <SelectDropdown
                    options={agencyOptions}
                    value={selectedAgency}
                    onChange={(value) => setSelectedAgency(Array.isArray(value) ? value[0] : value)}
                    placeholder="Select State Teams"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assembly Constituency
                  </label>
                  <SelectDropdown
                    options={acOptions}
                    value={selectedAC}
                    onChange={(value) => setSelectedAC(Array.isArray(value) ? value[0] : value)}
                    placeholder="Select AC"
                    className="w-full"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    loading={loading}
                    className="w-full"
                    onClick={handleSearch}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Card>

        {/* AC List Table */}
        <Card>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                AC List
              </h2>
              <Button
                variant="primary"
                onClick={handleUpdateDataAgencyWise}
              >
                Update Data Agency Wise
              </Button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold">1-20</span> of <span className="font-semibold">243</span> items.
              </p>
            </div>

            <DataTable
              data={mockACData}
              columns={tableColumns}
              loading={loading}
              className="w-full"
              searchable={false}
              pagination={false}
            />

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showFirstLast
                showPrevNext
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
