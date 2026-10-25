import type { ElementType } from "react";
import { getMessage, type Language, type MessageKey, type MessageValues } from "../../lib/language";

export interface TextProps {
  messageKey: MessageKey;
  as?: ElementType;
  values?: MessageValues;
  language?: Language;
  className?: string;
  id?: string;
}

export function Text({
  messageKey,
  as: Tag = "span",
  values,
  language = "en",
  className,
  id,
}: TextProps) {
  return (
    <Tag className={className} id={id}>
      {getMessage(messageKey, values, language)}
    </Tag>
  );
}