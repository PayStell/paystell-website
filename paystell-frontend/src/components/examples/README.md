# Transaction Flow Examples

This directory contains comprehensive examples demonstrating how to integrate and use the stepper components, transaction utilities, and state management for building wallet transaction flows.

## 🚀 Quick Start

```tsx
import { TransactionFlowExample } from '@/components/examples/TransactionFlowExample';

export default function MyPage() {
  return <TransactionFlowExample />;
}
```

## 📁 Files

### `TransactionFlowExample.tsx`

Complete implementation showing:

- Multi-step transaction flow with stepper navigation
- Integration of all transaction components (AmountInput, AddressInput, TransactionSummary)
- Form validation using React Hook Form and Zod
- Error handling with user-friendly recovery suggestions
- Mobile-responsive design
- State management for transaction data

### `TransactionFlowExample.stories.tsx`

Storybook stories for the example component with different viewport sizes and scenarios.

### `README.md`

This documentation file explaining integration patterns and usage.

## 🏗️ Architecture

The example demonstrates the following integration patterns:

### 1. Stepper Integration

```tsx
const steps: StepConfig[] = [
  {
    id: 'amount',
    title: 'Amount',
    component: AmountStep,
    validate: async () => validateAmount(),
  },
  // ... more steps
];

<StepperProvider steps={steps}>
  <Stepper />
  <StepContent />
  <StepNavigation />
</StepperProvider>;
```

### 2. Form Management

```tsx
const form = useForm<TransactionFormData>({
  resolver: zodResolver(transactionSchema),
});

// Integration with stepper validation
const validateStep = async () => {
  return await form.trigger(); // Validates current step fields
};
```

### 3. Transaction Components

```tsx
// Amount input with real-time validation
<AmountInput
  value={amount}
  onChange={setAmount}
  xlmPrice={0.12}
  xlmBalance={balance}
  onValidationChange={handleValidation}
/>

// Address input with book integration
<AddressInput
  value={address}
  onChange={setAddress}
  showAddressBook={true}
  onValidationChange={handleValidation}
/>

// Transaction summary with confirmation
<TransactionSummary
  transaction={transactionData}
  variant="confirmation"
  showConfirmation={true}
  onConfirm={handleConfirm}
/>
```

### 4. Error Handling

```tsx
try {
  await processTransaction();
} catch (error) {
  const transactionError = handleTransactionError(error);
  // Error is automatically displayed via toast
  // Recovery actions are provided based on error type
}
```

### 5. State Management

```tsx
const { startTransaction, updateTransactionState, completeTransaction, failTransaction } =
  useTransactionStore();

// Start new transaction
const txId = startTransaction('payment', stepData);

// Update progress
updateTransactionState(txId, 'SIGNING');

// Handle completion
completeTransaction(txId, { hash: 'abc123' });
```

## 🎨 Customization

### Custom Step Components

Create your own step components by implementing the step interface:

```tsx
const CustomStep: React.FC = () => {
  const { updateStepData, validateCurrentStep } = useStepper();

  // Your step logic here

  return <StepContent>{/* Your step UI */}</StepContent>;
};
```

### Custom Validation

Add custom validation logic to steps:

```tsx
const stepConfig: StepConfig = {
  id: 'custom-step',
  title: 'Custom Step',
  component: CustomStep,
  validate: async (formData, formMethods) => {
    // Custom validation logic
    const isValid = await validateCustomData(formData);
    return isValid;
  },
};
```

### Custom Error Handling

Handle specific error scenarios:

```tsx
const handleCustomError = (error: unknown) => {
  if (error instanceof CustomTransactionError) {
    // Handle specific error type
    return createTransactionError('CUSTOM_ERROR_CODE', context);
  }

  // Fallback to default handling
  return handleTransactionError(error);
};
```

## 📱 Mobile Responsiveness

The example includes several responsive design patterns:

### 1. Adaptive Layouts

- Desktop: Full stepper with all steps visible
- Mobile: Simplified progress indicator with current step info

