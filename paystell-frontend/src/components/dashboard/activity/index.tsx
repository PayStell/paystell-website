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
        <CardTitle className="text-base font-semibold text-gray-500">
          Last Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="h-[50px]">
                <TableCell className="font-semibold min-w-[100px]">{item.name}</TableCell>
                <TableCell className="font-semibold min-w-[100px]">{item.sku}</TableCell>
                <TableCell className="font-semibold min-w-[140px]">
                  {item.date.toDateString()}
                </TableCell>
                <TableCell className="font-semibold text-center min-w-[100px]">
                  <p className="bg-slate-100 py-1 px-2 rounded-sm">
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
