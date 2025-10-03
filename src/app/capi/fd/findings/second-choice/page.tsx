'use client';

import React from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';

interface ZoneData {
  zone: string;
  data: {
    party: string;
    bjp: number;
    jdu: number;
    hams: number;
    vsip: number;
    ljp: number;
    inc: number;
    rjd: number;
    cpi: number;
    jsp: number;
    others: number;
    nwr: number;
  }[];
}

export default function SecondChoicePage() {
  const stateLevelData = [
    { party: 'BJP', bjp: 0.0, jdu: 15.2, hams: 0.8, vsip: 0.5, ljp: 2.8, inc: 3.2, rjd: 8.5, cpi: 0.8, jsp: 1.8, others: 0.8, nwr: 1.2 },
    { party: 'JDU', bjp: 18.5, jdu: 0.0, hams: 0.3, vsip: 0.2, ljp: 2.5, inc: 2.8, rjd: 12.8, cpi: 0.5, jsp: 1.5, others: 0.5, nwr: 0.8 },
    { party: 'HAMS', bjp: 12.8, jdu: 8.2, hams: 0.0, vsip: 0.0, ljp: 1.2, inc: 1.8, rjd: 10.5, cpi: 0.3, jsp: 3.2, others: 0.0, nwr: 0.8 },
    { party: 'VSIP', bjp: 8.1, jdu: 3.2, hams: 0.0, vsip: 0.0, ljp: 0.8, inc: 0.9, rjd: 6.8, cpi: 0.0, jsp: 0.4, others: 0.1, nwr: 0.1 },
    { party: 'LJP(RV)', bjp: 12.5, jdu: 2.8, hams: 0.4, vsip: 0.5, ljp: 0.0, inc: 1.8, rjd: 8.2, cpi: 0.8, jsp: 1.5, others: 0.8, nwr: 0.5 },
    { party: 'INC', bjp: 2.8, jdu: 1.2, hams: 0.0, vsip: 0.3, ljp: 0.5, inc: 0.0, rjd: 15.8, cpi: 0.9, jsp: 0.8, others: 0.8, nwr: 0.4 },
    { party: 'RJD', bjp: 3.2, jdu: 1.8, hams: 0.1, vsip: 0.2, ljp: 0.7, inc: 8.7, rjd: 0.0, cpi: 0.9, jsp: 1.1, others: 0.6, nwr: 0.5 },
    { party: 'CPI(M)', bjp: 1.8, jdu: 0.8, hams: 0.3, vsip: 0.6, ljp: 1.1, inc: 11.0, rjd: 12.4, cpi: 0.0, jsp: 0.5, others: 0.4, nwr: 1.0 },
    { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
    { party: 'Others', bjp: 8.3, jdu: 2.6, hams: 0.2, vsip: 1.0, ljp: 3.1, inc: 9.7, rjd: 8.3, cpi: 2.7, jsp: 2.2, others: 0.0, nwr: 1.2 },
    { party: 'NWR', bjp: 12.5, jdu: 2.3, hams: 0.2, vsip: 0.3, ljp: 3.0, inc: 6.3, rjd: 7.1, cpi: 0.9, jsp: 1.0, others: 1.3, nwr: 0.0 },
  ];

  const zoneData: ZoneData[] = [
    {
      zone: 'Zone - 53 Tirhut',
      data: [
        { party: 'BJP', bjp: 0.0, jdu: 12.3, hams: 0.0, vsip: 0.2, ljp: 2.1, inc: 2.1, rjd: 9.8, cpi: 0.1, jsp: 1.4, others: 0.2, nwr: 1.1 },
        { party: 'JDU', bjp: 16.2, jdu: 0.0, hams: 0.0, vsip: 0.1, ljp: 2.7, inc: 2.1, rjd: 14.2, cpi: 0.3, jsp: 0.9, others: 0.6, nwr: 0.6 },
        { party: 'HAMS', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'VSIP', bjp: 4.1, jdu: 1.6, hams: 0.0, vsip: 0.0, ljp: 0.9, inc: 0.9, rjd: 3.6, cpi: 0.0, jsp: 0.9, others: 0.0, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 8.0, jdu: 2.0, hams: 0.5, vsip: 0.5, ljp: 0.0, inc: 1.5, rjd: 6.3, cpi: 0.0, jsp: 2.6, others: 0.5, nwr: 1.2 },
        { party: 'INC', bjp: 1.7, jdu: 0.7, hams: 0.0, vsip: 1.0, ljp: 1.0, inc: 0.0, rjd: 18.4, cpi: 1.0, jsp: 0.1, others: 0.6, nwr: 0.7 },
        { party: 'RJD', bjp: 2.8, jdu: 0.8, hams: 0.1, vsip: 0.2, ljp: 0.7, inc: 5.5, rjd: 0.0, cpi: 0.2, jsp: 1.3, others: 0.6, nwr: 0.4 },
        { party: 'CPI(M)', bjp: 5.0, jdu: 0.4, hams: 1.9, vsip: 0.0, ljp: 0.0, inc: 11.5, rjd: 17.7, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 5.9, jdu: 2.4, hams: 0.0, vsip: 0.0, ljp: 2.7, inc: 8.0, rjd: 9.3, cpi: 0.0, jsp: 3.6, others: 0.0, nwr: 2.7 },
        { party: 'NWR', bjp: 8.0, jdu: 1.3, hams: 0.2, vsip: 0.2, ljp: 2.7, inc: 4.6, rjd: 5.1, cpi: 0.7, jsp: 1.5, others: 1.3, nwr: 0.0 },
      ]
    },
    {
      zone: 'Zone - 54 Darbhanga',
      data: [
        { party: 'BJP', bjp: 0.0, jdu: 8.7, hams: 0.1, vsip: 0.6, ljp: 1.5, inc: 3.6, rjd: 9.6, cpi: 0.1, jsp: 0.9, others: 0.1, nwr: 0.3 },
        { party: 'JDU', bjp: 14.2, jdu: 0.0, hams: 0.0, vsip: 0.3, ljp: 1.3, inc: 4.6, rjd: 14.2, cpi: 0.1, jsp: 1.7, others: 0.2, nwr: 0.2 },
        { party: 'HAMS', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'VSIP', bjp: 4.1, jdu: 1.6, hams: 0.0, vsip: 0.0, ljp: 0.4, inc: 0.4, rjd: 5.8, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 6.9, jdu: 1.4, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 1.5, rjd: 7.8, cpi: 0.0, jsp: 1.4, others: 0.7, nwr: 0.0 },
        { party: 'INC', bjp: 1.0, jdu: 0.4, hams: 0.2, vsip: 1.0, ljp: 1.0, inc: 0.0, rjd: 20.4, cpi: 1.0, jsp: 0.1, others: 0.6, nwr: 0.7 },
        { party: 'RJD', bjp: 1.8, jdu: 0.6, hams: 0.0, vsip: 0.3, ljp: 0.6, inc: 14.6, rjd: 0.0, cpi: 0.6, jsp: 0.8, others: 0.3, nwr: 0.1 },
        { party: 'CPI(M)', bjp: 5.0, jdu: 0.4, hams: 1.9, vsip: 0.0, ljp: 1.9, inc: 14.8, rjd: 17.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 3.9, jdu: 0.4, hams: 0.0, vsip: 1.5, ljp: 5.2, inc: 17.9, rjd: 14.0, cpi: 2.2, jsp: 0.7, others: 0.0, nwr: 0.0 },
        { party: 'NWR', bjp: 6.8, jdu: 1.0, hams: 0.2, vsip: 0.5, ljp: 2.1, inc: 7.6, rjd: 7.9, cpi: 0.5, jsp: 1.7, others: 0.8, nwr: 0.0 },
      ]
    },
    {
      zone: 'Zone - 55 Kosi',
      data: [
        { party: 'BJP', bjp: 0.0, jdu: 15.1, hams: 0.0, vsip: 0.0, ljp: 1.6, inc: 0.5, rjd: 11.0, cpi: 0.0, jsp: 0.8, others: 0.0, nwr: 0.5 },
        { party: 'JDU', bjp: 16.0, jdu: 0.0, hams: 0.1, vsip: 0.2, ljp: 1.4, inc: 0.8, rjd: 7.7, cpi: 0.0, jsp: 0.9, others: 0.1, nwr: 0.9 },
        { party: 'HAMS', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'VSIP', bjp: 8.1, jdu: 1.6, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 5.4, rjd: 0.0, cpi: 0.0, jsp: 2.7, others: 0.0, nwr: 2.7 },
        { party: 'LJP(RV)', bjp: 6.5, jdu: 1.3, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 1.3, rjd: 3.9, cpi: 1.3, jsp: 0.0, others: 0.0, nwr: 1.3 },
        { party: 'INC', bjp: 0.7, jdu: 1.5, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 17.3, cpi: 0.0, jsp: 0.7, others: 1.4, nwr: 0.0 },
        { party: 'RJD', bjp: 1.0, jdu: 0.3, hams: 0.0, vsip: 0.0, ljp: 0.3, inc: 5.2, rjd: 0.0, cpi: 0.2, jsp: 0.7, others: 0.3, nwr: 0.2 },
        { party: 'CPI(M)', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 8.8, jdu: 1.8, hams: 0.0, vsip: 0.0, ljp: 1.8, inc: 12.3, rjd: 14.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'NWR', bjp: 6.4, jdu: 1.4, hams: 0.0, vsip: 0.2, ljp: 2.6, inc: 2.6, rjd: 6.2, cpi: 0.0, jsp: 1.8, others: 0.2, nwr: 0.0 },
      ]
    },
    {
      zone: 'Zone - 56 Purnia',
      data: [
        { party: 'BJP', bjp: 0.0, jdu: 12.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 3.0, rjd: 9.0, cpi: 0.3, jsp: 0.0, others: 0.0, nwr: 0.3 },
        { party: 'JDU', bjp: 12.3, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.2, inc: 5.1, rjd: 12.6, cpi: 0.0, jsp: 0.2, others: 0.2, nwr: 0.2 },
        { party: 'HAMS', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'VSIP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 7.1, jdu: 2.1, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 1.7, rjd: 5.3, cpi: 5.2, jsp: 0.9, others: 0.9, nwr: 0.0 },
        { party: 'INC', bjp: 1.6, jdu: 0.4, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 3.9, cpi: 3.1, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'RJD', bjp: 2.3, jdu: 0.2, hams: 0.0, vsip: 0.0, ljp: 1.0, inc: 19.8, rjd: 0.0, cpi: 0.0, jsp: 0.7, others: 0.7, nwr: 0.0 },
        { party: 'CPI(M)', bjp: 3.3, jdu: 1.7, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 2.6, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 50.0, rjd: 7.1, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'NWR', bjp: 2.6, jdu: 0.5, hams: 0.5, vsip: 0.0, ljp: 1.4, inc: 22.7, rjd: 14.7, cpi: 1.4, jsp: 0.0, others: 1.4, nwr: 0.0 },
      ]
    },
    {
      zone: 'Zone - 57 Saran',
      data: [
        { party: 'BJP', bjp: 0.0, jdu: 14.5, hams: 0.1, vsip: 0.1, ljp: 2.8, inc: 2.4, rjd: 4.5, cpi: 0.9, jsp: 1.8, others: 0.1, nwr: 0.8 },
        { party: 'JDU', bjp: 10.7, jdu: 0.0, hams: 0.0, vsip: 0.1, ljp: 0.3, inc: 1.0, rjd: 9.3, cpi: 0.8, jsp: 1.9, others: 0.3, nwr: 0.7 },
        { party: 'HAMS', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'VSIP', bjp: 3.9, jdu: 1.4, hams: 0.0, vsip: 0.0, ljp: 0.7, inc: 0.0, rjd: 8.8, cpi: 0.0, jsp: 0.0, others: 0.7, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 2.4, jdu: 2.4, hams: 0.0, vsip: 6.9, ljp: 0.0, inc: 1.5, rjd: 12.1, cpi: 0.0, jsp: 1.7, others: 0.0, nwr: 0.0 },
        { party: 'INC', bjp: 2.4, jdu: 0.4, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 5.5, cpi: 0.0, jsp: 3.4, others: 1.7, nwr: 0.0 },
        { party: 'RJD', bjp: 0.9, jdu: 0.3, hams: 0.1, vsip: 0.8, ljp: 0.3, inc: 14.5, rjd: 0.0, cpi: 1.9, jsp: 2.4, others: 0.2, nwr: 0.7 },
        { party: 'CPI(M)', bjp: 0.8, jdu: 0.1, hams: 0.2, vsip: 0.6, ljp: 0.4, inc: 15.7, rjd: 8.7, cpi: 0.0, jsp: 0.2, others: 0.0, nwr: 0.2 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 5.9, jdu: 0.2, hams: 0.0, vsip: 0.0, ljp: 2.4, inc: 4.9, rjd: 19.5, cpi: 2.4, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'NWR', bjp: 2.9, jdu: 0.3, hams: 0.0, vsip: 1.0, ljp: 2.7, inc: 19.3, rjd: 22.6, cpi: 2.5, jsp: 1.2, others: 1.5, nwr: 0.0 },
      ]
    },
    {
      zone: 'Zone - 58 Munger',
      data: [
        { party: 'BJP', bjp: 0.0, jdu: 9.0, hams: 0.0, vsip: 0.5, ljp: 1.5, inc: 3.6, rjd: 8.7, cpi: 0.2, jsp: 3.1, others: 0.5, nwr: 1.3 },
        { party: 'JDU', bjp: 10.3, jdu: 0.0, hams: 0.1, vsip: 0.3, ljp: 4.2, inc: 2.3, rjd: 8.0, cpi: 0.5, jsp: 2.0, others: 0.4, nwr: 1.7 },
        { party: 'HAMS', bjp: 6.2, jdu: 1.5, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 1.5, rjd: 23.1, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 3.8 },
        { party: 'VSIP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 0.9, jdu: 0.3, hams: 0.9, vsip: 0.0, ljp: 0.0, inc: 0.9, rjd: 5.9, cpi: 1.6, jsp: 1.2, others: 1.9, nwr: 0.9 },
        { party: 'INC', bjp: 1.6, jdu: 0.4, hams: 0.0, vsip: 0.3, ljp: 0.8, inc: 0.0, rjd: 7.8, cpi: 1.9, jsp: 1.7, others: 4.2, nwr: 0.3 },
        { party: 'RJD', bjp: 1.7, jdu: 0.4, hams: 0.2, vsip: 0.0, ljp: 2.4, inc: 6.4, rjd: 0.0, cpi: 0.0, jsp: 0.9, others: 0.7, nwr: 3.1 },
        { party: 'CPI(M)', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 3.3, jdu: 0.8, hams: 0.0, vsip: 0.0, ljp: 3.4, inc: 8.9, rjd: 32.2, cpi: 4.2, jsp: 13.6, others: 0.0, nwr: 2.1 },
        { party: 'NWR', bjp: 7.5, jdu: 0.9, hams: 0.1, vsip: 0.0, ljp: 4.8, inc: 4.0, rjd: 21.0, cpi: 0.9, jsp: 4.0, others: 1.3, nwr: 0.0 },
      ]
    },
    {
      zone: 'Zone - 59 Bhagalpur',
      data: [
        { party: 'BJP', bjp: 0.0, jdu: 17.0, hams: 0.0, vsip: 0.5, ljp: 0.2, inc: 1.4, rjd: 4.8, cpi: 0.0, jsp: 3.4, others: 0.0, nwr: 0.7 },
        { party: 'JDU', bjp: 5.3, jdu: 0.0, hams: 0.3, vsip: 0.0, ljp: 1.7, inc: 0.8, rjd: 7.0, cpi: 0.0, jsp: 0.9, others: 0.1, nwr: 0.4 },
        { party: 'HAMS', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'VSIP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 1.4, jdu: 0.6, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 2.9, jsp: 31.4, others: 0.0, nwr: 0.0 },
        { party: 'INC', bjp: 0.4, jdu: 0.1, hams: 0.0, vsip: 0.0, ljp: 0.6, inc: 0.0, rjd: 2.4, cpi: 0.0, jsp: 1.2, others: 0.0, nwr: 1.8 },
        { party: 'RJD', bjp: 0.6, jdu: 0.4, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 5.6, rjd: 0.0, cpi: 0.0, jsp: 0.8, others: 0.0, nwr: 1.4 },
        { party: 'CPI(M)', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 2.5, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 12.5, others: 0.0, nwr: 0.0 },
        { party: 'NWR', bjp: 1.4, jdu: 1.3, hams: 0.0, vsip: 0.0, ljp: 1.6, inc: 4.2, rjd: 39.9, cpi: 0.6, jsp: 4.2, others: 0.3, nwr: 0.0 },
      ]
    },
    {
      zone: 'Zone - 60 Patna',
      data: [
        { party: 'BJP', bjp: 0.0, jdu: 12.6, hams: 0.0, vsip: 0.2, ljp: 1.3, inc: 3.2, rjd: 7.0, cpi: 0.6, jsp: 1.5, others: 0.4, nwr: 0.3 },
        { party: 'JDU', bjp: 7.4, jdu: 0.0, hams: 0.0, vsip: 0.2, ljp: 0.5, inc: 1.3, rjd: 8.3, cpi: 0.9, jsp: 1.3, others: 0.4, nwr: 0.9 },
        { party: 'HAMS', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'VSIP', bjp: 1.7, jdu: 0.7, hams: 0.0, vsip: 0.0, ljp: 2.9, inc: 1.4, rjd: 8.7, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 1.3, jdu: 0.3, hams: 1.3, vsip: 0.7, ljp: 0.0, inc: 1.7, rjd: 14.1, cpi: 2.7, jsp: 7.4, others: 3.4, nwr: 0.0 },
        { party: 'INC', bjp: 0.2, jdu: 0.1, hams: 0.0, vsip: 0.1, ljp: 0.2, inc: 0.0, rjd: 5.2, cpi: 0.8, jsp: 1.1, others: 0.6, nwr: 0.2 },
        { party: 'RJD', bjp: 0.4, jdu: 0.1, hams: 0.1, vsip: 0.2, ljp: 0.4, inc: 6.8, rjd: 0.0, cpi: 2.0, jsp: 1.3, others: 0.9, nwr: 0.4 },
        { party: 'CPI(M)', bjp: 0.1, jdu: 0.4, hams: 0.0, vsip: 1.0, ljp: 1.5, inc: 5.9, rjd: 8.0, cpi: 0.0, jsp: 1.3, others: 0.5, nwr: 1.8 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 2.7, jdu: 0.7, hams: 0.5, vsip: 2.7, ljp: 2.7, inc: 4.9, rjd: 13.1, cpi: 4.4, jsp: 2.2, others: 0.0, nwr: 0.5 },
        { party: 'NWR', bjp: 2.0, jdu: 0.2, hams: 0.1, vsip: 0.2, ljp: 2.0, inc: 4.5, rjd: 28.9, cpi: 1.4, jsp: 2.2, others: 2.4, nwr: 0.0 },
      ]
    },
    {
      zone: 'Zone - 61 Magadh',
      data: [
        { party: 'BJP', bjp: 0.0, jdu: 15.8, hams: 2.6, vsip: 0.0, ljp: 3.1, inc: 2.4, rjd: 5.3, cpi: 0.4, jsp: 1.3, others: 0.9, nwr: 0.6 },
        { party: 'JDU', bjp: 9.4, jdu: 0.0, hams: 2.2, vsip: 0.2, ljp: 3.1, inc: 1.3, rjd: 8.5, cpi: 0.3, jsp: 2.1, others: 1.0, nwr: 0.5 },
        { party: 'HAMS', bjp: 6.2, jdu: 1.4, hams: 0.0, vsip: 0.0, ljp: 1.1, inc: 1.1, rjd: 7.1, cpi: 0.4, jsp: 5.0, others: 0.0, nwr: 0.4 },
        { party: 'VSIP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 0.4, jdu: 1.0, hams: 0.0, vsip: 1.2, ljp: 0.0, inc: 2.7, rjd: 10.8, cpi: 1.2, jsp: 0.6, others: 0.6, nwr: 0.0 },
        { party: 'INC', bjp: 1.0, jdu: 0.2, hams: 0.0, vsip: 0.0, ljp: 0.3, inc: 0.0, rjd: 7.1, cpi: 0.0, jsp: 0.3, others: 0.0, nwr: 0.6 },
        { party: 'RJD', bjp: 0.9, jdu: 0.5, hams: 0.5, vsip: 0.2, ljp: 1.1, inc: 6.0, rjd: 0.0, cpi: 1.0, jsp: 0.8, others: 0.9, nwr: 0.1 },
        { party: 'CPI(M)', bjp: 0.5, jdu: 0.5, hams: 0.0, vsip: 0.0, ljp: 4.8, inc: 0.0, rjd: 8.7, cpi: 0.0, jsp: 0.0, others: 3.2, nwr: 4.8 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 6.7, jdu: 1.7, hams: 3.3, vsip: 3.3, ljp: 0.0, inc: 0.0, rjd: 36.7, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 3.3 },
        { party: 'NWR', bjp: 1.9, jdu: 0.7, hams: 1.4, vsip: 0.7, ljp: 6.9, inc: 1.9, rjd: 30.3, cpi: 0.8, jsp: 1.2, others: 1.2, nwr: 0.0 },
      ]
    }
  ];

  const renderTable = (title: string, data: typeof stateLevelData) => (
    <Card className="p-6 mb-6">
      <div className="w-full">
        <h4 className="text-center mb-4 text-lg font-semibold">{title}</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="bg-blue-100 border border-gray-300"></th>
                <th colSpan={12} className="text-center bg-blue-100 border border-gray-300 font-semibold">Second Choice Preferences</th>
              </tr>
            </thead>
            <tbody>
                     <tr>
                       <th rowSpan={12} style={{ width: '2%', writingMode: 'sideways-lr', textAlign: 'center' }} className="bg-blue-100 border border-gray-300 font-semibold">Upcoming Elections</th>
                <th className="bg-blue-100 border border-gray-300 font-semibold">Party Name</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#e97132' }}>BJP</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#92d050' }}>JDU</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#dce119' }}>HAMS</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'white', backgroundColor: '#275317' }}>VSIP</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'white', backgroundColor: '#7030a0' }}>LJP(RV)</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#00b0f0' }}>INC</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'white', backgroundColor: '#548235' }}>RJD</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#ff0000' }}>CPI(M)</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#ffff00' }}>JSP</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#aeaeae' }}>Others</th>
                <th className="text-center font-semibold border border-gray-300" style={{ width: '7%', color: 'black', backgroundColor: '#aeaeae' }}>NWR</th>
              </tr>
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <th className="text-center font-medium border border-gray-300" style={{ width: '8%', color: 'black', backgroundColor: getPartyColor(row.party) }}>
                    {row.party}
                  </th>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.bjp}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.jdu}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.hams}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.vsip}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.ljp}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.inc}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.rjd}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.cpi}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.jsp}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.others}</td>
                  <td className="text-center font-medium border border-gray-300 py-2">{row.nwr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );

  const getPartyColor = (party: string): string => {
    const colors: { [key: string]: string } = {
      'BJP': '#e97132',
      'JDU': '#92d050',
      'HAMS': '#dce119',
      'VSIP': '#275317',
      'LJP(RV)': '#7030a0',
      'INC': '#00b0f0',
      'RJD': '#548235',
      'CPI(M)': '#ff0000',
      'JSP': '#ffff00',
      'Others': '#aeaeae',
      'NWR': '#aeaeae',
    };
    return colors[party] || '#aeaeae';
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={1} className="text-2xl font-semibold text-gray-900">
            Second Choice
          </Heading>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1">
          <span></span>
        </div>
      </div>

      {/* State Level Table */}
      {renderTable('State Level', stateLevelData)}

      {/* Zone Tables */}
      {zoneData.map((zone, index) => (
        <div key={index}>
          {renderTable(zone.zone, zone.data)}
        </div>
      ))}

      <style jsx>{`
        .main-container {
          min-height: 100vh;
        }
      `}</style>
    </Container>
  );
}
