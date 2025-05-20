import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Specification {
  name: string;
  value: string;
}

interface ProductSpecificationsProps {
  specifications: Specification[];
}

export function ProductSpecifications({
  specifications,
}: ProductSpecificationsProps) {
  return (
    <div className="max-w-3xl overflow-hidden rounded-lg bg-gradient-to-r from-white to-amber-50/50 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3 bg-amber-50">Specification</TableHead>
            <TableHead className="bg-amber-50">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specifications.map((spec, index) => (
            <TableRow
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-amber-50/30"}
            >
              <TableCell className="font-medium">{spec.name}</TableCell>
              <TableCell>{spec.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
