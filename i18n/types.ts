import type { enUS } from "./messages/en-US";

type DeepWiden<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends null
        ? null
        : T extends readonly unknown[]
          ? { readonly [Key in keyof T]: DeepWiden<T[Key]> }
          : T extends object
            ? { readonly [Key in keyof T]: DeepWiden<T[Key]> }
            : T;

export type Messages = DeepWiden<typeof enUS>;

export type MessageValues = Readonly<Record<string, string | number>>;

export function formatMessage(template: string, values: MessageValues): string {
  return template.replace(/\{([^}]+)\}/g, (match, key: string) => {
    const value = values[key];
    return value === undefined ? match : String(value);
  });
}
