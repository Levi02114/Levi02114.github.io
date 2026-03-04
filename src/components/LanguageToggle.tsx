'use client';

import { useRouter, usePathname } from 'next/navigation';
import { type Language, languages } from '@/lib/i18n';
import { replaceLanguageInPath } from '@/lib/paths';

interface LanguageToggleProps {
  currentLang: Language;
  className?: string;
  floating?: boolean;
}

export default function LanguageToggle({
  currentLang,
  className = '',
  floating = true,
}: LanguageToggleProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLang: Language) => {
    if (newLang === currentLang) return;

    router.push(replaceLanguageInPath(pathname, newLang));
  };

  return (
    <div
      className={`
        flex rounded-full border border-[color:var(--color-border)] bg-[rgba(255,248,238,0.92)] p-0.5 shadow-sm
        ${floating ? 'fixed top-4 right-4 z-50' : ''}
        ${className}
      `}
      role="group"
      aria-label="Language selection"
    >
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => switchLanguage(lang)}
          aria-pressed={currentLang === lang}
          aria-label={`Switch to ${lang === 'en' ? 'English' : 'Korean'}`}
          className={`
            px-3 py-1 rounded-full text-xs font-semibold tracking-[0.18em] transition-all duration-150 cursor-pointer
            focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-1
            ${
              currentLang === lang
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-amber-800'
            }
          `}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
