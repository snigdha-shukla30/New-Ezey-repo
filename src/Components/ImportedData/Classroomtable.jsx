import DataTable from "./Datatable";

const ClassroomTable = ({ data }) => {
  return (
    <DataTable
      columns={["Classroom Number", "Classroom Type"]}
      data={data}
      renderRow={(item, index) => (
        <tr
          key={index}
          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <td className="py-4 px-4 text-sm text-gray-600">{item.number}</td>
          <td className="py-4 px-4 text-sm text-gray-600">{item.type}</td>
        </tr>
      )}
    />
  );
};

export default ClassroomTable;
