"use client";

import React from "react";

interface FormattedNumberProps {
  value: number | string;
  locale?: string; // Default: 'en-US'
  currency?: string; // Optional, for currency display
}

const FormattedNumber: React.FC<FormattedNumberProps> = ({
  value,
  locale = "en-US",
  currency,
}) => {
  if (value === null || value === undefined || value === "") return <>-</>;

  const numberValue = Number(value);

  const formatted = currency
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
      }).format(numberValue)
    : new Intl.NumberFormat(locale).format(numberValue);

  return <span>{formatted}</span>;
};

export default FormattedNumber;
