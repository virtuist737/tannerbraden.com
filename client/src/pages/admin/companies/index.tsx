import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import { apiRequest } from "@/lib/queryClient";
import type { Company } from "@shared/schema";

export default function AdminCompanies() {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const { data: companies, refetch } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this company?")) {
      return;
    }

    setIsDeleting(id);
    try {
      await apiRequest(`/api/companies/${id}`, {
        method: "DELETE",
      });
      
      toast({
        title: "Company deleted",
        description: "The company has been deleted successfully.",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <PageTitle>Companies</PageTitle>
        <Button asChild>
          <Link href="/admin/companies/new">
            <Plus className="mr-2 h-4 w-4" /> Add Company
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies?.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      className="h-8 w-8 object-contain"
                    />
                  </TableCell>
                  <TableCell>{company.sortOrder}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/companies/${company.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(company.id)}
                        disabled={isDeleting === company.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!companies?.length && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No companies found. Click "Add Company" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}