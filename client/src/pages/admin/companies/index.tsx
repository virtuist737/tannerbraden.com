import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Plus, Trash2, ExternalLink } from "lucide-react";
import { Link, useLocation } from "wouter";
import { PageTitle } from "@/components/ui/page-title";
import { motion } from "framer-motion";
import { Company } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";

export default function CompaniesAdmin() {
  const { data: companies, isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  const [location, navigate] = useLocation();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/companies/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "Company deleted",
        description: "The company has been successfully deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete company",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AdminLayout>
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <PageTitle>Manage Companies</PageTitle>
            <Button asChild>
              <Link href="/admin/companies/new">
                <Plus className="mr-2 h-4 w-4" /> Add Company
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Loading companies...</div>
          ) : (
            <div className="grid gap-4">
              {companies?.map((company) => (
                <Card key={company.id}>
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span>{company.name}</span>
                      <div className="flex gap-2">
                        {company.websiteUrl && (
                          <Button variant="ghost" size="icon" asChild>
                            <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/companies/${company.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Company</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{company.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(company.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                        <img src={company.logoUrl} alt={company.name} className="h-full w-full object-contain" />
                      </div>
                      <p className="text-sm text-muted-foreground">{company.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {companies?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No companies found. Add your first company to get started.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}