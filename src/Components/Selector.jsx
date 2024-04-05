function SelectCategory({
  selectedOption,
  handleOptionChange,
  categoryName,
  categorysName,
  label,
  className,
  labelClass,
}) {
  return (
    <div>
      <label className={labelClass} htmlFor="type">
        {label}
      </label>
      <select
        id="categorySelect"
        name="category"
        value={selectedOption}
        onChange={handleOptionChange}
        className={className}
      >
        <option value="">{categoryName}</option>
        {categorysName.map((category) => (
          <option key={category.category} value={category.id}>
            {category.categoryName}
            {category.subCategoryName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectCategory;
