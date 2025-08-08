interface CategoryFilterSidebarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterSidebarProps) {
  return (
    <aside className="sticky top-20 p-4 border rounded w-92 bg-white shadow-md ">
      <h3 className="font-bold mb-4">Categories</h3>
      <ul>
        <li
          key="all-categories"
          className={`cursor-pointer mb-2 ${selectedCategory === '' ? 'font-bold' : ''}`}
          onClick={() => onSelectCategory('')}
        >
          All Categories
        </li>
        {categories.map((cat) => (
  <li
    key={typeof cat === 'string' ? cat : cat.name}
    className={`cursor-pointer mb-2 ${selectedCategory === (typeof cat === 'string' ? cat : cat.name) ? 'font-bold' : ''}`}
    onClick={() => onSelectCategory(typeof cat === 'string' ? cat : cat.name)}
  >
    {typeof cat === 'string' ? cat : cat.name}
  </li>
))}
      </ul>
    </aside>
  );
}