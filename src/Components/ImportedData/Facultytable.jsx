import DataTable from "./Datatable";

const FacultyTable = ({ data }) => {
  return (
    <DataTable
      columns={["Faculty Name", "Status", "Assigned Subjects"]}
      data={data}
      renderRow={(item, index) => (
        <tr
          key={index}
          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <td className="py-4 px-4 text-sm">{item.name}</td>

          <td className="py-4 px-4 text-center text-sm">
            <span
              className={`${
                item.status === "On Duty"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {item.status}
            </span>
          </td>

          <td className="py-4 px-4 text-right text-sm text-cyan-600 cursor-pointer">
            {item.subjects}
          </td>
        </tr>
      )}
    />
  );
};

export default FacultyTable;
