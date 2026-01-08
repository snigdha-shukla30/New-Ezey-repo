const DataTable = ({ columns, data, renderRow }) => {
  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-cyan-500">
            {columns.map((col) => (
              <th
                key={col}
                className="text-left py-4 px-4 text-sm font-semibold text-gray-700"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>{data.map(renderRow)}</tbody>
      </table>
    </div>
  );
};

export default DataTable;
