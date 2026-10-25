export interface FilterCategory {
  id: string;
  label: string;
}

export interface FilterPanelProps {
  categories: FilterCategory[];
  selectedCategory: string;
  inStockOnly: boolean;
  categoryHeading: string;
  ariaLabel: string;
  availabilityHeading: string;
  allItemsLabel: string;
  inStockLabel: string;
  onCategoryChange: (category: string) => void;
  onInStockChange: (inStockOnly: boolean) => void;
}

export function FilterPanel({
  categories,
  selectedCategory,
  inStockOnly,
  categoryHeading,
  ariaLabel,
  availabilityHeading,
  allItemsLabel,
  inStockLabel,
  onCategoryChange,
  onInStockChange,
}: FilterPanelProps) {
  return (
    <aside className="catalog-filters" aria-label={ariaLabel}>
      <fieldset className="filter-group">
        <legend>{categoryHeading}</legend>
        <div className="filter-options">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`filter-option${selectedCategory === category.id ? " is-selected" : ""}`}
              type="button"
              aria-pressed={selectedCategory === category.id}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend>{availabilityHeading}</legend>
        <label className="filter-checkbox">
          <input
            type="radio"
            name="availability"
            checked={!inStockOnly}
            onChange={(event) => onInStockChange(!event.currentTarget.checked)}
          />
          <span>{allItemsLabel}</span>
        </label>
        <label className="filter-checkbox">
          <input
            type="radio"
            name="availability"
            checked={inStockOnly}
            onChange={(event) => onInStockChange(event.currentTarget.checked)}
          />
          <span>{inStockLabel}</span>
        </label>
      </fieldset>
    </aside>
  );
}