import type { ChangeEvent, ReactNode } from "react";
import { TablePagination } from "@mui/material";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import AdsClickOutlined from "@mui/icons-material/AdsClickOutlined";
import AddIcon from "@mui/icons-material/Add";
import { initials } from "../lib/ui";

type Column = { label: string; align?: "right" };

type Props = {
  search: string;
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder: string;
  addLabel: string;
  onAdd: () => void;
  columns: Column[];
  isEmpty: boolean;
  totalData: number;
  currentPage: number;
  dataPerPage: number;
  onPageChange: (e: unknown, page: number) => void;
  onRowsPerPageChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  children: ReactNode;
};

const TableShell = (p: Props) => (
  <>
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <label className="flex h-10 w-full items-center gap-2 rounded-[10px] border border-line bg-white px-3.5 transition-colors focus-within:border-ink sm:w-90">
        <SearchOutlined sx={{ fontSize: 16 }} className="text-faint" />
        <input
          type="text"
          aria-label={p.searchPlaceholder}
          placeholder={p.searchPlaceholder}
          value={p.search}
          onChange={p.onSearch}
          className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
        />
      </label>
      <span className="hidden items-center gap-1.5 text-xs text-faint md:flex">
        <AdsClickOutlined sx={{ fontSize: 14 }} />
        Double-click a row to edit
      </span>
      <button
        onClick={p.onAdd}
        className="ml-auto inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-ink-2"
      >
        <AddIcon sx={{ fontSize: 16 }} className="text-accent" />
        {p.addLabel}
      </button>
    </div>

    <div className="overflow-hidden rounded-[14px] border border-line bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-sheet">
            <tr>
              {p.columns.map((c) => (
                <th
                  key={c.label}
                  scope="col"
                  className={`h-11 px-4 font-mono text-[11px] font-normal tracking-wider whitespace-nowrap text-faint uppercase ${
                    c.align === "right" ? "text-right" : ""
                  }`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {p.isEmpty ? (
              <tr>
                <td colSpan={p.columns.length} className="px-4 py-14 text-center text-faint">
                  No records yet.
                </td>
              </tr>
            ) : (
              p.children
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        component="div"
        count={p.totalData}
        page={p.currentPage}
        onPageChange={p.onPageChange}
        rowsPerPage={p.dataPerPage}
        onRowsPerPageChange={p.onRowsPerPageChange}
        sx={{
          borderTop: "1px solid var(--color-line)",
          color: "var(--color-muted)",
          "& *": { fontFamily: "inherit !important" },
          "& .MuiTablePagination-displayedRows": { fontFamily: "var(--font-mono) !important", fontSize: 12 },
        }}
      />
    </div>
  </>
);

type RowProps = { onEdit: () => void; children: ReactNode };

export const Row = ({ onEdit, children }: RowProps) => (
  <tr
    tabIndex={0}
    onDoubleClick={onEdit}
    onKeyDown={(e) => e.key === "Enter" && onEdit()}
    className="h-[58px] cursor-pointer border-b border-line outline-none transition-colors last:border-b-0 hover:bg-[#fafbef] hover:shadow-[inset_3px_0_0_var(--color-accent)] focus-visible:bg-[#fafbef] focus-visible:shadow-[inset_3px_0_0_var(--color-accent)] [&>td]:px-4"
  >
    {children}
  </tr>
);

export const Avatar = ({ name }: { name: string }) => (
  <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-[#efede6] text-[11px] font-semibold text-muted">
    {initials(name)}
  </span>
);

export default TableShell;
