import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

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
    <Card className="w-full max-w-md mx-auto sm:max-w-none">
      <CardHeader className="px-4 sm:px-6 pb-3">
        <CardTitle className="text-sm sm:text-base font-semibold text-center sm:text-left">
          Last Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableBody className="text-card-foreground">
              {data.map((item) => (
                <TableRow key={item.id} className="h-[50px]">
                  <TableCell className="min-w-[100px] text-sm">{item.name}</TableCell>
                  <TableCell className="min-w-[100px] text-sm">{item.sku}</TableCell>
                  <TableCell className="min-w-[140px] text-sm">
                    {item.date.toDateString()}
                  </TableCell>
                  <TableCell className="text-center min-w-[100px]">
                    <p className="bg-background text-foreground py-1 px-2 rounded-sm text-sm">
                      {item.value > 0 ? '+' : ''}
                      {item.value} {item.currency}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {data.map((item) => (
            <div key={item.id} className="border rounded-lg p-3 sm:p-4 space-y-2 bg-card shadow-sm">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm leading-tight truncate">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">SKU: {item.sku}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-background text-foreground py-1.5 px-2.5 rounded-sm min-h-[32px] flex items-center">
                    <p
                      className={`text-sm font-medium ${
                        item.value > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {item.value > 0 ? '+' : ''}
                      {item.value} {item.currency}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-1 border-t border-border/30">
                <p className="text-xs text-muted-foreground">{item.date.toDateString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {data.length === 0 && (
          <div className="text-center py-8 px-4">
            <p className="text-sm text-muted-foreground">No recent activity to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Activity;
