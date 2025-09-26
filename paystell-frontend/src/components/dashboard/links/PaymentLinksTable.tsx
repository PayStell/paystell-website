'use client';

import { useState, type ReactNode } from 'react';
import {
  MdChevronLeft,
  MdChevronRight,
  MdMoreVert,
  MdShare,
  MdEdit,
  MdDeleteOutline,
} from 'react-icons/md';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditLinkModal } from './editLink/EditLinkModal';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { PaymentLink, softDeletePaymentLink } from '@/services/paymentLink.service';
import { useToast } from '@/components/ui/use-toast';

// Temporary Badge replacement until UI components are fixed
const Badge = ({
  children,
  variant = 'default',
  className = '',
}: {
  children: ReactNode;
  variant?: string;
  className?: string;
}) => {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    destructive: 'bg-red-100 text-red-800',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-200 text-gray-800',
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-md inline-flex items-center ${variantClasses[variant as keyof typeof variantClasses]} ${className}`}
    >
      {children}
    </span>
  );
};

export interface PaymentLinkType {
  id: string;
  name: string;
  sku: string;
  price: string;
  state: string;
}

interface PaymentLinksProps {
  data: PaymentLinkType[];
  onUpdate: (updatedLink: PaymentLink) => void;
  onDelete: (id: string) => void;
}

export function PaymentLinksTable({ data, onUpdate, onDelete }: PaymentLinksProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [editingLink, setEditingLink] = useState<PaymentLink | null>(null);
  const [deletingLink, setDeletingLink] = useState<PaymentLinkType | null>(null);
  const { toast } = useToast();

  const totalSteps = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleEdit = (link: PaymentLinkType) => {
    // Convert PaymentLinkType to PaymentLink format
    const [amount, currency] = link.price.split(' ');
    const paymentLink: PaymentLink = {
      id: link.id,
      name: link.name,
      sku: link.sku,
      amount: parseFloat(amount),
      currency,
      status: link.state.toLowerCase(),
      slug: '', // This is not shown in the table but required by the type
      createdAt: new Date().toISOString(), // This is not shown in the table but required by the type
    };
    setEditingLink(paymentLink);
  };

  const handleDelete = async (link: PaymentLinkType) => {
    try {
      await softDeletePaymentLink(link.id);
      onDelete(link.id);
      toast({
        title: 'Success',
        description: 'Payment link deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete payment link:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete payment link. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[120px]">
                {itemsPerPage} per page
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[5, 10, 20].map((count) => (
                <DropdownMenuItem key={count} onClick={() => handleItemsPerPageChange(count)}>
                  {count} items per page
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-[50px]">ID</TableHead>
            <TableHead className="text-center w-[150px]">Name</TableHead>
            <TableHead className="text-center w-[150px]">SKU</TableHead>
            <TableHead className="text-center w-[100px]">Price</TableHead>
            <TableHead className="text-center w-[100px]">State</TableHead>
            <TableHead className="text-center w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item) => (
            <TableRow key={item.id} className="h-[60px]">
              <TableCell className="text-center">{item.id}</TableCell>
              <TableCell className="text-center">{item.name}</TableCell>
              <TableCell className="text-center">{item.sku}</TableCell>
              <TableCell className="text-center">{item.price}</TableCell>
              <TableCell className="text-center">
                <Badge variant={item.state === 'active' ? 'active' : 'default'}>{item.state}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button variant="ghost" size="icon">
                    <MdShare className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MdMoreVert className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <MdEdit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingLink(item)}
                        className="text-destructive"
                      >
                        <MdDeleteOutline className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <MdChevronLeft />
        </Button>
        {[...Array(totalSteps)].map((_, index) => (
          <Button
            key={`page-${index + 1}`}
            variant={currentPage === index + 1 ? 'default' : 'outline'}
            className="w-8 h-8 p-0"
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalSteps}
        >
          <MdChevronRight />
        </Button>
      </div>

      {editingLink && (
        <EditLinkModal
          isOpen={true}
          onClose={() => setEditingLink(null)}
          paymentLink={editingLink}
          onUpdate={(updatedLink) => {
            onUpdate(updatedLink);
            setEditingLink(null);
          }}
        />
      )}

      {deletingLink && (
        <DeleteConfirmDialog
          isOpen={true}
          onClose={() => setDeletingLink(null)}
          onConfirm={() => handleDelete(deletingLink)}
          name={deletingLink.name}
        />
      )}
    </div>
  );
}
