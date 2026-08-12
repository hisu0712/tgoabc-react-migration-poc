import { CustomerListCard } from "@/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scissors } from "lucide-react";

export default function CustomerListPage() {
  const customers = [
    {
      id: "7bf457aa-41bd-4889-a029-d1e16738d377",
      name: "문현준",
      phone: "0444",
    },
    {
      id: "7bf457aa-41bd-4889-a029-d1e16738d377",
      name: "문현준",
      phone: "0444",
    },
    {
      id: "7bf457aa-41bd-4889-a029-d1e16738d377",
      name: "문현준",
      phone: "0444",
    },
  ];

  return (
    <div>
      <div className="bg-muted-foreground/20 mb-7 h-[1px] w-full"></div>

      <div className="mb-3 flex items-center justify-between">
        <div className="text-muted-foreground text-sm">고객 0명</div>

        <Select value="all">
          {/* const { mutate: updateDesigner } = useUpdateCustomerDesigner();
추후 변경 예정
 <Select
   value={customer?.designerId ?? "none"}
   onValueChange={(value) => updateDesigner({ customerId, designerId: value })}
 ></Select> */}
          <SelectTrigger>
            <Scissors className="size-4" strokeWidth={1.5} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="tigo">김티고 디자이너</SelectItem>
            <SelectItem value="tigen">김티젠 디자이너</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        {customers.map((customer) => (
          <CustomerListCard
            key={customer.id}
            id={customer.id}
            name={customer.name}
            phone={customer.phone}
          />
        ))}
      </div>
    </div>
  );
}
