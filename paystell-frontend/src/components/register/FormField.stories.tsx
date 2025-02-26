import type { Meta, StoryObj } from "@storybook/react";
import { useForm,  } from "react-hook-form";
import FormField from "./FormField";

const meta: Meta<typeof FormField> = {
  title: "Shared/FormField",
  component: FormField,
  tags: ["autodocs"],
  argTypes: {
    id: { control: "text", description: "El identificador único del campo." },
    label: { control: "text", description: "La etiqueta del campo." },
    placeholder: {
      control: "text",
      description: "Texto que aparece cuando el campo está vacío.",
    },
    type: {
      control: "text",
      description: 'Tipo del campo, por defecto es "text".',
    },
    error: { control: "text", description: "Mensaje de error si hay uno." },
  },
};

export default meta;

type Story = StoryObj<typeof FormField>;


const Template = (args: React.ComponentProps<typeof FormField>) => {
  const { register } = useForm();
  return <FormField {...args} register={register(args.id)} />;
};

export const Default: Story = {
  render: Template,
  args: {
    id: "username",
    label: "Username",
    placeholder: "Enter your username",
    type: "text",
    error: "",
  },
};

export const WithError: Story = {
  render: Template,
  args: {
    id: "email",
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
    error: "This field is required",
  },
};

export const PasswordField: Story = {
  render: Template,
  args: {
    id: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    error: "",
  },
};
