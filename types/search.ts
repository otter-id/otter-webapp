import { MenuItem } from "@/types/restaurant";

export interface SearchResult extends MenuItem {
  matchedOn: "name" | "description" | "both";
}

export type GroupedResults = {
  [category: string]: SearchResult[];
};
