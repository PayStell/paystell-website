import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export interface CardData {
  title: string;
  value: string;
  percentage: string;
  icon: React.ReactNode | JSX.Element;
}

interface CardsProps {
  data: CardData[];
}

const Cards: React.FC<CardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
      {data.map((card, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex flex-row justify-between">
              <h2>{card.title}</h2>
              <span>{card.icon}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
            <p className="text-base font-normal mt-2">
              {card.percentage} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Cards;
