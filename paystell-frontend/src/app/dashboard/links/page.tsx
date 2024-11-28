import { PaymentLinkType, PaymentLinksTable } from "@/components/dashboard/links/PaymentLinksTable";
import { Button } from "@/components/ui/button";

const paymentLinksData: PaymentLinkType[] = [
    { id: 1, name: "Product 1", sku: "SKU12345", price: "$20.00", state: "Active" },
    { id: 2, name: "Product 2", sku: "SKU67890", price: "$35.00", state: "Inactive" },
    { id: 4, name: "Product 3", sku: "SKU54321", price: "$50.00", state: "Active" },
    { id: 5, name: "Product 3", sku: "SKU54321", price: "$50.00", state: "Active" },
    { id: 6, name: "Product 3", sku: "SKU54321", price: "$50.00", state: "Active" },
    { id: 7, name: "Product 3", sku: "SKU54321", price: "$50.00", state: "Active" },
    { id: 8, name: "Product 3", sku: "SKU54321", price: "$50.00", state: "Active" },

];

export default function PaymentLinkScreen(): JSX.Element {
    return (
        <div className="flex flex-col p-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-xl font-semibold">Payment Links</h1>
                <Button size="lg">
                    + New Payment
                </Button>
            </div>
            <PaymentLinksTable data={paymentLinksData} />
        </div>
    )
}

