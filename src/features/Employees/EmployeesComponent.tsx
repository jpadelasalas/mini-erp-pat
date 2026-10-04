import TableShell, { Avatar, Row } from "../../components/TableShell";
import {
  useEmployeesModalData,
  useEmployeesParentData,
} from "../../context/EmployeesContext";
import EmployeeModal from "./EmployeeModal";

const columns = [
  { label: "Employee ID" },
  { label: "Name" },
  { label: "Position" },
  { label: "Status" },
];

const EmployeesComponent = () => {
  const p = useEmployeesParentData();
  const { isOpenModal, handleOpenModal, onEdit } = useEmployeesModalData();

  return (
    <>
      <TableShell
        search={p.search}
        onSearch={p.handleSearch}
        searchPlaceholder="Search employees"
        addLabel="Add employee"
        onAdd={handleOpenModal}
        columns={columns}
        isEmpty={!p.paginatedData.length}
        totalData={p.totalData}
        currentPage={p.currentPage}
        dataPerPage={p.dataPerPage}
        onPageChange={p.handlePageChange}
        onRowsPerPageChange={p.handleRowsPerPageChange}
      >
        {p.paginatedData.map((item, index) => {
          const name = `${item.last_name}, ${item.first_name}`;
          const active = item.status === "AC";
          return (
            <Row key={`${index}-${item.employeeId}`} onEdit={() => onEdit(item)}>
              <td className="font-mono text-[13px] whitespace-nowrap">{item.employeeId}</td>
              <td>
                <div className="flex items-center gap-2.5">
                  <Avatar name={`${item.first_name} ${item.last_name}`} />
                  <span className="font-medium whitespace-nowrap">{name}</span>
                </div>
              </td>
              <td className="text-muted">{item.position}</td>
              <td>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    active ? "bg-pos-bg text-pos" : "bg-[#efede6] text-muted"
                  }`}
                >
                  <span className={`size-1.5 rounded-full ${active ? "bg-pos" : "bg-faint"}`} />
                  {active ? "Active" : "Resigned"}
                </span>
              </td>
            </Row>
          );
        })}
      </TableShell>
      {isOpenModal && <EmployeeModal />}
    </>
  );
};

export default EmployeesComponent;
