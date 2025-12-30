**Refactor fieldwork-progress Page**

**Field Work Progress having multiple pages as below**

**Dashboard // Initial Page**

**For Zone Pages ———————————**  
**Zone Progress Page**  
If click on Dashboard “Field Status \- Zone” chart any Complete, In-progress, Yet to Begin this page will open  
**API call on “Field Status \- Zone” chart**  
Complete: GET http://localhost:4001/api/fd/fieldwork-progress?progress\_type=[3](http://localhost:4001/api/fd/fieldwork-progress?progress_type=1&progress_sub_type=1)\&progress\_sub\_type=1  
In-progress: GET http://localhost:4001/api/fd/fieldwork-progress?progress\_type=[3](http://localhost:4001/api/fd/fieldwork-progress?progress_type=1&progress_sub_type=2)\&progress\_sub\_type=2  
Yet to Begin: GET http://localhost:4001/api/fd/fieldwork-progress?progress\_type=[3](http://localhost:4001/api/fd/fieldwork-progress?progress_type=1&progress_sub_type=3)\&progress\_sub\_type=3  
Total Zones: GET [http://localhost:4001/api/fd/fieldwork-progress?progress\_type=3\&progress\_sub\_type=4](http://localhost:4001/api/fd/fieldwork-progress?progress_type=3&progress_sub_type=4)

Tables columns are 

| Region Code | Region Name | Target | Achieved | % Of Completion | Status |
| :---- | :---- | :---: | :---: | :---: | :---: |

**Zone Progress Drill Down page**  
If click on Region Name then Zone Progress Drill Down page will open  
Table Columns are

| District Code | District Name | Target | Achieved | % Of Completion | Status |
| :---- | :---- | :---: | :---: | :---: | :---: |

**AC Progress page**  
If click on District Name then AC Progress page should open  
Table Columns are

| AC Code | AC Name | PC Name | Target | Achieved | % Of Completion | Status |
| :---- | :---- | :---- | :---: | :---: | :---: | :---: |

**AC Progress Drill Down page**  
If click on AC Name then AC Progress Drill Down page should open  
Table Columns are

| PS Code | PS Name | Target | Achieved | % Of Completion | Status |
| :---- | :---- | :---: | :---: | :---: | :---: |

**For Districts Pages ———————————**  
**District Progress Page**  
If click on Dashboard “Field Status \- District” chart any Complete, In-progress, Yet to Begin this page will open  
**API call on “Field Status \- District” chart**  
Complete: GET http://localhost:4001/api/fd/fieldwork-progress?progress\_type=2\&progress\_sub\_type=1  
In-progress: GET http://localhost:4001/api/fd/fieldwork-progress?progress\_type=2\&progress\_sub\_type=2  
Yet to Begin: GET http://localhost:4001/api/fd/fieldwork-progress?progress\_type=2\&progress\_sub\_type=3  
Total Districts: GET http://localhost:4001/api/fd/fieldwork-progress?progress\_type=[2](http://localhost:4001/api/fd/fieldwork-progress?progress_type=3&progress_sub_type=4)\&progress\_sub\_type=4

**Tables columns are** 

| District Code | District Name | Target | Achieved | % Of Completion | Status |
| :---- | :---- | :---: | :---: | :---: | :---: |

**District Progress Drill Down page**  
If click on District Name then District Progress Drill Down page will open  
Table Columns are

| AC Code | AC Name | PC Name | Target | Achieved | % Of Completion | Status |
| :---- | :---- | :---- | :---: | :---: | :---: | :---: |

**AC Progress Drill Down page**  
If click on AC Name then AC Progress Drill Down page should open  
Table Columns are

| PS Code | PS Name | Target | Achieved | % Of Completion | Status |
| :---- | :---- | :---: | :---: | :---: | :---: |

**For PC Pages ———————————**  
**PC Progress Page**  
If click on Dashboard “Field Status \- PC” chart any Complete, In-progress, Yet to Begin this page will open  
**API call on “Field Status \- PC” chart**  
Complete: GET [http://localhost:4001/api/fd/fieldwork-progress?progress\_type=1\&progress\_sub\_type=1](http://localhost:4001/api/fd/fieldwork-progress?progress_type=1&progress_sub_type=1)  
In-progress: GET [http://localhost:4001/api/fd/fieldwork-progress?progress\_type=1\&progress\_sub\_type=2](http://localhost:4001/api/fd/fieldwork-progress?progress_type=1&progress_sub_type=2)  
Yet to Begin: GET [http://localhost:4001/api/fd/fieldwork-progress?progress\_type=1\&progress\_sub\_type=3](http://localhost:4001/api/fd/fieldwork-progress?progress_type=1&progress_sub_type=3)  
Total PCs: GET http://localhost:4001/api/fd/fieldwork-progress?progress\_type=1\&progress\_sub\_type=4

**Tables columns are** 

| PC Code | PC Name | Target | Achieved | % Of Completion | Status |
| :---- | :---- | :---: | :---: | :---: | :---: |

**PC Progress Drill Down page**  
If click on PC Name then PC Progress Drill Down page will open  
Table Columns are

| AC Code | AC Name | PC Name | Target | Achieved | % Of Completion | Status |
| :---- | :---- | :---- | :---: | :---: | :---: | :---: |

**AC Progress Drill Down page**  
If click on AC Name then AC Progress Drill Down page should open  
Table Columns are

| PS Code | PS Name | Target | Achieved | % Of Completion | Status |
| :---- | :---- | :---: | :---: | :---: | :---: |

**For AC Pages ———————————**  
**AC Progress Page**  
If click on Dashboard “Field Status \- AC” chart any Complete, In-progress, Yet to Begin this page will open  
**API call on “Field Status \- Acs” chart**  
Complete: GET http://localhost:4001/api/fd/fieldwork-progress?progress\_type=4\&progress\_sub\_type=1  
In-progress: GET http://localhost:4001/api/fd/fieldwork-progress?progress\_type=4\&progress\_sub\_type=2  
Yet to Begin: GET http://localhost:4001/api/fd/fieldwork-progress?progress\_type=4\&progress\_sub\_type=3  
Total Acs: GET http://localhost:4001/api/fd/fieldwork-progress?progress\_type=[4](http://localhost:4001/api/fd/fieldwork-progress?progress_type=3&progress_sub_type=4)\&progress\_sub\_type=4

**Tables columns are** 

| AC Code | AC Name | PC Name | Target | Achieved | % Of Completion | Status |
| :---- | :---- | :---- | :---: | :---: | :---: | :---: |

**AC Progress Drill Down page**  
If click on AC Name then AC Progress Drill Down page should open  
Table Columns are

| PS Code | PS Name | Target | Achieved | % Of Completion | Status |
| :---- | :---- | :---: | :---: | :---: | :---: |

curl 'http://localhost:4001/api/fd/fieldwork-progress?progress\_type=4\&progress\_sub\_type=4\&progress\_sub\_type\_code=284' \\  
  \-H 'Accept: application/json' \\  
  \-H 'Accept-Language: en-US,en;q=0.9,hi;q=0.8' \\  
  \-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5IiwidW5pcXVlSWQiOiJVU0VSMDA4IiwiZW1haWwiOiJ1c2VyMDA4QGV4YW1wbGUuY29tIiwiYWdlbmN5IjpudWxsLCJtb2JpbGUiOm51bGwsImZpcnN0TmFtZSI6IkZpbmRpbmciLCJsYXN0TmFtZSI6IkRhc2hib2FyZCIsInBvcnRhbFNsdWciOiJmZCIsImlhdCI6MTc2NDczNTk5MywiZXhwIjoxNzY3MzI3OTkzLCJhdWQiOiJjb252ZXJnZW50dmlldy11c2VycyIsImlzcyI6ImNvbnZlcmdlbnR2aWV3LXBvcnRhbCJ9.LboQEaRbtnvOL5ZMCfMeFl6b7FPzYJfdpV7m0IBJf3I' \\  
  \-H 'Connection: keep-alive' \\  
  \-H 'If-None-Match: W/"372d-+3fJZXTFk4O13CEYsyP28SqZIag"' \\  
  \-H 'Origin: http://localhost:3000' \\  
  \-H 'Referer: http://localhost:3000/' \\  
  \-H 'Sec-Fetch-Dest: empty' \\  
  \-H 'Sec-Fetch-Mode: cors' \\  
  \-H 'Sec-Fetch-Site: same-site' \\  
  \-H 'User-Agent: Mozilla/5.0 (X11; Linux x86\_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36' \\  
  \-H 'sec-ch-ua: "Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"' \\  
  \-H 'sec-ch-ua-mobile: ?0' \\  
  \-H 'sec-ch-ua-platform: "Linux"'

**API defnition**  
progress\_type  
integer  
(query)  
Progress type for filtering data  
1: PC (Parliamentary Constituency)  
2: District  
3: Zone/Region  
4: AC (Assembly Constituency)  
progress\_sub\_type  
integer  
(query)  
Progress sub-type for filtering by status  
1: Completed  
2: In Progress  
3: Yet to Begin  
4: All  
progress\_sub\_type\_code  
string  
(query)  
Specific code for drill-down functionality  
For PC drill-down: PC code  
For District drill-down: District code  
For Zone drill-down: Zone code  
For AC drill-down: AC code  
