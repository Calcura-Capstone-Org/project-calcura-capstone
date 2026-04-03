import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

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
