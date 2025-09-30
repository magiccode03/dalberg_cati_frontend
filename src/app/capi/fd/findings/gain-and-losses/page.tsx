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

export default function GainAndLossesPage() {
  const stateLevelData = [
    { party: 'BJP', bjp: 74.8, jdu: 10.6, hams: 0.3, vsip: 0.3, ljp: 1.7, inc: 2.4, rjd: 7.2, cpi: 0.3, jsp: 1.5, others: 0.3, nwr: 0.6 },
    { party: 'JDU', bjp: 63.8, jdu: 19.8, hams: 0.2, vsip: 0.2, ljp: 1.8, inc: 2.0, rjd: 9.4, cpi: 0.4, jsp: 1.4, others: 0.4, nwr: 0.7 },
    { party: 'HAMS', bjp: 64.4, jdu: 14.2, hams: 4.2, vsip: 0.0, ljp: 1.0, inc: 1.9, rjd: 8.7, cpi: 0.3, jsp: 4.5, others: 0.0, nwr: 0.6 },
    { party: 'VSIP', bjp: 81.8, jdu: 9.5, hams: 0.0, vsip: 0.6, ljp: 0.9, inc: 0.9, rjd: 5.6, cpi: 0.0, jsp: 0.4, others: 0.1, nwr: 0.1 },
    { party: 'LJP(RV)', bjp: 56.4, jdu: 6.8, hams: 0.4, vsip: 0.5, ljp: 18.9, inc: 2.8, rjd: 9.3, cpi: 1.0, jsp: 2.5, others: 1.0, nwr: 0.5 },
    { party: 'INC', bjp: 10.8, jdu: 2.6, hams: 0.0, vsip: 0.3, ljp: 0.5, inc: 16.2, rjd: 66.6, cpi: 0.9, jsp: 0.8, others: 0.8, nwr: 0.4 },
    { party: 'RJD', bjp: 13.3, jdu: 3.2, hams: 0.1, vsip: 0.2, ljp: 0.7, inc: 8.7, rjd: 70.7, cpi: 0.9, jsp: 1.1, others: 0.6, nwr: 0.5 },
    { party: 'CPI(M)', bjp: 11.8, jdu: 3.1, hams: 0.3, vsip: 0.6, ljp: 1.1, inc: 11.0, rjd: 52.4, cpi: 17.7, jsp: 0.5, others: 0.4, nwr: 1.0 },
    { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
    { party: 'Others', bjp: 33.3, jdu: 5.6, hams: 0.2, vsip: 1.0, ljp: 3.1, inc: 9.7, rjd: 28.3, cpi: 2.7, jsp: 5.2, others: 9.7, nwr: 1.2 },
    { party: 'NWR', bjp: 49.5, jdu: 6.3, hams: 0.2, vsip: 0.3, ljp: 3.0, inc: 6.3, rjd: 27.1, cpi: 0.9, jsp: 2.0, others: 1.3, nwr: 3.0 },
  ];

  const zoneData: ZoneData[] = [
    {
      zone: 'Zone - 53 Tirhut',
      data: [
        { party: 'BJP', bjp: 78.5, jdu: 7.7, hams: 0.0, vsip: 0.2, ljp: 1.9, inc: 1.7, rjd: 7.3, cpi: 0.1, jsp: 1.4, others: 0.2, nwr: 0.9 },
        { party: 'JDU', bjp: 73.8, jdu: 10.9, hams: 0.0, vsip: 0.1, ljp: 2.3, inc: 1.7, rjd: 8.8, cpi: 0.3, jsp: 0.9, others: 0.6, nwr: 0.6 },
        { party: 'HAMS', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'VSIP', bjp: 89.2, jdu: 4.1, hams: 0.0, vsip: 0.5, ljp: 0.9, inc: 0.9, rjd: 3.6, cpi: 0.0, jsp: 0.9, others: 0.0, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 62.0, jdu: 10.0, hams: 0.5, vsip: 0.5, ljp: 14.7, inc: 2.3, rjd: 5.8, cpi: 0.0, jsp: 2.6, others: 0.5, nwr: 1.2 },
        { party: 'INC', bjp: 9.7, jdu: 2.3, hams: 0.0, vsip: 1.0, ljp: 1.0, inc: 16.4, rjd: 67.2, cpi: 1.0, jsp: 0.1, others: 0.6, nwr: 0.7 },
        { party: 'RJD', bjp: 19.2, jdu: 3.0, hams: 0.1, vsip: 0.2, ljp: 0.7, inc: 5.5, rjd: 68.8, cpi: 0.2, jsp: 1.3, others: 0.6, nwr: 0.4 },
        { party: 'CPI(M)', bjp: 25.0, jdu: 1.9, hams: 1.9, vsip: 0.0, ljp: 0.0, inc: 11.5, rjd: 57.7, cpi: 1.9, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 29.5, jdu: 8.0, hams: 0.0, vsip: 0.0, ljp: 2.7, inc: 8.0, rjd: 39.3, cpi: 0.0, jsp: 3.6, others: 6.3, nwr: 2.7 },
        { party: 'NWR', bjp: 56.0, jdu: 5.2, hams: 0.2, vsip: 0.2, ljp: 2.7, inc: 4.6, rjd: 25.1, cpi: 0.7, jsp: 1.5, others: 1.3, nwr: 2.4 },
      ]
    },
    {
      zone: 'Zone - 54 Darbhanga',
      data: [
        { party: 'BJP', bjp: 77.6, jdu: 5.7, hams: 0.1, vsip: 0.6, ljp: 1.5, inc: 3.6, rjd: 9.6, cpi: 0.1, jsp: 0.9, others: 0.1, nwr: 0.3 },
        { party: 'JDU', bjp: 65.3, jdu: 12.1, hams: 0.0, vsip: 0.3, ljp: 1.3, inc: 4.6, rjd: 14.2, cpi: 0.1, jsp: 1.7, others: 0.2, nwr: 0.2 },
        { party: 'HAMS', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'VSIP', bjp: 83.0, jdu: 8.9, hams: 0.0, vsip: 1.3, ljp: 0.4, inc: 0.4, rjd: 5.8, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 73.1, jdu: 2.9, hams: 0.0, vsip: 0.0, ljp: 11.6, inc: 2.5, rjd: 7.8, cpi: 0.0, jsp: 1.4, others: 0.7, nwr: 0.0 },
        { party: 'INC', bjp: 13.8, jdu: 2.0, hams: 0.2, vsip: 0.5, ljp: 0.5, inc: 30.4, rjd: 50.6, cpi: 0.5, jsp: 1.1, others: 0.5, nwr: 0.0 },
        { party: 'RJD', bjp: 15.3, jdu: 2.4, hams: 0.0, vsip: 0.3, ljp: 0.6, inc: 14.6, rjd: 65.1, cpi: 0.6, jsp: 0.8, others: 0.3, nwr: 0.1 },
        { party: 'CPI(M)', bjp: 31.5, jdu: 11.1, hams: 1.9, vsip: 0.0, ljp: 1.9, inc: 14.8, rjd: 37.0, cpi: 1.9, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 19.4, jdu: 2.2, hams: 0.0, vsip: 1.5, ljp: 5.2, inc: 17.9, rjd: 44.0, cpi: 2.2, jsp: 0.7, others: 6.7, nwr: 0.0 },
        { party: 'NWR', bjp: 53.2, jdu: 4.8, hams: 0.2, vsip: 0.5, ljp: 2.1, inc: 7.6, rjd: 27.9, cpi: 0.5, jsp: 1.7, others: 0.8, nwr: 0.8 },
      ]
    },
    {
      zone: 'Zone - 55 Kosi',
      data: [
        { party: 'BJP', bjp: 70.3, jdu: 15.1, hams: 0.0, vsip: 0.0, ljp: 1.6, inc: 0.5, rjd: 11.0, cpi: 0.0, jsp: 0.8, others: 0.0, nwr: 0.5 },
        { party: 'JDU', bjp: 56.0, jdu: 31.8, hams: 0.1, vsip: 0.2, ljp: 1.4, inc: 0.8, rjd: 7.7, cpi: 0.0, jsp: 0.9, others: 0.1, nwr: 0.9 },
        { party: 'HAMS', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'VSIP', bjp: 81.1, jdu: 8.1, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 5.4, rjd: 0.0, cpi: 0.0, jsp: 2.7, others: 0.0, nwr: 2.7 },
        { party: 'LJP(RV)', bjp: 76.6, jdu: 6.5, hams: 0.0, vsip: 0.0, ljp: 7.8, inc: 2.6, rjd: 3.9, cpi: 1.3, jsp: 0.0, others: 0.0, nwr: 1.3 },
        { party: 'INC', bjp: 6.8, jdu: 7.5, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 16.3, rjd: 67.3, cpi: 0.0, jsp: 0.7, others: 1.4, nwr: 0.0 },
        { party: 'RJD', bjp: 10.0, jdu: 3.1, hams: 0.0, vsip: 0.0, ljp: 0.3, inc: 5.2, rjd: 79.8, cpi: 0.2, jsp: 0.7, others: 0.3, nwr: 0.2 },
        { party: 'CPI(M)', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 61.4, jdu: 8.8, hams: 0.0, vsip: 0.0, ljp: 1.8, inc: 12.3, rjd: 14.0, cpi: 0.0, jsp: 0.0, others: 1.8, nwr: 0.0 },
        { party: 'NWR', bjp: 43.6, jdu: 11.4, hams: 0.0, vsip: 0.2, ljp: 2.6, inc: 2.6, rjd: 36.2, cpi: 0.0, jsp: 1.8, others: 0.2, nwr: 1.3 },
      ]
    },
    {
      zone: 'Zone - 56 Purnia',
      data: [
        { party: 'BJP', bjp: 75.3, jdu: 12.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 3.0, rjd: 9.0, cpi: 0.3, jsp: 0.0, others: 0.0, nwr: 0.3 },
        { party: 'JDU', bjp: 62.3, jdu: 19.1, hams: 0.0, vsip: 0.0, ljp: 0.2, inc: 5.1, rjd: 12.6, cpi: 0.0, jsp: 0.2, others: 0.2, nwr: 0.2 },
        { party: 'HAMS', bjp: 50.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 50.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'VSIP', bjp: 100.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 37.1, jdu: 12.1, hams: 0.0, vsip: 0.0, ljp: 5.2, inc: 3.4, rjd: 35.3, cpi: 5.2, jsp: 0.9, others: 0.9, nwr: 0.0 },
        { party: 'INC', bjp: 15.6, jdu: 4.2, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 43.3, rjd: 33.9, cpi: 3.1, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'RJD', bjp: 20.5, jdu: 2.3, hams: 0.0, vsip: 0.0, ljp: 1.0, inc: 19.8, rjd: 55.1, cpi: 0.0, jsp: 0.7, others: 0.7, nwr: 0.0 },
        { party: 'CPI(M)', bjp: 33.3, jdu: 16.7, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 50.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 28.6, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 50.0, rjd: 7.1, cpi: 0.0, jsp: 0.0, others: 14.3, nwr: 0.0 },
        { party: 'NWR', bjp: 52.6, jdu: 5.2, hams: 0.5, vsip: 0.0, ljp: 1.4, inc: 22.7, rjd: 14.7, cpi: 1.4, jsp: 0.0, others: 1.4, nwr: 0.0 },
      ]
    },
    {
      zone: 'Zone - 57 Saran',
      data: [
        { party: 'BJP', bjp: 72.1, jdu: 14.5, hams: 0.1, vsip: 0.1, ljp: 2.8, inc: 2.4, rjd: 4.5, cpi: 0.9, jsp: 1.8, others: 0.1, nwr: 0.8 },
        { party: 'JDU', bjp: 60.7, jdu: 25.0, hams: 0.0, vsip: 0.1, ljp: 0.3, inc: 1.0, rjd: 9.3, cpi: 0.8, jsp: 1.9, others: 0.3, nwr: 0.7 },
        { party: 'HAMS', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'VSIP', bjp: 75.9, jdu: 13.9, hams: 0.0, vsip: 0.0, ljp: 0.7, inc: 0.0, rjd: 8.8, cpi: 0.0, jsp: 0.0, others: 0.7, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 27.6, jdu: 22.4, hams: 0.0, vsip: 6.9, ljp: 24.1, inc: 5.2, rjd: 12.1, cpi: 0.0, jsp: 1.7, others: 0.0, nwr: 0.0 },
        { party: 'INC', bjp: 24.4, jdu: 4.2, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 10.9, rjd: 55.5, cpi: 0.0, jsp: 3.4, others: 1.7, nwr: 0.0 },
        { party: 'RJD', bjp: 9.5, jdu: 3.6, hams: 0.1, vsip: 0.8, ljp: 0.3, inc: 14.5, rjd: 66.0, cpi: 1.9, jsp: 2.4, others: 0.2, nwr: 0.7 },
        { party: 'CPI(M)', bjp: 7.6, jdu: 0.8, hams: 0.2, vsip: 0.6, ljp: 0.4, inc: 15.7, rjd: 48.7, cpi: 25.8, jsp: 0.2, others: 0.0, nwr: 0.2 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 65.9, jdu: 2.4, hams: 0.0, vsip: 0.0, ljp: 2.4, inc: 4.9, rjd: 19.5, cpi: 2.4, jsp: 0.0, others: 2.4, nwr: 0.0 },
        { party: 'NWR', bjp: 45.5, jdu: 2.9, hams: 0.0, vsip: 1.0, ljp: 2.7, inc: 19.3, rjd: 22.6, cpi: 2.5, jsp: 1.2, others: 1.5, nwr: 0.8 },
      ]
    },
    {
      zone: 'Zone - 58 Munger',
      data: [
        { party: 'BJP', bjp: 71.5, jdu: 9.0, hams: 0.0, vsip: 0.5, ljp: 1.5, inc: 3.6, rjd: 8.7, cpi: 0.2, jsp: 3.1, others: 0.5, nwr: 1.3 },
        { party: 'JDU', bjp: 60.3, jdu: 20.2, hams: 0.1, vsip: 0.3, ljp: 4.2, inc: 2.3, rjd: 8.0, cpi: 0.5, jsp: 2.0, others: 0.4, nwr: 1.7 },
        { party: 'HAMS', bjp: 46.2, jdu: 11.5, hams: 3.8, vsip: 0.0, ljp: 0.0, inc: 11.5, rjd: 23.1, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 3.8 },
        { party: 'VSIP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 50.9, jdu: 3.1, hams: 0.9, vsip: 0.0, ljp: 31.7, inc: 1.9, rjd: 5.9, cpi: 1.6, jsp: 1.2, others: 1.9, nwr: 0.9 },
        { party: 'INC', bjp: 15.6, jdu: 4.4, hams: 0.0, vsip: 0.3, ljp: 0.8, inc: 13.1, rjd: 57.8, cpi: 1.9, jsp: 1.7, others: 4.2, nwr: 0.3 },
        { party: 'RJD', bjp: 14.7, jdu: 4.2, hams: 0.2, vsip: 0.0, ljp: 2.4, inc: 6.4, rjd: 67.3, cpi: 0.0, jsp: 0.9, others: 0.7, nwr: 3.1 },
        { party: 'CPI(M)', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 26.3, jdu: 3.8, hams: 0.0, vsip: 0.0, ljp: 3.4, inc: 8.9, rjd: 32.2, cpi: 4.2, jsp: 13.6, others: 5.5, nwr: 2.1 },
        { party: 'NWR', bjp: 47.5, jdu: 6.9, hams: 0.1, vsip: 0.0, ljp: 4.8, inc: 4.0, rjd: 21.0, cpi: 0.9, jsp: 4.0, others: 1.3, nwr: 9.4 },
      ]
    },
    {
      zone: 'Zone - 59 Bhagalpur',
      data: [
        { party: 'BJP', bjp: 72.0, jdu: 17.0, hams: 0.0, vsip: 0.5, ljp: 0.2, inc: 1.4, rjd: 4.8, cpi: 0.0, jsp: 3.4, others: 0.0, nwr: 0.7 },
        { party: 'JDU', bjp: 55.3, jdu: 33.4, hams: 0.3, vsip: 0.0, ljp: 1.7, inc: 0.8, rjd: 7.0, cpi: 0.0, jsp: 0.9, others: 0.1, nwr: 0.4 },
        { party: 'HAMS', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'VSIP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 8.6, jdu: 5.7, hams: 0.0, vsip: 0.0, ljp: 51.4, inc: 0.0, rjd: 0.0, cpi: 2.9, jsp: 31.4, others: 0.0, nwr: 0.0 },
        { party: 'INC', bjp: 10.4, jdu: 0.6, hams: 0.0, vsip: 0.0, ljp: 0.6, inc: 12.9, rjd: 72.4, cpi: 0.0, jsp: 1.2, others: 0.0, nwr: 1.8 },
        { party: 'RJD', bjp: 5.6, jdu: 4.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 5.6, rjd: 82.5, cpi: 0.0, jsp: 0.8, others: 0.0, nwr: 1.4 },
        { party: 'CPI(M)', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 87.5, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 12.5, others: 0.0, nwr: 0.0 },
        { party: 'NWR', bjp: 35.4, jdu: 11.3, hams: 0.0, vsip: 0.0, ljp: 1.6, inc: 4.2, rjd: 39.9, cpi: 0.6, jsp: 4.2, others: 0.3, nwr: 2.6 },
      ]
    },
    {
      zone: 'Zone - 60 Patna',
      data: [
        { party: 'BJP', bjp: 72.7, jdu: 12.6, hams: 0.0, vsip: 0.2, ljp: 1.3, inc: 3.2, rjd: 7.0, cpi: 0.6, jsp: 1.5, others: 0.4, nwr: 0.3 },
        { party: 'JDU', bjp: 67.4, jdu: 18.8, hams: 0.0, vsip: 0.2, ljp: 0.5, inc: 1.3, rjd: 8.3, cpi: 0.9, jsp: 1.3, others: 0.4, nwr: 0.9 },
        { party: 'HAMS', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'VSIP', bjp: 65.2, jdu: 21.7, hams: 0.0, vsip: 0.0, ljp: 2.9, inc: 1.4, rjd: 8.7, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 34.2, jdu: 7.4, hams: 1.3, vsip: 0.7, ljp: 25.5, inc: 3.4, rjd: 14.1, cpi: 2.7, jsp: 7.4, others: 3.4, nwr: 0.0 },
        { party: 'INC', bjp: 4.8, jdu: 1.9, hams: 0.0, vsip: 0.1, ljp: 0.2, inc: 5.3, rjd: 85.2, cpi: 0.8, jsp: 1.1, others: 0.6, nwr: 0.2 },
        { party: 'RJD', bjp: 10.0, jdu: 2.2, hams: 0.1, vsip: 0.2, ljp: 0.4, inc: 6.8, rjd: 75.9, cpi: 2.0, jsp: 1.3, others: 0.9, nwr: 0.4 },
        { party: 'CPI(M)', bjp: 13.1, jdu: 4.1, hams: 0.0, vsip: 1.0, ljp: 1.5, inc: 5.9, rjd: 58.0, cpi: 12.6, jsp: 1.3, others: 0.5, nwr: 1.8 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 37.7, jdu: 7.7, hams: 0.5, vsip: 2.7, ljp: 2.7, inc: 4.9, rjd: 13.1, cpi: 4.4, jsp: 2.2, others: 23.5, nwr: 0.5 },
        { party: 'NWR', bjp: 48.1, jdu: 6.7, hams: 0.1, vsip: 0.2, ljp: 2.0, inc: 4.5, rjd: 28.9, cpi: 1.4, jsp: 2.2, others: 2.4, nwr: 3.5 },
      ]
    },
    {
      zone: 'Zone - 61 Magadh',
      data: [
        { party: 'BJP', bjp: 67.7, jdu: 15.8, hams: 2.6, vsip: 0.0, ljp: 3.1, inc: 2.4, rjd: 5.3, cpi: 0.4, jsp: 1.3, others: 0.9, nwr: 0.6 },
        { party: 'JDU', bjp: 59.4, jdu: 21.3, hams: 2.2, vsip: 0.2, ljp: 3.1, inc: 1.3, rjd: 8.5, cpi: 0.3, jsp: 2.1, others: 1.0, nwr: 0.5 },
        { party: 'HAMS', bjp: 66.2, jdu: 14.6, hams: 4.3, vsip: 0.0, ljp: 1.1, inc: 1.1, rjd: 7.1, cpi: 0.4, jsp: 5.0, others: 0.0, nwr: 0.4 },
        { party: 'VSIP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'LJP(RV)', bjp: 40.4, jdu: 10.2, hams: 0.0, vsip: 1.2, ljp: 29.5, inc: 5.4, rjd: 10.8, cpi: 1.2, jsp: 0.6, others: 0.6, nwr: 0.0 },
        { party: 'INC', bjp: 16.0, jdu: 1.5, hams: 0.0, vsip: 0.0, ljp: 0.3, inc: 14.3, rjd: 67.1, cpi: 0.0, jsp: 0.3, others: 0.0, nwr: 0.6 },
        { party: 'RJD', bjp: 13.9, jdu: 5.4, hams: 0.5, vsip: 0.2, ljp: 1.1, inc: 6.0, rjd: 70.0, cpi: 1.0, jsp: 0.8, others: 0.9, nwr: 0.1 },
        { party: 'CPI(M)', bjp: 9.5, jdu: 9.5, hams: 0.0, vsip: 0.0, ljp: 4.8, inc: 0.0, rjd: 58.7, cpi: 9.5, jsp: 0.0, others: 3.2, nwr: 4.8 },
        { party: 'JSP', bjp: 0.0, jdu: 0.0, hams: 0.0, vsip: 0.0, ljp: 0.0, inc: 0.0, rjd: 0.0, cpi: 0.0, jsp: 0.0, others: 0.0, nwr: 0.0 },
        { party: 'Others', bjp: 26.7, jdu: 16.7, hams: 3.3, vsip: 3.3, ljp: 0.0, inc: 0.0, rjd: 36.7, cpi: 0.0, jsp: 0.0, others: 10.0, nwr: 3.3 },
        { party: 'NWR', bjp: 45.9, jdu: 7.4, hams: 1.4, vsip: 0.7, ljp: 6.9, inc: 1.9, rjd: 30.3, cpi: 0.8, jsp: 1.2, others: 1.2, nwr: 2.4 },
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
                <th colSpan={12} className="text-center bg-blue-100 border border-gray-300 font-semibold">Upcoming Elections</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowSpan={12} style={{ width: '2%', writingMode: 'sideways-lr', textAlign: 'center' }} className="bg-blue-100 border border-gray-300 font-semibold">2020 AE</th>
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
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={1} className="text-2xl font-semibold text-gray-900">
            Gain and Losses
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
