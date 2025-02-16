import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Mail, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { NewsletterSubscription } from "@shared/schema";
import { format } from "date-fns";

export default function AdminNewsletter() {
  const { data: subscribers } = useQuery<NewsletterSubscription[]>({
    queryKey: ["/api/newsletter/subscribers"],
  });

  const confirmedSubscribers = subscribers?.filter((sub) => sub.isConfirmed).length ?? 0;
  const totalSubscribers = subscribers?.length ?? 0;

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <h1 className="text-3xl font-bold tracking-tight">Newsletter Management</h1>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Subscribers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubscribers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Confirmed Subscribers
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedSubscribers}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subscribers List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscribed On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers?.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>{subscriber.email}</TableCell>
                    <TableCell>
                      {subscriber.isConfirmed ? "Confirmed" : "Pending"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(subscriber.subscribedAt), "PPP")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
