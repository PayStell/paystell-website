import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import ProfileImageUpload from './ProfileImageUpload';

export default {
  title: 'Components/ProfileImageUpload',
  component: ProfileImageUpload,
} as Meta;

const Template: StoryFn = (args) => {
  const [preview, setPreview] = useState<string | undefined>(args.previewImage);

  const handleImageUpload = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(undefined);
    }
  };

  return <ProfileImageUpload {...args} previewImage={preview} onImageUpload={handleImageUpload} />;
};

export const Default = Template.bind({});
Default.args = {
  previewImage: undefined,
};
