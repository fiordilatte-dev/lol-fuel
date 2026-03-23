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
  {
    label: "Bunnings Sausage Sizzles",
    description: "How many Bunnings snags your fill-up could buy (@ $3.50 each)",
    calculate: (pricePerLitre: number) => {
      const fillCost = (pricePerLitre / 100) * 60;
      const snags = fillCost / 3.5;
      return `${Math.floor(snags)} snags`;
    },
  },
  {
    label: "Woolies Roast Chooks",
    description: "Fill-ups measured in hot roast chickens (@ $12 each)",
    calculate: (pricePerLitre: number) => {
      const fillCost = (pricePerLitre / 100) * 60;
      const chooks = fillCost / 12;
      return `${chooks.toFixed(1)} chooks`;
    },
  },
  {
    label: "Oat Milk Flat Whites",
    description: "Weekly fuel cost in overpriced coffees (@ $6.50 each)",
    calculate: (pricePerLitre: number) => {
      const weeklyFuelCost = (pricePerLitre / 100) * ((30 * 5 * 8) / 100);
      const coffees = weeklyFuelCost / 6.5;
      return `${coffees.toFixed(1)} flat whites`;
    },
  },
  {
    label: "Macca's Large Meal",
    description: "Fill-ups in Maccas large Big Mac meals (@ $16.45)",
    calculate: (pricePerLitre: number) => {
      const fillCost = (pricePerLitre / 100) * 60;
      const meals = fillCost / 16.45;
      return `${meals.toFixed(1)} meals`;
    },
  },
  {
    label: "Aldi Shop",
    description: "What percentage of a basic weekly Aldi shop your fuel costs (@ $120)",
    calculate: (pricePerLitre: number) => {
      const weeklyFuelCost = (pricePerLitre / 100) * ((30 * 5 * 8) / 100);
      const pct = (weeklyFuelCost / 120) * 100;
      return `${pct.toFixed(0)}% of your groceries`;
    },
  },
  {
    label: "Uber vs Driving",
    description: "Daily Uber cost for 30km vs driving yourself (Uber @ $1.70/km)",
    calculate: (pricePerLitre: number) => {
      const drivingCost = (pricePerLitre / 100) * ((30 * 8) / 100);
      const uberCost = 30 * 1.7;
      const ratio = uberCost / drivingCost;
      return `Uber is ${ratio.toFixed(1)}x more`;
    },
  },
  {
    label: "Spotify Premium Months",
    description: "One fill-up buys you this many months of Spotify (@ $13.99/mo)",
    calculate: (pricePerLitre: number) => {
      const fillCost = (pricePerLitre / 100) * 60;
      const months = fillCost / 13.99;
      return `${months.toFixed(1)} months`;
    },
  },
  {
    label: "Sydney to Melb Road Trip",
    description: "Fuel cost for a Sydney–Melbourne drive (878km, 8L/100km)",
    calculate: (pricePerLitre: number) => {
      const litres = (878 * 8) / 100;
      const cost = (pricePerLitre / 100) * litres;
      return `$${cost.toFixed(2)} one way`;
    },
  },
  {
    label: "Minutes of Minimum Wage",
    description: "Minutes you work at minimum wage ($24.10/hr) to fill up",
    calculate: (pricePerLitre: number) => {
      const fillCost = (pricePerLitre / 100) * 60;
      const minutesPerDollar = 60 / 24.1;
      const minutes = fillCost * minutesPerDollar;
      return `${Math.round(minutes)} minutes`;
    },
  },
  {
    label: "Pints at the Pub",
    description: "Fill-up cost measured in schooners of beer (@ $13 each)",
    calculate: (pricePerLitre: number) => {
      const fillCost = (pricePerLitre / 100) * 60;
      const pints = fillCost / 13;
      return `${pints.toFixed(1)} schooners`;
    },
  },
  {
    label: "Rent Contribution",
    description: "Monthly fuel as a % of median Aussie rent (@ $600/week)",
    calculate: (pricePerLitre: number) => {
      const monthlyFuelCost = (pricePerLitre / 100) * ((30 * 22 * 8) / 100);
      const monthlyRent = 600 * 4.33;
      const pct = (monthlyFuelCost / monthlyRent) * 100;
      return `${pct.toFixed(1)}% of your rent`;
    },
  },
];
