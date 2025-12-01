import { Suspense } from 'react';
import { Await, NavLink } from 'react-router';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-primary text-white py-16 md:py-24">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Column 1: Brand Story */}
              <div className="space-y-6">
                <h3 className="text-secondary font-serif text-3xl tracking-wider uppercase">Teta Aida</h3>
                <p className="text-sm leading-relaxed opacity-90 max-w-xs">
                  Premium small-batch artisanal pickles crafted with clean, carefully selected ingredients. A taste of heritage, elevated for today.
                </p>
              </div>

              {/* Column 2: Shop */}
              <div>
                <h4 className="font-serif text-lg text-secondary mb-6 tracking-wide uppercase">Shop</h4>
                <ul className="flex flex-col gap-3 text-sm">
                  <li>
                    <NavLink to="/collections/bundles" className="text-white hover:text-secondary transition-colors">
                      Bundles
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/collections/all" className="text-white hover:text-secondary transition-colors">
                      All Products
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/products/tuffaahy-olives-signature-mix" className="text-white hover:text-secondary transition-colors">
                      Tuffaahy Olives
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/products/low-salt-cucumbers-with-celery" className="text-white hover:text-secondary transition-colors">
                      Low-Salt Cucumbers
                    </NavLink>
                  </li>
                </ul>
              </div>

              {/* Column 3: Support & Policies */}
              <div>
                <h4 className="font-serif text-lg text-secondary mb-6 tracking-wide uppercase">Support</h4>
                <FooterMenu
                  menu={footer?.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
                <div className="mt-6 space-y-2 text-sm opacity-80">
                  <p>
                    <a href="tel:+201070985360" className="text-white hover:text-secondary transition-colors">+20 107 098 5360</a>
                  </p>
                  <p>
                    <a href="mailto:tetaaidapickles@gmail.com" className="text-white hover:text-secondary transition-colors">tetaaidapickles@gmail.com</a>
                  </p>
                </div>
              </div>

              {/* Column 4: Socials & Newsletter */}
              <div>
                <h4 className="font-serif text-lg text-secondary mb-6 tracking-wide uppercase">Follow Us</h4>
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
                </div>
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-widest opacity-70">Join our community</p>
                  <div className="flex border-b border-white/20 pb-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-transparent border-none outline-none text-sm w-full placeholder:text-white/40"
                    />
                    <button className="text-secondary text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
              <p>&copy; {new Date().getFullYear()} Teta Aida. All rights reserved.</p>
              <p>Crafted in Cairo.</p>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="flex flex-col gap-3 text-sm" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // Filter out social links from this menu as they are handled separately
        if (item.title.toLowerCase().includes('instagram') || item.title.toLowerCase().includes('facebook')) return null;

        const url =
          item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank" className="text-white hover:text-secondary transition-colors">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            className="text-white hover:text-secondary transition-colors"
            to={url}
          >
            {item.title}
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
