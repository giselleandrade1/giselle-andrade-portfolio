import { headers } from "next/headers";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { defaultLocale, getMessages, isLocale } from "@/i18n";

export default async function NotFound() {
  const localeHeader = (await headers()).get("x-portfolio-locale");
  const locale = isLocale(localeHeader) ? localeHeader : defaultLocale;
  const messages = await getMessages(locale);

  return (
    <main className="notFound">
      <div>
        <code>{messages.notFound.code}</code>
        <h1>{messages.notFound.title}</h1>
        <p>{messages.notFound.description}</p>
        <ButtonLink href={`/${locale}`}>
          {messages.notFound.returnHome}
          <Icon name="arrowUpRight" size="sm" />
        </ButtonLink>
      </div>
    </main>
  );
}
