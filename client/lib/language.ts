import english from "../lang/en.json";

export type Language = "en";
export type MessageKey = keyof typeof english;
export type MessageValues = Record<string, string | number>;

export const catalogCategoryMessageKeys = {
  all: "catalog.allProducts",
  lighting: "catalog.lighting",
  audio: "catalog.audio",
  cables: "catalog.cables",
  other: "catalog.other",
} as const satisfies Record<string, MessageKey>;

const dictionaries: Record<Language, Record<MessageKey, string>> = {
  en: english,
};

export function getMessage(
  key: MessageKey,
  values: MessageValues = {},
  language: Language = "en",
): string {
  return dictionaries[language][key].replace(/{{(\w+)}}/g, (_, name: string) =>
    String(values[name] ?? ""),
  );
}

export function getCatalogCategoryLabel(categoryId: string): string {
  const messageKey = catalogCategoryMessageKeys[categoryId as keyof typeof catalogCategoryMessageKeys];
  return messageKey ? getMessage(messageKey) : "";
}