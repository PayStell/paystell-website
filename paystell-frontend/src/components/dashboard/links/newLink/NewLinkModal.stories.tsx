import { Meta, StoryFn } from "@storybook/react";
import { useState } from "react";
import { NewLinkModal } from "./NewLinkModal";

export default {
  title: "Dashboard/Links/NewLinkModal",
  component: NewLinkModal,
} as Meta<typeof NewLinkModal>;

const Template: StoryFn<typeof NewLinkModal> = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  return (
    <>
      <button onClick={handleOpen}>Open Modal</button>
      <NewLinkModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
