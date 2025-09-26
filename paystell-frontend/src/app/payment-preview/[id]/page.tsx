import PaymentPreviewClient from '../payment-preview-client';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `Payment Preview - ${params.id}`,
    description: 'Complete your Stellar payment securely',
  };
}

export default function PaymentPreviewPage({ params }: PageProps) {
  return <PaymentPreviewClient params={params} />;
}
