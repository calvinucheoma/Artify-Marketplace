import '@/styles/Success.scss';
import Link from 'next/link';

const SuccessPage = () => {
  return (
    <div className="success">
      <h1>Payment Successful</h1>
      <p>Thank you for your purchase!</p>
      <Link href="/">Continue Shopping!</Link>
    </div>
  );
};

export default SuccessPage;
