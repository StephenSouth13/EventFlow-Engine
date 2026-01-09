import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Trash2, Edit2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserWithRole {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_roles?: Array<{
    id: string;
    role: string;
    created_at: string;
  }>;
}

const AVAILABLE_ROLES = ["attendee", "startup", "investor", "speaker", "sponsor", "admin"];

export function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [filterRole, setFilterRole] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Get all users from auth
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) throw authError;

      // Get all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Map roles to users
      const usersWithRoles: UserWithRole[] = (authUsers.users || []).map((user) => ({
        id: user.id,
        email: user.email || "",
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        user_roles: rolesData?.filter((role) => role.user_id === user.id) || [],
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async (userId: string) => {
    if (!selectedRole) {
      toast({ title: "Error", description: "Please select a role", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role: selectedRole }]);

      if (error) throw error;

      toast({ title: "Success", description: `Role ${selectedRole} added` });
      setSelectedRole("");
      setEditingUserId(null);
      loadUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;

      toast({ title: "Success", description: "Role removed" });
      loadUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filteredUsers = users.filter((user) => {
    const emailMatch = user.email.toLowerCase().includes(searchEmail.toLowerCase());
    const roleMatch =
      !filterRole ||
      (user.user_roles && user.user_roles.some((r) => r.role === filterRole));
    return emailMatch && roleMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Search by Email</Label>
              <Input
                placeholder="Search email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Filter by Role</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  {AVAILABLE_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Users ({filteredUsers.length})
        </h3>

        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No users found
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{user.email}</h3>
                    <div className="space-y-1 mt-2">
                      <p className="text-sm text-muted-foreground">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                      {user.last_sign_in_at && (
                        <p className="text-sm text-muted-foreground">
                          Last login: {new Date(user.last_sign_in_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* User Roles */}
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Roles:</p>
                      <div className="flex flex-wrap gap-2">
                        {user.user_roles && user.user_roles.length > 0 ? (
                          user.user_roles.map((role) => (
                            <div
                              key={role.id}
                              className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-sm"
                            >
                              <Shield className="w-3 h-3" />
                              {role.role}
                              <button
                                onClick={() => handleRemoveRole(role.id)}
                                className="ml-2 text-xs text-destructive hover:text-destructive/80"
                              >
                                ✕
                              </button>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No roles assigned</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add Role */}
                  <div className="w-48">
                    {editingUserId === user.id ? (
                      <div className="space-y-2">
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {AVAILABLE_ROLES.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleAddRole(user.id)}
                            disabled={submitting || !selectedRole}
                            className="flex-1"
                          >
                            {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingUserId(null);
                              setSelectedRole("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => setEditingUserId(user.id)}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Add Role
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Users are synced from Supabase authentication. You can assign roles here to grant
            access to different parts of the application.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
