import { Check } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, LOCALE_META } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/** Flag-only language picker (🇧🇷 🇺🇸 🇪🇸). Names stay available to screen readers and on hover. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const t = useT();
  const current = LOCALE_META[locale];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={`${t.common.chooseLanguage}: ${current.name}`}
        title={current.name}
        className={cn(
          "glass grid size-9 shrink-0 place-items-center rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:border-lavender/40 data-[state=open]:border-lavender/60 sm:size-10",
          className,
        )}
      >
        <span aria-hidden className="font-flag text-xl leading-none">
          {current.flag}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        aria-label={t.common.language}
        className="min-w-0 rounded-2xl border-border bg-surface-2/95 p-1.5 backdrop-blur-xl"
      >
        {LOCALES.map((code) => {
          const meta = LOCALE_META[code];
          const active = code === locale;
          return (
            <DropdownMenuItem
              key={code}
              lang={code}
              title={meta.name}
              aria-label={meta.name}
              aria-current={active ? "true" : undefined}
              onSelect={() => setLocale(code)}
              className={cn(
                "relative flex cursor-pointer items-center justify-center rounded-xl px-3 py-2 focus:bg-surface",
                active && "bg-imperial/30",
              )}
            >
              <span aria-hidden className="font-flag text-2xl leading-none">
                {meta.flag}
              </span>
              {active ? (
                <Check aria-hidden className="absolute right-1 top-1 size-3 text-lavender" />
              ) : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
