import {
  useParams
} from 'react-router';
import { useTranslation } from '~/lib/translations';

export const meta = ({ params }: { params: { locale?: string, handle?: string } }) => {
  // Use a default title or try to fetch from translation if possible, checking handle existence
  // Note: meta runs outside component, so we can't use hook. We need to access TRANSLATIONS via loader data or direct import if we wanted.
  // But wait, the previous code accessed TRANSLATIONS in meta in about-us.tsx. 
  // Let's import TRANSLATIONS to be safe for meta.
  // Actually, for simplicity and to avoid importing the huge object here if not needed, we can just set a generic title or keep it simple.
  // However, dynamic title is good.
  return [{ title: 'Policy | Teta Aida' }];
};

export default function Policy() {
  const { handle } = useParams();
  const { t } = useTranslation();

  // Map the URL handle to the translation key
  // handles: 'shipping-policy', 'refund-policy', 'privacy-policy', 'terms-of-service'
  // keys in translations.ts: same as handles

  const policyKey = `policies.${handle}` as const;

  // We need to fetch the title and content.
  // t(policyKey) would return the object {title, content} if we cast it, 
  // OR we can fetch t(`${policyKey}.title`) and t(`${policyKey}.content`).

  // Fallback for invalid handle (though usually caught by 404, we can handle gracefully or show 404 here)
  if (!handle) return null;

  const title = t(`${policyKey}.title`);
  const content = t(`${policyKey}.content`);

  // Simple check if translation exists (if it returns the key, it's missing)
  const isMissing = title === `${policyKey}.title`;

  if (isMissing) {
    return (
      <div className="policy-page py-16 sm:py-24 text-center">
        <h1 className="text-2xl font-bold">Policy Not Found</h1>
      </div>
    );
  }

  return (
    <div className="policy-page py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-12 text-center text-4xl font-bold text-gray-900">{title}</h1>
        <div
          className="prose prose-lg mx-auto text-gray-700 prose-headings:text-green-900 prose-a:text-green-800"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}


