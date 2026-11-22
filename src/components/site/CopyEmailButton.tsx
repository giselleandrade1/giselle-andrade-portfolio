import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { copyEmail } from "./CommandMenu";

export function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="glass"
      size="sm"
      data-magnetic
      onClick={async () => {
        await copyEmail();
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? <Check aria-hidden className="text-success" /> : <Copy aria-hidden />}
      {copied ? "Copiado!" : "Copiar e-mail"}
    </Button>
  );
}
