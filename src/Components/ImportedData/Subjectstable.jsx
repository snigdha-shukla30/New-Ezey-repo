import DataTable from "./Datatable";

const SubjectsTable = ({ data }) => {
  return (
    <DataTable
      columns={[
        "Subject Name",
        "Code",
        "Degree",
        "Department",
        "Semester",
        "Type",
        "Periods",
        "Assigned Faculty",
      ]}
      data={data}
      renderRow={(item, index) => (
        <tr
          key={index}
          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <td className="py-4 px-4 text-sm">{item.name}</td>
          <td className="py-4 px-4 text-sm">{item.code}</td>
          <td className="py-4 px-4 text-sm">{item.degree}</td>
          <td className="py-4 px-4 text-sm">{item.department}</td>
          <td className="py-4 px-4 text-sm">{item.semester}</td>
          <td className="py-4 px-4 text-sm">{item.type}</td>
          <td className="py-4 px-4 text-sm">{item.periods}</td>
          <td className="py-4 px-4 text-sm text-cyan-600 cursor-pointer">
            {item.faculty}
          </td>
        </tr>
      )}
    />
  );
};

export default SubjectsTable;
