
import { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, Plus, Edit, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HealthUnit {
  id: string;
  name: string;
  location: string;
  staff: number;
  status: 'active' | 'busy' | 'offline';
  equipment: string;
  createdAt: any;
}

const HealthUnitsManagement = () => {
  const [units, setUnits] = useState<HealthUnit[]>([]);
  const [newUnit, setNewUnit] = useState({ name: '', location: '', staff: 0, equipment: '' });
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'health_units'), (snapshot) => {
      const unitData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HealthUnit[];
      setUnits(unitData);
    });

    return unsubscribe;
  }, []);

  const addUnit = async () => {
    if (!newUnit.name || !newUnit.location || !newUnit.equipment || newUnit.staff <= 0) {
      toast({ title: "Error", description: "Please fill all fields correctly", variant: "destructive" });
      return;
    }

    try {
      await addDoc(collection(db, 'health_units'), {
        ...newUnit,
        status: 'active',
        createdAt: serverTimestamp()
      });
      setNewUnit({ name: '', location: '', staff: 0, equipment: '' });
      toast({ title: "Success", description: "Health unit added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add health unit", variant: "destructive" });
    }
  };

  const updateUnitStatus = async (id: string, status: 'active' | 'busy' | 'offline') => {
    try {
      await updateDoc(doc(db, 'health_units', id), { status });
      toast({ title: "Success", description: "Unit status updated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const deleteUnit = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'health_units', id));
      toast({ title: "Success", description: "Health unit deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete unit", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="h-5 w-5 mr-2" />
          Health Units Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add New Unit Form */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 border rounded-lg">
          <input
            placeholder="Unit Name"
            value={newUnit.name}
            onChange={(e) => setNewUnit({...newUnit, name: e.target.value})}
            className="px-3 py-2 border rounded bg-background text-foreground"
          />
          <input
            placeholder="Location"
            value={newUnit.location}
            onChange={(e) => setNewUnit({...newUnit, location: e.target.value})}
            className="px-3 py-2 border rounded bg-background text-foreground"
          />
          <input
            placeholder="Staff Count"
            type="number"
            value={newUnit.staff}
            onChange={(e) => setNewUnit({...newUnit, staff: parseInt(e.target.value) || 0})}
            className="px-3 py-2 border rounded bg-background text-foreground"
          />
          <input
            placeholder="Equipment"
            value={newUnit.equipment}
            onChange={(e) => setNewUnit({...newUnit, equipment: e.target.value})}
            className="px-3 py-2 border rounded bg-background text-foreground"
          />
          <Button onClick={addUnit} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Unit
          </Button>
        </div>

        {/* Units Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell className="font-medium">{unit.name}</TableCell>
                <TableCell>{unit.location}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {unit.staff}
                  </div>
                </TableCell>
                <TableCell>{unit.equipment}</TableCell>
                <TableCell>
                  <Badge variant={unit.status === 'active' ? 'default' : unit.status === 'busy' ? 'secondary' : 'destructive'}>
                    {unit.status}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateUnitStatus(unit.id, unit.status === 'active' ? 'busy' : 'active')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteUnit(unit.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HealthUnitsManagement;
