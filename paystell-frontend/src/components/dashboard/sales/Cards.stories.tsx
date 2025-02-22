import type { Meta, StoryObj } from "@storybook/react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Cards, { CardData } from "./Cards";

const meta: Meta<typeof Cards> = {
  title: "Shared/Cards",
  component: Cards,
  tags: ["autodocs"],
  argTypes: {
    data: {
      control: "object",
      description: "Un arreglo de datos para mostrar en cada tarjeta.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Cards>;

const defaultData: CardData[] = [
  {
    title: "Sales",
    value: "$5,000",
    percentage: "+15%",
    icon: <FaArrowUp />,
  },
  {
    title: "Expenses",
    value: "$2,000",
    percentage: "-5%",
    icon: <FaArrowDown />,
  },
  {
    title: "Profit",
    value: "$3,000",
    percentage: "+20%",
    icon: <FaArrowUp />,
  },
  {
    title: "Revenue",
    value: "$8,000",
    percentage: "+10%",
    icon: <FaArrowUp />,
  },
];

export const Default: Story = {
  args: {
    data: defaultData,
  },
};

export const CustomCards: Story = {
  args: {
    data: [
      {
        title: "Growth",
        value: "$7,000",
        percentage: "+30%",
        icon: <FaArrowUp />,
      },
      {
        title: "Losses",
        value: "$1,500",
        percentage: "-2%",
        icon: <FaArrowDown />,
      },
      {
        title: "Net Worth",
        value: "$10,000",
        percentage: "+5%",
        icon: <FaArrowUp />,
      },
      {
        title: "Investments",
        value: "$12,000",
        percentage: "+25%",
        icon: <FaArrowUp />,
      },
    ],
  },
};
