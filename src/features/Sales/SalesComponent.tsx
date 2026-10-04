import TableShell, { Avatar, Row } from "../../components/TableShell";
import {
  useSalesModalData,
  useSalesParentData,
} from "../../context/SalesContext";
import SalesModal from "./SalesModal";
import { peso } from "../../lib/ui";

const columns = [
  { label: "Sales no." },
  { label: "Customer" },
  { label: "Item no." },
  { label: "Qty", align: "right" as const },
  { label: "Total", align: "right" as const },
  { label: "Sold at" },
];

const SalesComponent = () => {
  const p = useSalesParentData();
  const { isOpenModal, handleOpenModal, onEdit } = useSalesModalData();

  return (
    <>
      <TableShell
        search={p.search}
        onSearch={p.handleSearch}
        searchPlaceholder="Search sales"
        addLabel="Record sale"
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
          const [date, time] = item.sold_at.split("T");
          return (
            <Row key={`${index}-${item.salesNum}`} onEdit={() => onEdit(item)}>
              <td className="font-mono text-[13px] whitespace-nowrap">{item.salesNum}</td>
              <td>
                <div className="flex items-center gap-2.5">
                  <Avatar name={item.customer_name || "?"} />
                  <span className="font-medium whitespace-nowrap">{item.customer_name || "Walk-in"}</span>
                </div>
              </td>
              <td className="font-mono text-[13px] whitespace-nowrap">{item.itemNum}</td>
              <td className="text-right font-mono text-[13px]">{item.quantity_sold}</td>
              <td className="text-right font-mono text-[13px] font-medium whitespace-nowrap">
                {peso(Number(item.total_price))}
              </td>
              <td className="font-mono text-xs whitespace-nowrap">
                <span className="text-muted">{date}</span> <span className="text-faint">{time}</span>
              </td>
            </Row>
          );
        })}
      </TableShell>
      {isOpenModal && <SalesModal />}
    </>
  );
};

export default SalesComponent;
