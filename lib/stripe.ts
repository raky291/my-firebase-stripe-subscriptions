import { getStripePayments } from '@invertase/firestore-stripe-payments';
import { app } from '@/lib/firebase';

const payments = getStripePayments(app, {
  productsCollection: 'products',
  customersCollection: 'customers',
});

export { payments };
