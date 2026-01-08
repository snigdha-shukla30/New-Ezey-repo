import DataTable from "./Datatable";

const BatchesTable = ({ data }) => {
  return (
    <DataTable
      columns={[
        "Degree/Course",
        "Degree Type",
        "Department",
        "Semester",
        "Section",
        "Assigned Subjects",
      ]}
      data={data}
      renderRow={(item, index) => (
        <tr
          key={index}
          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <td className="py-4 px-4 text-sm">{item.course}</td>
          <td className="py-4 px-4 text-sm">{item.degreeType}</td>
          <td className="py-4 px-4 text-sm">{item.department}</td>
          <td className="py-4 px-4 text-sm">{item.semester}</td>
          <td className="py-4 px-4 text-sm">{item.section}</td>
          <td className="py-4 px-4 text-sm text-cyan-600 cursor-pointer">
            {item.subjects}
          </td>
        </tr>
      )}
    />
  );
};

export default BatchesTable;
