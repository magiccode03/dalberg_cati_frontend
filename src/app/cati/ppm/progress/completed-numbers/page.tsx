'use client';

import React, { useState } from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Trash2, Volume2 } from 'lucide-react';

// Interfaces
interface SearchFilters {
  serverId: string;
  acCode: string;
  callingDates: string;
  telecaller: string;
  phone: string;
  callOutcome: string;
  talkDuration: string;
}

interface CompletedNumberData {
  id: number;
  serverId: string;
  acName: string;
  acCode: number;
  telecaller: string;
  telecallerId: string;
  callDate: string;
  callOutcome: string;
  respondentName: string;
  respondentGender: string;
  apiResponse: string;
  talkDuration: string;
  audioFile: string;
}

const CompletedNumbersPage = () => {
  // State for search filters
  const [filters, setFilters] = useState<SearchFilters>({
    serverId: '',
    acCode: '',
    callingDates: '',
    telecaller: '',
    phone: '',
    callOutcome: '10', // Default to "Successful Interview"
    talkDuration: '',
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);

  // Sample data for completed numbers
  const [completedNumbersData] = useState<CompletedNumberData[]>([
    {
      id: 1,
      serverId: '3058965',
      acName: 'Dum Dum Uttar',
      acCode: 110,
      telecaller: 'Basanti Sahoo',
      telecallerId: '1118',
      callDate: '2024-05-31 11:10:07',
      callOutcome: 'Successful Interview',
      respondentName: 'Na',
      respondentGender: 'Male',
      apiResponse: 'Both Answered',
      talkDuration: '00:05:08',
      audioFile: '/wbtelesurvey/pmt/team/progress/telecalleraudio?log_id=987459',
    },
    {
      id: 2,
      serverId: '3058971',
      acName: 'Dum Dum Uttar',
      acCode: 110,
      telecaller: 'Gopi Hela',
      telecallerId: '3051',
      callDate: '2024-05-31 10:28:15',
      callOutcome: 'Successful Interview',
      respondentName: 'Saptashi ghosh',
      respondentGender: 'Male',
      apiResponse: 'Both Answered',
      talkDuration: '00:03:46',
      audioFile: '/wbtelesurvey/pmt/team/progress/telecalleraudio?log_id=987356',
    },
    {
      id: 3,
      serverId: '3058972',
      acName: 'Dum Dum',
      acCode: 114,
      telecaller: 'Gopi Hela',
      telecallerId: '3051',
      callDate: '2024-05-31 10:33:48',
      callOutcome: 'Successful Interview',
      respondentName: 'Sanjay sen',
      respondentGender: 'Male',
      apiResponse: 'Both Answered',
      talkDuration: '00:03:19',
      audioFile: '/wbtelesurvey/pmt/team/progress/telecalleraudio?log_id=987365',
    },
    {
      id: 4,
      serverId: '3058992',
      acName: 'Kolkata Port',
      acCode: 158,
      telecaller: 'Puchi',
      telecallerId: '3079',
      callDate: '2024-05-31 11:36:17',
      callOutcome: 'Successful Interview',
      respondentName: 'No answer',
      respondentGender: 'Male',
      apiResponse: 'Both Answered',
      talkDuration: '00:02:51',
      audioFile: '/wbtelesurvey/pmt/team/progress/telecalleraudio?log_id=987645',
    },
    {
      id: 5,
      serverId: '3059008',
      acName: 'Kolkata Port',
      acCode: 158,
      telecaller: 'Gopi Hela',
      telecallerId: '3051',
      callDate: '2024-05-31 17:24:14',
      callOutcome: 'Successful Interview',
      respondentName: 'Nasrin',
      respondentGender: 'Male',
      apiResponse: 'Both Answered',
      talkDuration: '00:03:05',
      audioFile: '/wbtelesurvey/pmt/team/progress/telecalleraudio?log_id=988771',
    },
  ]);

  // Options for dropdowns
  const acCodeOptions = [
    { value: '', label: 'Select AC' },
    { value: '1', label: 'Mekliganj' },
    { value: '2', label: 'Mathabhanga' },
    { value: '3', label: 'Cooch Behar Uttar' },
    { value: '4', label: 'Cooch Behar Dakshin' },
    { value: '5', label: 'Sitalkuchi' },
    { value: '6', label: 'Sitai' },
    { value: '7', label: 'Dinhata' },
    { value: '8', label: 'Natabari' },
    { value: '9', label: 'Tufanganj' },
    { value: '10', label: 'Kumargram' },
    { value: '11', label: 'Kalchini' },
    { value: '12', label: 'Alipurduars' },
    { value: '13', label: 'Falakata' },
    { value: '14', label: 'Madarihat' },
    { value: '15', label: 'Dhupguri' },
    { value: '16', label: 'Maynaguri' },
    { value: '17', label: 'Jalpaiguri' },
    { value: '18', label: 'Rajganj' },
    { value: '19', label: 'Dabgram-Fulbari' },
    { value: '20', label: 'Mal' },
    { value: '21', label: 'Nagarkata' },
    { value: '22', label: 'Kalimpong' },
    { value: '23', label: 'Darjeeling' },
    { value: '24', label: 'Kurseong' },
    { value: '25', label: 'Matigara-Naxalbari' },
    { value: '26', label: 'Siliguri' },
    { value: '27', label: 'Phansidewa' },
    { value: '28', label: 'Chopra' },
    { value: '29', label: 'Islamapur' },
    { value: '30', label: 'Goalpokhar' },
    { value: '31', label: 'Chakulia' },
    { value: '32', label: 'Karandighi' },
    { value: '33', label: 'Hemtabad' },
    { value: '34', label: 'Kaliaganj' },
    { value: '35', label: 'Raiganj' },
    { value: '36', label: 'Itahar' },
    { value: '37', label: 'Kushmandi' },
    { value: '38', label: 'Kumarganj' },
    { value: '39', label: 'Balurghat' },
    { value: '40', label: 'Tapan' },
    { value: '41', label: 'Gangarampur' },
    { value: '42', label: 'Harirampur' },
    { value: '43', label: 'Habibpur' },
    { value: '44', label: 'Gazole' },
    { value: '45', label: 'Chanchal' },
    { value: '46', label: 'Harischandrapur' },
    { value: '47', label: 'Malatipur' },
    { value: '48', label: 'Ratua' },
    { value: '49', label: 'Manikchak' },
    { value: '50', label: 'Maldaha' },
    { value: '51', label: 'Englishbazar' },
    { value: '52', label: 'Mothabari' },
    { value: '53', label: 'Sujapur' },
    { value: '54', label: 'Baisnabnagar' },
    { value: '55', label: 'Farakka' },
    { value: '56', label: 'Samserganj' },
    { value: '57', label: 'Suti' },
    { value: '58', label: 'Jangipur' },
    { value: '59', label: 'Raghunathganj' },
    { value: '60', label: 'Sagardighi' },
    { value: '61', label: 'Lalgola' },
    { value: '62', label: 'Bhagabangola' },
    { value: '63', label: 'Raninagar' },
    { value: '64', label: 'Murshidabad' },
    { value: '65', label: 'Nabagram' },
    { value: '66', label: 'Khargram' },
    { value: '67', label: 'Burwan' },
    { value: '68', label: 'Kandi' },
    { value: '69', label: 'Bharatpur' },
    { value: '70', label: 'Rejinagar' },
    { value: '71', label: 'Beldanga' },
    { value: '72', label: 'Baharampur' },
    { value: '73', label: 'Hariharpara' },
    { value: '74', label: 'Naoda' },
    { value: '75', label: 'Domkal' },
    { value: '76', label: 'Jalangi' },
    { value: '77', label: 'Karimpur' },
    { value: '78', label: 'Tehatta' },
    { value: '79', label: 'Palashipara' },
    { value: '80', label: 'Kaliganj' },
    { value: '81', label: 'Nakashipara' },
    { value: '82', label: 'Chapra' },
    { value: '83', label: 'Krishnanagar Uttar' },
    { value: '84', label: 'Nabadwip' },
    { value: '85', label: 'Krishnanagar Dakshin' },
    { value: '86', label: 'Santipur' },
    { value: '87', label: 'Ranaghat Uttar Pasch' },
    { value: '88', label: 'Krishnaganj' },
    { value: '89', label: 'Ranaghat Uttar Purba' },
    { value: '90', label: 'Ranaghat Dakshin' },
    { value: '91', label: 'Chakdaha' },
    { value: '92', label: 'Kalyani' },
    { value: '93', label: 'Haringhata' },
    { value: '94', label: 'Bagda' },
    { value: '95', label: 'Bangaon Uttar' },
    { value: '96', label: 'Bangaon Dakshin' },
    { value: '97', label: 'Gaighata' },
    { value: '98', label: 'Swarupnagar' },
    { value: '99', label: 'Baduria' },
    { value: '100', label: 'Habra' },
    { value: '101', label: 'Ashoknagar' },
    { value: '102', label: 'Amdanga' },
    { value: '103', label: 'Bijpur' },
    { value: '104', label: 'Naihati' },
    { value: '105', label: 'Bhatpara' },
    { value: '106', label: 'Jagatdal' },
    { value: '107', label: 'Noapara' },
    { value: '108', label: 'Barrackpur' },
    { value: '109', label: 'Khardaha' },
    { value: '110', label: 'Dum Dum Uttar' },
    { value: '111', label: 'Panihati' },
    { value: '112', label: 'Kamarhati' },
    { value: '113', label: 'Baranagar' },
    { value: '114', label: 'Dum Dum' },
    { value: '115', label: 'Rajarhat New Town' },
    { value: '116', label: 'Bidhannagar' },
    { value: '117', label: 'Rajarhat Gopalpur' },
    { value: '118', label: 'Madhyamgram' },
    { value: '119', label: 'Barasat' },
    { value: '120', label: 'Deganga' },
    { value: '121', label: 'Haroa' },
    { value: '122', label: 'Minakhan' },
    { value: '123', label: 'Sandeshkhali' },
    { value: '124', label: 'Basirhat Dakshin' },
    { value: '125', label: 'Basirhat Uttar' },
    { value: '126', label: 'Hingalganj' },
    { value: '127', label: 'Gosaba' },
    { value: '128', label: 'Basanti' },
    { value: '129', label: 'Kultali' },
    { value: '130', label: 'Patharpratima' },
    { value: '131', label: 'Kakdwip' },
    { value: '132', label: 'Sagar' },
    { value: '133', label: 'Kulpi' },
    { value: '134', label: 'Raidighi' },
    { value: '135', label: 'Mandirbazar' },
    { value: '136', label: 'Joynagar' },
    { value: '137', label: 'Baruipur Purba' },
    { value: '138', label: 'Canning Paschim' },
    { value: '139', label: 'Canning Purba' },
    { value: '140', label: 'Baruipur Paschim' },
    { value: '141', label: 'Magrahat Purba' },
    { value: '142', label: 'Magrahat Paschim' },
    { value: '143', label: 'Diamond Harbour' },
    { value: '144', label: 'Falta' },
    { value: '145', label: 'Satgachhia' },
    { value: '146', label: 'Bishnupur' },
    { value: '147', label: 'Sonarpur Dakshin' },
    { value: '148', label: 'Bhangar' },
    { value: '149', label: 'Kasba' },
    { value: '150', label: 'Jadavpur' },
    { value: '151', label: 'Sonarpur Uttar' },
    { value: '152', label: 'Tollyganj' },
    { value: '153', label: 'Behala Purba' },
    { value: '154', label: 'Behala Paschim' },
    { value: '155', label: 'Maheshtala' },
    { value: '156', label: 'Budge Budge' },
    { value: '157', label: 'Metiaburuz' },
    { value: '158', label: 'Kolkata Port' },
    { value: '159', label: 'Bhabanipur' },
    { value: '160', label: 'Rashbehari' },
    { value: '161', label: 'Ballygunge' },
    { value: '162', label: 'Chowrangee' },
    { value: '163', label: 'Entally' },
    { value: '164', label: 'Beleghata' },
    { value: '165', label: 'Jorasanko' },
    { value: '166', label: 'Shyampukur' },
    { value: '167', label: 'Maniktola' },
    { value: '168', label: 'Kashipur-Belgachhia' },
    { value: '169', label: 'Bally' },
    { value: '170', label: 'Howrah Uttar' },
    { value: '171', label: 'Howrah Madhya' },
    { value: '172', label: 'Shibpur' },
    { value: '173', label: 'Howrah Dakshin' },
    { value: '174', label: 'Sankrail' },
    { value: '175', label: 'Panchla' },
    { value: '176', label: 'Uluberia Purba' },
    { value: '177', label: 'Uluberia Uttar' },
    { value: '178', label: 'Uluberia Dakshin' },
    { value: '179', label: 'Shyampur' },
    { value: '180', label: 'Bagnan' },
    { value: '181', label: 'Amta' },
    { value: '182', label: 'Udaynarayanpur' },
    { value: '183', label: 'Jagatballavpur' },
    { value: '184', label: 'Domjur' },
    { value: '185', label: 'Uttarpara' },
    { value: '186', label: 'Sreerampur' },
    { value: '187', label: 'Champdani' },
    { value: '188', label: 'Singur' },
    { value: '189', label: 'Chandannagar' },
    { value: '190', label: 'Chunchura' },
    { value: '191', label: 'Balagarh' },
    { value: '192', label: 'Pandua' },
    { value: '193', label: 'Saptagram' },
    { value: '194', label: 'Chanditala' },
    { value: '195', label: 'Jangipara' },
    { value: '196', label: 'Haripal' },
    { value: '197', label: 'Dhanekhali' },
    { value: '198', label: 'Tarakeswar' },
    { value: '199', label: 'Pursurah' },
    { value: '200', label: 'Arambag' },
    { value: '201', label: 'Goghat' },
    { value: '202', label: 'Khanakul' },
    { value: '203', label: 'Tamluk' },
    { value: '204', label: 'Panskura Purba' },
    { value: '205', label: 'Panskura Paschim' },
    { value: '206', label: 'Moyna' },
    { value: '207', label: 'Nandakumar' },
    { value: '208', label: 'Mahishadal' },
    { value: '209', label: 'Haldia' },
    { value: '210', label: 'Nandigram' },
    { value: '211', label: 'Chandipur' },
    { value: '212', label: 'Patashpur' },
    { value: '213', label: 'Kanthi Uttar' },
    { value: '214', label: 'Bhagabanpur' },
    { value: '215', label: 'Khejuri' },
    { value: '216', label: 'Kanthi Dakshin' },
    { value: '217', label: 'Ramnagar' },
    { value: '218', label: 'Egra' },
    { value: '219', label: 'Dantan' },
    { value: '220', label: 'Nayagram' },
    { value: '221', label: 'Gopiballavpur' },
    { value: '222', label: 'Jhargram' },
    { value: '223', label: 'Keshiary' },
    { value: '224', label: 'Kharagpur Sadar' },
    { value: '225', label: 'Narayangarh' },
    { value: '226', label: 'Sabang' },
    { value: '227', label: 'Pingla' },
    { value: '228', label: 'Kharagpur' },
    { value: '229', label: 'Debra' },
    { value: '230', label: 'Daspur' },
    { value: '231', label: 'Ghatal' },
    { value: '232', label: 'Chandrakona' },
    { value: '233', label: 'Garbeta' },
    { value: '234', label: 'Salboni' },
    { value: '235', label: 'Keshpur' },
    { value: '236', label: 'Medinipur' },
    { value: '237', label: 'Binpur' },
    { value: '238', label: 'Bandwan' },
    { value: '239', label: 'Balarampur' },
    { value: '240', label: 'Baghmundi' },
    { value: '241', label: 'Joypur' },
    { value: '242', label: 'Purulia' },
    { value: '243', label: 'Manbazar' },
    { value: '244', label: 'Kashipur' },
    { value: '245', label: 'Para' },
    { value: '246', label: 'Raghunathpur' },
    { value: '247', label: 'Saltora' },
    { value: '248', label: 'Chhatna' },
    { value: '249', label: 'Ranibandh' },
    { value: '250', label: 'Raipur' },
    { value: '251', label: 'Taldangra' },
    { value: '252', label: 'Bankura' },
    { value: '253', label: 'Barjora' },
    { value: '254', label: 'Onda' },
    { value: '255', label: 'Bishnupure' },
    { value: '256', label: 'Katulpur' },
    { value: '257', label: 'Indus' },
    { value: '258', label: 'Sonamukhi' },
    { value: '259', label: 'Khandaghosh' },
    { value: '260', label: 'Burdwan Dakshin' },
    { value: '261', label: 'Raina' },
    { value: '262', label: 'Jamalpur' },
    { value: '263', label: 'Monteswar' },
    { value: '264', label: 'Kalna' },
    { value: '265', label: 'Memari' },
    { value: '266', label: 'Burdwan Uttar' },
    { value: '267', label: 'Bhatar' },
    { value: '268', label: 'Purbasthali Dakshin' },
    { value: '269', label: 'Purbasthali Uttar' },
    { value: '270', label: 'Katwa' },
    { value: '271', label: 'Ketugram' },
    { value: '272', label: 'Mongalkote' },
    { value: '273', label: 'Ausgram' },
    { value: '274', label: 'Galsi' },
    { value: '275', label: 'Pandabeswar' },
    { value: '276', label: 'Durgapur Purba' },
    { value: '277', label: 'Durgapur Paschim' },
    { value: '278', label: 'Raniganj' },
    { value: '279', label: 'Jamuria' },
    { value: '280', label: 'Asansol Dakshin' },
    { value: '281', label: 'Asansol Uttar' },
    { value: '282', label: 'Kulti' },
    { value: '283', label: 'Barabani' },
    { value: '284', label: 'Dubrajpur' },
    { value: '285', label: 'Suri' },
    { value: '286', label: 'Bolpur' },
    { value: '287', label: 'Nanoor' },
    { value: '288', label: 'Labhpur' },
    { value: '289', label: 'Sainthia' },
    { value: '290', label: 'Mayureswar' },
    { value: '291', label: 'Rampurhat' },
    { value: '292', label: 'Hansan' },
    { value: '293', label: 'Nalhati' },
    { value: '294', label: 'Murarai' },
  ];

  const telecallerOptions = [
    { value: '', label: 'Select Telecaller' },
    { value: '805', label: 'Abhijit Halder (805)' },
    { value: '801', label: 'Debojit Halder (801)' },
    { value: '366', label: 'Indranil Chatterjee (366)' },
    { value: '376', label: 'Manish Mallik (376)' },
    { value: '581', label: 'Natifa Begam (581)' },
    { value: '806', label: 'Papiya Chowdhury (806)' },
    { value: '803', label: 'Pinky Paswan (803)' },
    { value: '804', label: 'Riya Tulsyan (804)' },
    { value: '1266', label: 'suchitra banerjee (1266)' },
    { value: '348', label: 'Suchitra Das (348)' },
    { value: '1696', label: 'SUCHITRA MANDAL (1696)' },
    { value: '1631', label: 'suchitra mandal (1631)' },
    { value: '1079', label: 'Suchitra sahoo (1079)' },
    { value: '848', label: 'supriya (848)' },
    { value: '1608', label: 'Supriya Achraya (1608)' },
  ];

  const callOutcomeOptions = [
    { value: '', label: 'Select Call Outcome' },
    { value: '10', label: 'Successful Interview' },
    { value: '20', label: 'Rejected Interview' },
    { value: '30', label: 'Incomplete Interview' },
    { value: '1', label: 'Picked and Call Continue' },
    { value: '2', label: 'Number does not exist' },
    { value: '3', label: 'Respondent did not pick' },
    { value: '4', label: 'Picked and Refused' },
  ];

  const talkDurationOptions = [
    { value: '', label: 'Select Talk Duration Range' },
    { value: '1', label: 'Less then 1 Min' },
    { value: '2', label: '1 to 2 Min' },
    { value: '3', label: '2 to 3 Min' },
    { value: '4', label: '3 to 4 Min' },
    { value: '5', label: 'Above 4 Min' },
  ];

  // Handlers
  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    console.log('Search filters:', filters);
    // Implement search logic here
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRejectInterview = (serverId: string) => {
    console.log('Reject interview for:', serverId);
    // Implement reject logic here
  };

  const handlePlayAudio = (audioFile: string) => {
    console.log('Play audio:', audioFile);
    // Implement audio play logic here
  };

  // Pagination calculations
  const totalItems = completedNumbersData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = indexOfFirstItem + itemsPerPage;
  const currentItems = completedNumbersData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={1} className="text-2xl font-bold text-gray-900">
          Completed Numbers
        </Heading>
        <div className="text-sm text-gray-500">
          {/* Additional header content if needed */}
        </div>
      </div>

      {/* Search Filters */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* Server ID */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Server ID
            </label>
            <Input
              type="text"
              value={filters.serverId}
              onChange={(e) => handleFilterChange('serverId', e.target.value)}
              placeholder="Search by Server ID"
            />
          </div>

          {/* AC Code */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AC Code
            </label>
            <SelectDropdown
              value={filters.acCode}
              onChange={(value) => handleFilterChange('acCode', value)}
              options={acCodeOptions}
              placeholder="Select AC"
            />
          </div>

          {/* Calling Dates */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calling Dates
            </label>
            <Input
              type="date"
              value={filters.callingDates}
              onChange={(e) => handleFilterChange('callingDates', e.target.value)}
              placeholder="Select Date"
            />
          </div>

          {/* Telecaller */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telecaller
            </label>
            <SelectDropdown
              value={filters.telecaller}
              onChange={(value) => handleFilterChange('telecaller', value)}
              options={telecallerOptions}
              placeholder="Select Telecaller"
            />
          </div>

          {/* Phone */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <Input
              type="text"
              value={filters.phone}
              onChange={(e) => handleFilterChange('phone', e.target.value)}
              placeholder="Phone Number"
            />
          </div>

          {/* Call Outcome */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call Outcome
            </label>
            <SelectDropdown
              value={filters.callOutcome}
              onChange={(value) => handleFilterChange('callOutcome', value)}
              options={callOutcomeOptions}
              placeholder="Select Call Outcome"
            />
          </div>

          {/* Talk Duration */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Talk Duration
            </label>
            <SelectDropdown
              value={filters.talkDuration}
              onChange={(value) => handleFilterChange('talkDuration', value)}
              options={talkDurationOptions}
              placeholder="Select Talk Duration Range"
            />
          </div>

          {/* View Button */}
          <div className="flex-shrink-0">
            <Button 
              variant="primary" 
              onClick={handleSearch}
              className="flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              View
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={2} className="text-xl font-semibold text-gray-900">
              Completed Numbers
            </Heading>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Server ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  AC Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  AC Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Telecaller
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Telecaller ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Call Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Call Outcome
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Respondent Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Respondent Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  API Response
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Talk Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Audio file
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                  Reject
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-6 py-4 text-center text-gray-500">
                    No results found.
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.serverId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.acName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.acCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.telecaller}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.telecallerId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.callDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.callOutcome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.respondentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.respondentGender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.apiResponse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.talkDuration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex justify-center">
                      <button
                        onClick={() => handlePlayAudio(item.audioFile)}
                        className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                        title="Play Audio"
                      >
                        <Volume2 className="w-4 h-4 text-white" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRejectInterview(item.serverId)}
                        className="flex items-center"
                        title="Reject Interview"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
            <span className="font-medium">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </div>
          
          <PaginationStandard
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </Card>
    </FluidContainer>
  );
};

export default CompletedNumbersPage;
