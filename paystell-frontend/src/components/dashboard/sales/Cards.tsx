import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import React from "react";

export interface CardData {
  title: string;
  value: string;
  percentage: string;
  icon: React.ReactNode | JSX.Element;
}

interface CardsProps {
  data: CardData[];
  loading: boolean;
}

const Cards: React.FC<CardsProps> = ({ data, loading }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
      {loading &&
        Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} type="card" width="100%" height="160px" />
        ))}
      {data.map((card, index) => {
        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-card-foreground">
                <h2>{card.title}</h2>
                <span>{card.icon}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-base font-normal mt-2 text-card-foreground">
                {card.percentage} from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Cards;
