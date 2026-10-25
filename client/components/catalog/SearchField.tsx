import { Button } from "../ui/Button";

export interface SearchFieldProps {
  value: string;
  label: string;
  placeholder: string;
  clearLabel: string;
  onChange: (value: string) => void;
}

export function SearchField({
  value,
  label,
  placeholder,
  clearLabel,
  onChange,
}: SearchFieldProps) {
  return (
    <div className="catalog-search">
      <label className="visually-hidden" htmlFor="catalog-search-input">
        {label}
      </label>
      <span className="search-icon" aria-hidden="true" />
      <input
        id="catalog-search-input"
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
      {value && (
        <Button
          variant="quiet"
          className="search-clear"
          label={clearLabel}
          aria-label={clearLabel}
          onClick={() => onChange("")}
        />
      )}
    </div>
  );
}