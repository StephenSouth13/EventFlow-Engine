import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Mail, Phone, MessageSquare, Calendar, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  created_at: string;
  notes: string | null;
}

type FilterStatus = "all" | "new" | "read" | "replied";

export function ContactSubmissionsManager() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error && error.code !== "PGRST116") throw error;

      setSubmissions(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: "read" })
        .eq("id", id);

      if (error) throw error;

      loadSubmissions();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleMarkAsReplied = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: "replied" })
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "Marked as replied" });
      loadSubmissions();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedSubmission) return;

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from("contact_submissions")
        .update({ notes })
        .eq("id", selectedSubmission.id);

      if (error) throw error;

      toast({ title: "Success", description: "Notes saved" });
      loadSubmissions();
      setSelectedSubmission(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "Submission deleted" });
      loadSubmissions();
      setSelectedSubmission(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (filterStatus === "all") return true;
    return sub.status === filterStatus;
  });

  const newCount = submissions.filter((s) => s.status === "new").length;
  const readCount = submissions.filter((s) => s.status === "read").length;
  const repliedCount = submissions.filter((s) => s.status === "replied").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{newCount}</div>
              <p className="text-sm text-muted-foreground mt-1">New Submissions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">{readCount}</div>
              <p className="text-sm text-muted-foreground mt-1">Read</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{repliedCount}</div>
              <p className="text-sm text-muted-foreground mt-1">Replied</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(
          ["all", "new", "read", "replied"] as FilterStatus[]
        ).map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? "default" : "outline"}
            onClick={() => setFilterStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Submissions List */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Submissions Column */}
        <div className="md:col-span-2 space-y-4">
          {filteredSubmissions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No submissions found
              </CardContent>
            </Card>
          ) : (
            filteredSubmissions.map((submission) => (
              <Card
                key={submission.id}
                className={`cursor-pointer hover:shadow-md transition-all ${
                  selectedSubmission?.id === submission.id ? "ring-2 ring-primary" : ""
                } ${
                  submission.status === "new"
                    ? "border-primary/50 bg-primary/5"
                    : ""
                }`}
                onClick={() => {
                  setSelectedSubmission(submission);
                  setNotes(submission.notes || "");
                  if (submission.status === "new") {
                    handleMarkAsRead(submission.id);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{submission.name}</h3>
                      <p className="text-sm text-muted-foreground">{submission.email}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        submission.status === "new"
                          ? "bg-red-100 text-red-800"
                          : submission.status === "read"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {submission.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm font-medium mb-1">{submission.subject}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {submission.message}
                  </p>

                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Detail View */}
        <div>
          {selectedSubmission ? (
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
                  <p className="font-medium">{selectedSubmission.name}</p>
                </div>

                {/* Email */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </p>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="text-primary hover:underline break-all"
                  >
                    {selectedSubmission.email}
                  </a>
                </div>

                {/* Phone */}
                {selectedSubmission.phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Phone
                    </p>
                    <a
                      href={`tel:${selectedSubmission.phone}`}
                      className="text-primary hover:underline"
                    >
                      {selectedSubmission.phone}
                    </a>
                  </div>
                )}

                {/* Subject */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Subject</p>
                  <p className="font-medium">{selectedSubmission.subject}</p>
                </div>

                {/* Date */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Date
                  </p>
                  <p className="text-sm">
                    {new Date(selectedSubmission.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Message */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </p>
                  <p className="text-sm whitespace-pre-wrap p-3 bg-muted rounded-lg max-h-40 overflow-auto">
                    {selectedSubmission.message}
                  </p>
                </div>

                {/* Notes */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add internal notes..."
                    className="w-full px-3 py-2 border rounded-lg bg-background text-sm resize-none"
                    rows={4}
                  />
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t">
                  {selectedSubmission.status !== "replied" && (
                    <Button
                      size="sm"
                      variant="hero"
                      className="w-full"
                      onClick={() => handleMarkAsReplied(selectedSubmission.id)}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Mark as Replied
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={handleSaveNotes}
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Notes
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-destructive"
                    onClick={() => handleDelete(selectedSubmission.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Select a submission to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