### 2. Touch-Friendly Interactions

- Larger touch targets on mobile
- Optimized input components for mobile keyboards
- Gesture-friendly navigation

### 3. Progressive Enhancement

```tsx
// Example: Conditional features based on screen size
const isMobile = useMediaQuery('(max-width: 768px)');

<AddressInput
  showAddressBook={!isMobile} // Hide on mobile for space
  showQrScanner={true} // Keep scanner for mobile convenience
/>;
```

## 🧪 Testing Integration

### Unit Tests

Test individual step components:

```tsx
import { render, fireEvent } from '@testing-library/react';
import { StepperProvider } from '@/hooks/useStepper';

test('amount step validation', async () => {
  const { getByRole } = render(
    <StepperProvider steps={[amountStepConfig]}>
      <AmountStep />
    </StepperProvider>,
  );

  // Test validation logic
});
```

### Integration Tests

Test complete flow:

```tsx
test('complete transaction flow', async () => {
  const { getByText, getByRole } = render(<TransactionFlowExample />);

  // Test step navigation
  fireEvent.click(getByText('Start Normal Flow'));

  // Test form completion
  // ... rest of test
});
```

## 🔧 Performance Considerations

### 1. Lazy Loading

```tsx
// Lazy load step components for better performance
const LazyAmountStep = lazy(() => import('./steps/AmountStep'));
```

### 2. Memoization

```tsx
// Memoize expensive calculations
const transactionFee = useMemo(
  () => calculateFee(operationCount, operationTypes),
  [operationCount, operationTypes],
);
```

### 3. Debounced Validation

```tsx
// Debounce validation for better UX
const debouncedValidation = useMemo(() => debounce(validateAmount, 300), []);
```

## 🚀 Deployment Notes

### Environment Variables

```env
# Required for network operations
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

# Optional for enhanced features
NEXT_PUBLIC_STELLAR_EXPERT_URL=https://stellar.expert
```

### Bundle Optimization

The example is designed to be tree-shakeable. Import only what you need:

```tsx
// Good: Tree-shakeable imports
import { AmountInput } from '@/components/transaction/AmountInput';
import { validateFee } from '@/lib/transaction/fees';

// Avoid: Barrel imports that include everything
import * from '@/components/transaction';
```

## 📚 Additional Resources

- [Stepper Component Documentation](../stepper/README.md)
- [Transaction Components Documentation](../transaction/README.md)
- [Error Handling Guide](../../lib/transaction/errors.ts)
- [State Management Guide](../../lib/transaction/store.ts)
- [Storybook Examples](http://localhost:6006/?path=/docs/examples-transactionflowexample--docs)

## 🤝 Contributing

When adding new examples or improving existing ones:

1. Follow the established patterns shown in this example
2. Include comprehensive error handling
3. Ensure mobile responsiveness
4. Add Storybook stories for different scenarios
5. Include unit tests for critical paths
6. Document integration patterns in this README

## 🐛 Common Issues

### Stepper Context Missing

```tsx
// ❌ Wrong: Using stepper hooks outside provider
const { nextStep } = useStepper(); // Error!

// ✅ Correct: Wrap with provider
<StepperProvider steps={steps}>
  <MyComponent /> {/* Can use useStepper here */}
</StepperProvider>;
```

### Form Validation Not Working

```tsx
// ❌ Wrong: Missing form validation integration
const validateStep = () => true; // Always passes

// ✅ Correct: Integrate with form validation
const validateStep = async () => {
  const isFormValid = await form.trigger();
  const isBusinessLogicValid = await validateBusinessRules();
  return isFormValid && isBusinessLogicValid;
};
```

### Mobile Layout Issues

```tsx
// ❌ Wrong: Fixed desktop layout
<div className="grid grid-cols-3 gap-6">

// ✅ Correct: Responsive layout
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
```

For more help, check the [troubleshooting guide](../../docs/troubleshooting.md) or open an issue.
