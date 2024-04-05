function Table({ children, className }) {
  return (
    <div className="employeeTableSection">
      <div className="table-responsive">
        <table className={className}>{children}</table>
      </div>
    </div>
  );
}

export default Table;
