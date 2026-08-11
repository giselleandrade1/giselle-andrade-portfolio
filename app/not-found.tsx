import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <main className="notFound">
      <div>
        <code>404 / route_not_found</code>
        <h1>This page stepped outside the stack.</h1>
        <p>The address may have changed, but the portfolio is still right where it should be.</p>
        <ButtonLink href="/">
          Return home
          <Icon name="arrowUpRight" size="sm" />
        </ButtonLink>
      </div>
    </main>
  );
}
