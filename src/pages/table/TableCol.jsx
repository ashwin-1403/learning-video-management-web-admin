function TableCol({ children }) {
  return (
    <thead className="tableHead">
      <tr>{children}</tr>
    </thead>
  );
}

export default TableCol;
