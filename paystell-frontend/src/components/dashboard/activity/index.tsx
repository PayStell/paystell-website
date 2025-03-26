import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export interface UserActivity {
  id: number;
  name: string;
  sku: string;
  date: Date;
  value: number;
  currency: string;
}

interface ActivityProps {
  data: UserActivity[];
}

const Activity = ({ data }: ActivityProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Last Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody className="text-card-foreground">
            {data.map((item) => (
              <TableRow key={item.id} className="h-[50px]">
                <TableCell className="min-w-[100px]">{item.name}</TableCell>
                <TableCell className="min-w-[100px]">{item.sku}</TableCell>
                <TableCell className="min-w-[140px]">
                  {item.date.toDateString()}
                </TableCell>
                <TableCell className="text-center min-w-[100px]">
                  <p className="bg-background text-foreground py-1 px-2 rounded-sm">
                    {item.value > 0 ? "+" : "-"}
                    {item.value} {item.currency}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Activity;
