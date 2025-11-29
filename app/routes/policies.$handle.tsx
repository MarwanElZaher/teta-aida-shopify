import {
  useLoaderData,
  type MetaFunction,
  type LoaderFunctionArgs
} from 'react-router';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.policy.title} | Teta Aida` }];
};

const POLICIES_CONTENT: Record<string, { title: string; content: string }> = {
  'shipping-policy': {
    title: 'Shipping & Delivery Policy',
    content: `
      <h2>Shipping Areas</h2>
      <p>We currently deliver across Greater Cairo. Additional areas will be introduced soon.</p>
      
      <h2>Delivery Time</h2>
      <p>Delivery times vary based on courier routing and zone schedules:</p>
      <ul>
        <li><strong>1–2 working days:</strong> New Cairo, Nasr City, Heliopolis, Sheraton</li>
        <li><strong>Up to 7–10 working days:</strong> Other serviced Cairo districts (depending on courier route availability)</li>
      </ul>

      <h2>Delivery Fees</h2>
      <p>Delivery fees are calculated based on your location as per the table below.</p>
      <p><em>(Shipping rates table coming soon)</em></p>

      <h2>Packaging & Handling</h2>
      <p>All jars are securely sealed and packaged to ensure safe arrival. If your order arrives damaged, please contact us immediately.</p>

      <h2>Delivery Attempts</h2>
      <p>The courier will make two delivery attempts. If unsuccessful, the order may be cancelled and delivery fees applied.</p>

      <h2>Order Confirmation</h2>
      <p>You will receive updates via SMS, WhatsApp, or email.</p>
    `
  },
  'refund-policy': {
    title: 'Refund Policy',
    content: `
      <h2>Refund Eligibility</h2>
      <p>Refunds are issued ONLY in the following cases:</p>
      <ul>
        <li>Order arrived damaged</li>
        <li>Wrong item was delivered</li>
        <li>Product quality issue confirmed by our team</li>
        <li>Delivery failed due to our error</li>
      </ul>
      <p>Refunds are processed within 3–7 working days depending on your payment method.</p>

      <h2>Non-Refundable Items</h2>
      <p>Refunds are not issued for:</p>
      <ul>
        <li>Opened jars</li>
        <li>Incorrect heat-level selection</li>
        <li>Change of mind</li>
        <li>Incorrect address provided by customer</li>
        <li>Failed delivery after 2 attempts</li>
      </ul>
    `
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    content: `
      <p>At Teta Aida, your privacy is important to us. We collect only the information needed to prepare and deliver your order.</p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Name</li>
        <li>Phone number</li>
        <li>Delivery address</li>
        <li>Order details</li>
        <li>Optional email address</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process and deliver your order</li>
        <li>To communicate about delivery updates</li>
        <li>To improve our service</li>
      </ul>

      <h2>We Do NOT:</h2>
      <ul>
        <li>Sell your data</li>
        <li>Share it with third parties unrelated to your delivery</li>
        <li>Store payment details on our servers (payments are processed securely by your bank or payment gateway)</li>
      </ul>

      <h2>Cookies</h2>
      <p>We use cookies to improve website performance and provide a better experience.</p>

      <h2>Your Rights</h2>
      <p>You may request to update or delete your information at any time via WhatsApp.</p>
    `
  },
  'terms-of-service': {
    title: 'Return & Exchange Policy',
    content: `
      <p>Because our products are fresh, edible items, we follow strict safety and hygiene guidelines.</p>

      <h2>We Accept Returns ONLY If:</h2>
      <ul>
        <li>The product arrived damaged</li>
        <li>The jar was broken or leaked</li>
        <li>You received the wrong item</li>
      </ul>
      <p>In these cases, we will replace the jar or refund the full amount.</p>

      <h2>We Do NOT Accept Returns If:</h2>
      <ul>
        <li>The jar was opened</li>
        <li>The product was partially consumed</li>
        <li>You changed your mind</li>
        <li>Heat level selection was chosen incorrectly</li>
        <li>You decided to switch flavors after delivery</li>
      </ul>
      <p>This is for product safety, quality, and customer protection.</p>

      <h2>Time Limit</h2>
      <p>Return requests must be submitted within 24 hours of receiving your order.</p>

      <h2>How to Request a Return</h2>
      <p>Send us on WhatsApp:</p>
      <ul>
        <li>Photo of the jar</li>
        <li>Order number</li>
        <li>Short explanation</li>
      </ul>
      <p>We respond within 1 working day.</p>
    `
  }
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { handle } = params;

  if (!handle || !POLICIES_CONTENT[handle]) {
    throw new Response('Not Found', { status: 404 });
  }

  return {
    policy: POLICIES_CONTENT[handle]
  };
}

export default function Policy() {
  const { policy } = useLoaderData<typeof loader>();

  return (
    <div className="policy-page py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-12 text-center text-4xl font-bold text-gray-900">{policy.title}</h1>
        <div
          className="prose prose-lg mx-auto text-gray-700 prose-headings:text-green-900 prose-a:text-green-800"
          dangerouslySetInnerHTML={{ __html: policy.content }}
        />
      </div>
    </div>
  );
}

