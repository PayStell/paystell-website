import Balance from "@/components/dashboard/balance";
import Activity, { UserActivity } from "@/components/dashboard/activity";

// @TODO remove this mock data once the BE is integrated
const activityData: UserActivity[] = [
  {
    id: 1,
    name: "Product 1",
    sku: "ID12345",
    date: new Date("11/10/2024"),
    value: 1099.9,
    currency: "USDC",
  },
  {
    id: 1,
    name: "Product 1",
    sku: "ID12345",
    date: new Date("11/15/2024"),
    value: 1000,
    currency: "XML",
  },
  {
    id: 1,
    name: "Product 1",
    sku: "ID12345",
    date: new Date("11/20/2024"),
    value: 1000,
    currency: "XML",
  },
];

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="flex flex-col gap-8 mt-5 items-start md:flex-row">
        <Balance balance={2100.1} lastBalance={1800} />
        <Activity data={activityData} />
      </div>
    </main>
  );
}
