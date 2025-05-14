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
import type { Venture } from "@shared/schema";

export default function AdminVentures() {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const { data: ventures, refetch } = useQuery<Venture[]>({
    queryKey: ["/api/ventures"],
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this venture?")) {
      return;
    }

    setIsDeleting(id);
    try {
      await apiRequest(`/api/ventures/${id}`, {
        method: "DELETE",
      });
      
      toast({
        title: "Venture deleted",
        description: "The venture has been deleted successfully.",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete venture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <PageTitle>Ventures</PageTitle>
        <Button asChild>
          <Link href="/admin/ventures/new">
            <Plus className="mr-2 h-4 w-4" /> Add Venture
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Ventures</CardTitle>
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
              {ventures?.map((venture) => (
                <TableRow key={venture.id}>
                  <TableCell className="font-medium">{venture.name}</TableCell>
                  <TableCell>
                    <img
                      src={venture.logoUrl}
                      alt={venture.name}
                      className="h-8 w-8 object-contain"
                    />
                  </TableCell>
                  <TableCell>{venture.sortOrder}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/ventures/${venture.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(venture.id)}
                        disabled={isDeleting === venture.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!ventures?.length && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No ventures found. Click "Add Venture" to create one.
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