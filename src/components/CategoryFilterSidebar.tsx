interface CategoryFilterSidebarProps {
  categories: (string | { name: string })[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterSidebarProps) {
  return (
    <aside className="sticky top-20 p-4 border rounded w-92 bg-white shadow-md">
      <h3 className="font-bold mb-4">Categories</h3>
      <ul>
        <li
          key="all-categories"
          className={`cursor-pointer mb-2 ${selectedCategory === '' ? 'font-bold' : ''}`}
          onClick={() => onSelectCategory('')}
        >
          All Categories
        </li>
        {categories.map((cat) => {
          const categoryName = typeof cat === 'string' ? cat : cat.name;
          return (
            <li
              key={categoryName}
              className={`cursor-pointer mb-2 ${selectedCategory === categoryName ? 'font-bold' : ''}`}
              onClick={() => onSelectCategory(categoryName)}
            >
              {categoryName}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}