/*Jaeyhong Shin wrote all 22 lines of code for this file*/
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

//remove later
console.log("API_URL =", API_URL);

type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface TimePeriodSelectorProps {
  selected: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

export function TimePeriodSelector({ selected, onChange }: TimePeriodSelectorProps) {
  return (
    <Tabs value={selected} onValueChange={(value) => onChange(value as TimePeriod)}>
      <TabsList>
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="yearly">Yearly</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
