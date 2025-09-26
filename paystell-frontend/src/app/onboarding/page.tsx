import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <OnboardingFlow />
    </main>
  );
}
