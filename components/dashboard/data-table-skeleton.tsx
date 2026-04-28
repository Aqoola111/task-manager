import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DataTableSkeletonProps = {
  rows?: number;
  columns?: number;
};

/** Table-shaped skeleton so lists never flash empty before data arrives. */
export function DataTableSkeleton({
  rows = 6,
  columns = 4,
}: DataTableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {Array.from({ length: columns }).map((_, i) => (
            <TableHead
              key={i}
              className={
                i === 0
                  ? "pl-4"
                  : i === columns - 1
                    ? "pr-4 text-right"
                    : undefined
              }
            >
              <Skeleton className="h-4 w-20 rounded-sm" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, r) => (
          <TableRow key={r}>
            {Array.from({ length: columns }).map((_, c) => (
              <TableCell
                key={c}
                className={
                  c === 0
                    ? "pl-4"
                    : c === columns - 1
                      ? "pr-4 text-right"
                      : undefined
                }
              >
                <Skeleton
                  className={
                    c === 0
                      ? "h-5 w-full max-w-[200px] rounded-sm"
                      : c === columns - 1
                        ? "ml-auto h-5 w-24 rounded-sm"
                        : "h-5 w-16 rounded-sm"
                  }
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
