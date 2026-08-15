export const goalCategories = ["Personal", "Career", "Health", "Financial", "Education"] as const;

const legacyCategories: Record<string, string> = {
  Pessoal: "Personal",
  Carreira: "Career",
  Saúde: "Health",
  Financeiro: "Financial",
  Estudos: "Education",
};

export function categoryLabel(category: string) {
  return legacyCategories[category] ?? category;
}
