import { Header } from '@/components/PaymentLinkScreen/header';
import { ProductInfo } from '@/components/PaymentLinkScreen/ProductInfo';
import { PaymentSummary } from '@/components/PaymentLinkScreen/PaymentSummary';
import { PaymentButton } from '@/components/PaymentLinkScreen/PaymentButton';
import { Footer } from '@/components/PaymentLinkScreen/footer';

export default function PaymentLinkScreen() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white p-4 sm:p-5">
      <Header />
      <div className="w-full max-w-[750px] mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8 space-y-6">
        <ProductInfo productName="Trouser" sku="17639041" />
        <PaymentSummary subtotal="0.8 XML" gasFee="0.2 XML" total="1 XML" />
        <PaymentButton />
      </div>
      <Footer />
    </main>
  );
}
