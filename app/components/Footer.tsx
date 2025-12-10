import { Suspense } from 'react';
import { Await, NavLink } from 'react-router';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

import { useTranslation } from '~/lib/translations';
import { LanguageSelector } from '~/components/LanguageSelector';

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  const { t, locale, isRtl } = useTranslation();
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-primary text-white py-16 md:py-24">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Column 1: Brand Story */}
              <div className="space-y-6">
                <h3 className="text-secondary font-serif text-3xl tracking-wider uppercase">{isRtl ? 'تيتا عايدة' : 'Teta Aida'}</h3>
                <p className="text-sm leading-relaxed opacity-90 max-w-xs">
                  {t('footer.description')}
                </p>
              </div>

              {/* Column 2: Shop */}
              <div>
                <h4 className="font-serif text-lg text-secondary mb-6 tracking-wide uppercase">{t('nav.shop')}</h4>
                <ul className="flex flex-col gap-3 text-sm">
                  <li>
                    <NavLink to={`${locale.pathPrefix}/collections/bundles`} className="text-white hover:text-secondary transition-colors">
                      {t('nav.bundles')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`${locale.pathPrefix}/collections/all`} className="text-white hover:text-secondary transition-colors">
                      {t('nav.allProducts')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`${locale.pathPrefix}/products/tuffaahy-olives-signature-mix`} className="text-white hover:text-secondary transition-colors">
                      {t('products.tuffahyOlives')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`${locale.pathPrefix}/products/low-salt-cucumbers-with-celery`} className="text-white hover:text-secondary transition-colors">
                      {t('products.lowSaltCucumbers')}
                    </NavLink>
                  </li>
                </ul>
              </div>

              {/* Column 3: Support & Policies */}
              <div>
                <h4 className="font-serif text-lg text-secondary mb-6 tracking-wide uppercase">{t('footer.support')}</h4>
                <FooterMenu
                  menu={footer?.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                  pathPrefix={locale.pathPrefix}
                />
              </div>

              {/* Column 4: Socials & Newsletter */}
              <div>
                <h4 className="font-serif text-lg text-secondary mb-6 tracking-wide uppercase">{t('footer.followUs')}</h4>
                <div className="flex gap-4 mb-8">
                  <a href="https://www.instagram.com/teta_3ayda/" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                    <IconInstagram />
                  </a>
                  <a href="https://web.facebook.com/Teta3ayda" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                    <IconFacebook />
                  </a>
                  <a href="https://www.tiktok.com/@teta_3ayda" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                    <IconTikTok />
                  </a>
                  <a href="https://chat.whatsapp.com/EcY7IrfERJY9GxjUi278qv?mode=hqrt2" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                    <IconWhatsApp />
                  </a>
                </div>
                {/* <div className="space-y-4">
                  <p className="text-xs uppercase tracking-widest opacity-70">Join our community</p>
                  <div className="flex border-b border-white/20 pb-2">
                    <input
                      type="email"
                      placeholder={t('footer.emailPlaceholder')}
                      className="bg-transparent border-none outline-none text-sm w-full placeholder:text-white/40"
                    />
                    <button className="text-secondary text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                      {t('footer.join')}
                    </button>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
              <p>&copy; {new Date().getFullYear()} {isRtl ? 'تيتا عايدة' : 'Teta Aida'}. {t('footer.rights')}</p>
              <LanguageSelector variant="light" />
              <p>{t('footer.crafted')}</p>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

// Helper function to translate footer menu item titles
function getFooterMenuItemTranslation(title: string, t: (key: string) => string): string {
  const titleMap: Record<string, string> = {
    'Privacy Policy': t('pages.privacy'),
    'Refund Policy': t('pages.refundPolicy'),
    'Shipping Policy': t('pages.shippingPolicy'),
    'Return & Exchange Policy': t('pages.returnExchangePolicy'),
    'About Us': t('pages.aboutUs'),
    'Contact': t('pages.contact'),
    'Contact Us': t('pages.contact'),
    'FAQ': t('pages.faq'),
    'Shipping & Delivery': t('pages.shipping'),
    'Returns & Exchanges': t('pages.returns'),
    'Terms of Service': t('pages.terms'),
    'Whatsapp': t('pages.whatsapp'),
  };

  return titleMap[title] || title;
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
  pathPrefix,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
  pathPrefix: string;
}) {
  const { t } = useTranslation();

  return (
    <nav className="flex flex-col gap-3 text-sm" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // Filter out social links from this menu as they are handled separately
        if (item.title.toLowerCase().includes('instagram') || item.title.toLowerCase().includes('facebook')) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isInternal = url.startsWith('/');
        const finalUrl = isInternal ? `${pathPrefix}${url === '/' ? '' : url}` : url;

        return (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            className="text-white hover:text-secondary transition-colors"
            to={finalUrl}
          >
            {getFooterMenuItemTranslation(item.title, t)}
          </NavLink>
        );
      })}
    </nav>
  );
}

function IconInstagram() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/1',
      resourceId: null,
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/2',
      resourceId: null,
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/3',
      resourceId: null,
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/4',
      resourceId: null,
      tags: [],
      title: 'Return & Exchange Policy',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/5',
      resourceId: null,
      tags: [],
      title: 'Instagram',
      type: 'HTTP',
      url: 'https://instagram.com/tetaaidapickles',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/6',
      resourceId: null,
      tags: [],
      title: 'Facebook',
      type: 'HTTP',
      url: 'https://facebook.com/tetaaidapickles',
      items: [],
    },
  ],
};
