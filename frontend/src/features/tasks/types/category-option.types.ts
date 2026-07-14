/**
 * Minimal read-only projection of a Category, used only to populate
 * selects and badges within the Tasks feature. Full category management
 * belongs to the `categories` feature.
 */
export interface CategoryOption {
  id: string;
  name: string;
  color?: string;
}
