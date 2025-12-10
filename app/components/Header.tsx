import { Suspense, useEffect, useState } from 'react';
import { Await, NavLink, useAsyncValue, useLocation } from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { useTranslation } from '~/lib/translations';
import { LanguageSelector } from '~/components/LanguageSelector';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const { shop, menu } = header;
  const [isScrolled, setIsScrolled] = useState(false);
  const { isRtl } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const { locale } = useTranslation();
  const headerClass = `fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-[#F9F7F2]/95 backdrop-blur-sm shadow-sm py-3' : 'bg-transparent py-5'
    }`;

  return (
    <header className={headerClass}>
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between relative max-w-screen-2xl mx-auto">
          {/* Left: Mobile Menu Toggle / Desktop Menu */}
          <div className="flex items-center gap-8 flex-1">
            <HeaderMenuMobileToggle />
            <div className="hidden lg:block">
              <HeaderMenu
                menu={menu}
                viewport="desktop"
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            </div>
          </div>

          {/* Center: Logo - Absolutely positioned to stay centered */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <NavLink
              prefetch="intent"
              to={locale.pathPrefix ? `${locale.pathPrefix}/` : '/'}
              onClick={(e) => {
                // Prevent navigation if already on homepage
                const currentPath = window.location.pathname;
                const targetPath = locale.pathPrefix ? `${locale.pathPrefix}/` : '/';
                if (currentPath === targetPath || currentPath === targetPath.replace(/\/$/, '')) {
                  e.preventDefault();
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xl md:text-2xl lg:text-3xl font-serif font-bold tracking-widest text-primary uppercase whitespace-nowrap pointer-events-auto"
            >
              {isRtl ? 'تيتا عايدة' : shop.name}
            </NavLink>
          </div>

          {/* Right: Icons (Account, Search, Cart) */}
          <div className="flex items-center gap-3 md:gap-4 relative z-20 flex-1 justify-end">
            <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
          </div>
        </div>
      </div>
    </header>
  );
}

// Helper function to translate menu item titles
function getMenuItemTranslation(title: string, t: (key: string) => string): string {
  const titleMap: Record<string, string> = {
    'Shop All': t('nav.allProducts'),
    'Bundles': t('nav.bundles'),
    'About Us': t('nav.about'),
    'FAQ': t('pages.faq'),
    'Contact': t('nav.contact'),
    'Home': t('nav.home'),
    'Shop': t('nav.shop'),
    "Best Sellers": t('nav.bestsellers'),
  };

  return titleMap[title] || title;
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const { close } = useAside();

  const { locale, t } = useTranslation();

  if (viewport === 'mobile') {
    return (
      <nav className="flex flex-col gap-4 p-6" role="navigation">
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain) ||
              item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;

          const finalUrl = `${locale.pathPrefix}${url.startsWith('/') ? '' : '/'}${url}`;

          return (
            <NavLink
              className={({ isActive }) => `text-lg font-medium tracking-wide ${isActive ? 'text-primary' : 'text-dark'}`}
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              to={finalUrl}
            >
              {getMenuItemTranslation(item.title, t)}
            </NavLink>
          );
        })}

        {/* Mobile Language Selector */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-dark/50 mb-4 uppercase tracking-widest">{t('nav.selectLanguage') || 'Select Language'}</p>
          <LanguageSelector />
        </div>
      </nav>
    );
  }

  // Desktop Menu
  return (
    <nav className="flex gap-4 lg:gap-6" role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        const finalUrl = `${locale.pathPrefix}${url.startsWith('/') ? '' : '/'}${url}`;

        return (
          <NavLink
            className={({ isActive }) =>
              `text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors ${isActive ? 'text-primary border-b border-primary' : 'text-dark'}`
            }
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            to={finalUrl}
          >
            {getMenuItemTranslation(item.title, t)}
          </NavLink>
        );
      })}
    </nav>
  );
}





function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  const { t, locale } = useTranslation();
  return (
    <nav className="flex items-center gap-4" role="navigation">
      <div className="hidden md:block">
        <LanguageSelector />
      </div>
      <NavLink prefetch="intent" to={`${locale.pathPrefix}/account`} className="hidden md:block text-dark hover:text-primary transition-colors">
        <Suspense fallback={<IconUser />}>
          <Await resolve={isLoggedIn} errorElement={<IconUser />}>
            {(isLoggedIn) => (isLoggedIn ? t('nav.account') : <IconUser />)}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const { open } = useAside();
  return (
    <button
      className="md:hidden text-2xl text-dark focus:outline-none"
      onClick={() => open('mobile')}
    >
      ☰
    </button>
  );
}

function SearchToggle() {
  const { open } = useAside();
  return (
    <button className="text-dark hover:text-primary transition-colors" onClick={() => open('search')}>
      <IconSearch />
    </button>
  );
}

function CartBadge({ count }: { count: number | null }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  return (
    <a
      href="/cart"
      className="relative text-dark hover:text-primary transition-colors"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <IconBag />
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
          {count}
        </span>
      )}
    </a>
  );
}

function CartToggle({ cart }: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

/* Icons */
function IconUser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/1',
      resourceId: null,
      tags: [],
      title: 'Shop All',
      type: 'HTTP',
      url: '/collections/all',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/2',
      resourceId: null,
      tags: [],
      title: 'Bundles',
      type: 'HTTP',
      url: '/collections/bundles',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/3',
      resourceId: null,
      tags: [],
      title: 'About Us',
      type: 'HTTP',
      url: '/pages/about',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/4',
      resourceId: null,
      tags: [],
      title: 'FAQ',
      type: 'HTTP',
      url: '/pages/faq',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/5',
      resourceId: null,
      tags: [],
      title: 'Contact',
      type: 'HTTP',
      url: '/pages/contact',
      items: [],
    },
  ],
};
