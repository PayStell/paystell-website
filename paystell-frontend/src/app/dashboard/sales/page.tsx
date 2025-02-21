import Header from "@/components/dashboard/sales/Header";
import Cards, { CardData } from "@/components/dashboard/sales/Cards";
import SalesHistory from "@/components/dashboard/sales/SalesHistory";
import { FiUsers } from "react-icons/fi";
import { CiCreditCard1 } from "react-icons/ci";
import { MdShowChart } from "react-icons/md";

export const cardData: CardData[] = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    percentage: "20.1%",
    icon: <span>$</span>,
  },
  {
    title: "Subscriptions",
    value: "+3000",
    percentage: "20.1%",
    icon: <FiUsers />,
  },
  {
    title: "Sales",
    value: "+12,234",
    percentage: "20.1%",
    icon: <CiCreditCard1 />,
  },
  {
    title: "Active Now",
    value: "+3000",
    percentage: "20.1%",
    icon: <MdShowChart />,
  },
];

const SalesPage = () => {
  return (
    <div className="py-10 px-8">
      <Header />
      <Cards data={cardData} />
      <SalesHistory />
    </div>
  );
};

export default SalesPage;
