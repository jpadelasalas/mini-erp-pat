import InventoryModal from "./InventoryModal";
import TableShell, { Row } from "../../components/TableShell";
import {
  useInventoryModalData,
  useInventoryParentData,
} from "../../context/InventoryContext";
import { LOW_STOCK, peso } from "../../lib/ui";

const columns = [
  { label: "Item no." },
  { label: "Item" },
  { label: "Category" },
  { label: "Stock" },
  { label: "Price", align: "right" as const },
  { label: "Created" },
  { label: "Updated" },
];

// ponytail: bar is full at 5× the low-stock threshold; add a per-item max when the data has one
const StockLevel = ({ qty }: { qty: number }) => {
  const low = qty <= LOW_STOCK;
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1 w-[72px] rounded-full bg-[#edebe4]">
        <div
          className={`h-1 rounded-full ${low ? "bg-neg" : "bg-ink"}`}
          style={{ width: `${Math.min(qty / (LOW_STOCK * 5), 1) * 100}%` }}
        />
      </div>
      <span className={`font-mono text-[13px] font-medium ${low ? "text-neg" : ""}`}>
        {qty > 0 ? qty : "Out"}
      </span>
    </div>
  );
};

const InventoryComponent = () => {
  const p = useInventoryParentData();
  const { isOpenModal, handleOpenModal, onEdit } = useInventoryModalData();

  return (
    <>
      <TableShell
        search={p.search}
        onSearch={p.handleSearch}
        searchPlaceholder="Search inventory"
        addLabel="Add item"
        onAdd={handleOpenModal}
        columns={columns}
        isEmpty={!p.paginatedData.length}
        totalData={p.totalData}
        currentPage={p.currentPage}
        dataPerPage={p.dataPerPage}
        onPageChange={p.handlePageChange}
        onRowsPerPageChange={p.handleRowsPerPageChange}
      >
        {p.paginatedData.map((item, index) => (
          <Row key={`${index}-${item.itemNum}`} onEdit={() => onEdit(item)}>
            <td className="font-mono text-[13px] whitespace-nowrap">{item.itemNum}</td>
            <td className="min-w-48">
              <p className="font-medium">{item.name}</p>
              {item.description && <p className="text-xs text-faint">{item.description}</p>}
            </td>
            <td>
              <span className="rounded-md bg-[#f0eee7] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-muted">
                {item.category}
              </span>
            </td>
            <td>
              <StockLevel qty={Number(item.quantity)} />
            </td>
            <td className="text-right font-mono text-[13px] font-medium whitespace-nowrap">
              {peso(Number(item.price))}
            </td>
            <td className="font-mono text-xs whitespace-nowrap text-muted">{item.date_created}</td>
            <td className="font-mono text-xs whitespace-nowrap text-muted">{item.updated_at}</td>
          </Row>
        ))}
      </TableShell>
      {isOpenModal && <InventoryModal />}
    </>
  );
};

export default InventoryComponent;
