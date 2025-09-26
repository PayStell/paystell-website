import { Meta, StoryFn } from '@storybook/react';
import NewLinks from './NewLinkForm';

export default {
  title: 'Dashboard/Links/NewLinkForm',
  component: NewLinks,
} as Meta<typeof NewLinks>;

const Template: StoryFn<typeof NewLinks> = () => <NewLinks />;

export const Default = Template.bind({});
