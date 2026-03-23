import { PainComparison } from "@/types";

export const PAIN_COMPARISONS: PainComparison[] = [
  {
    label: "Fill-up Cost",
    description: "What it costs to fill a 60L sedan tank right now",
    calculate: (pricePerLitre: number) => {
      const cost = (pricePerLitre / 100) * 60;
      return `$${cost.toFixed(2)}`;
    },
  },
  {
    label: "Weekly Commute Tax",
    description: "Average weekly cost of a 30km/day commute (8L/100km)",
    calculate: (pricePerLitre: number) => {
      const dailyKm = 30;
      const fuelPer100km = 8;
      const weeklyLitres = (dailyKm * 5 * fuelPer100km) / 100;
      const cost = (pricePerLitre / 100) * weeklyLitres;
      return `$${cost.toFixed(2)}/week`;
    },
  },
  {
    label: "Smashed Avo Equivalency",
    description:
      "How many smashed avos your weekly fuel could buy (@ $22 each)",
    calculate: (pricePerLitre: number) => {
      const weeklyFuelCost = (pricePerLitre / 100) * ((30 * 5 * 8) / 100);
      const avos = weeklyFuelCost / 22;
      return `${avos.toFixed(1)} smashed avos`;
    },
  },
  {
    label: "Netflix Subscriptions",
    description: "Your monthly fuel bill in Netflix subs (@ $16.99/mo)",
    calculate: (pricePerLitre: number) => {
      const monthlyFuelCost = (pricePerLitre / 100) * ((30 * 22 * 8) / 100);
      const subs = monthlyFuelCost / 16.99;
      return `${subs.toFixed(1)} Netflix subs`;
    },
  },
  {
    label: "Days Worked Just for Fuel",
    description: "Days of annual leave you work just for fuel (median salary)",
    calculate: (pricePerLitre: number) => {
      const annualFuelCost = (pricePerLitre / 100) * ((30 * 260 * 8) / 100);
      const medianDailyPay = 73000 / 260;
      const days = annualFuelCost / medianDailyPay;
      return `${days.toFixed(1)} days/year`;
    },
  },
];
