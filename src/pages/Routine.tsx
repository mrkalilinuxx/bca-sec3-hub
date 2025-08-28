import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useData, ScheduleItem } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Pending Scheduled Class Time', 'Notice'];

const Routine = () => {
  const { isAuthenticated } = useAuth();
  const { schedule, timeSlots, updateScheduleItem, updateTimeSlot, addTimeSlot, removeTimeSlot } = useData();
  const { toast } = useToast();
  
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editingTime, setEditingTime] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', details: '' });
  const [timeForm, setTimeForm] = useState('');

  const handleCellEdit = (cellId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please authenticate to edit the routine.",
        variant: "destructive",
      });
      return;
    }

    const item = schedule[cellId];
    setEditForm({
      name: item?.name || '',
      details: item?.details || ''
    });
    setEditingCell(cellId);
  };

  const handleSaveCell = () => {
    if (editingCell && editForm.name.trim()) {
      const item: ScheduleItem = {
        id: editingCell,
        name: editForm.name.trim(),
        details: editForm.details.trim(),
        timestamp: new Date().toISOString()
      };
      updateScheduleItem(editingCell, item);
      toast({
        title: "Schedule Updated",
        description: `${editForm.name} has been saved.`,
      });
    }
    setEditingCell(null);
    setEditForm({ name: '', details: '' });
  };

  const handleDeleteCell = () => {
    if (editingCell) {
      updateScheduleItem(editingCell, null);
      toast({
        title: "Item Deleted",
        description: "Schedule item has been removed.",
      });
    }
    setEditingCell(null);
    setEditForm({ name: '', details: '' });
  };

  const handleTimeEdit = (timeId: string, currentTime: string) => {
    if (!isAuthenticated) return;
    setEditingTime(timeId);
    setTimeForm(currentTime);
  };

  const handleSaveTime = () => {
    if (editingTime && timeForm.trim()) {
      updateTimeSlot(editingTime, timeForm.trim());
      toast({
        title: "Time Slot Updated",
        description: "Time slot has been updated.",
      });
    }
    setEditingTime(null);
    setTimeForm('');
  };

  const getCellId = (day: string, timeId: string) => `${day}-${timeId}`;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Weekly Routine</h1>
            <p className="text-muted-foreground">Manage your class schedule and time slots</p>
          </div>
          {isAuthenticated && (
            <Button onClick={addTimeSlot} className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          )}
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-professional">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-8 bg-muted border-b border-border">
            <div className="p-4 font-semibold border-r border-border">Time</div>
            {DAYS.map((day, index) => (
              <div key={day} className="p-4 font-semibold text-center border-r border-border last:border-r-0">
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{day.slice(0, 3)}</span>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot.id} className="grid grid-cols-1 md:grid-cols-8 border-b border-border last:border-b-0">
              {/* Time Header */}
              <div className="p-4 bg-muted/50 border-r border-border flex items-center justify-between">
                {editingTime === timeSlot.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      value={timeForm}
                      onChange={(e) => setTimeForm(e.target.value)}
                      className="text-sm"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleSaveTime} className="px-2">
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingTime(null)} className="px-2">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium">{timeSlot.time}</span>
                    {isAuthenticated && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleTimeEdit(timeSlot.id, timeSlot.time)}
                          className="px-2 h-6"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        {timeSlots.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeTimeSlot(timeSlot.id)}
                            className="px-2 h-6 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Day Cells */}
              {DAYS.map((day) => {
                const cellId = getCellId(day, timeSlot.id);
                const item = schedule[cellId];
                
                return (
                  <div
                    key={cellId}
                    className="p-4 border-r border-border last:border-r-0 min-h-[80px] cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => handleCellEdit(cellId)}
                  >
                    {item ? (
                      <div>
                        <div className="font-medium text-sm mb-1">{item.name}</div>
                        {item.details && (
                          <div className="text-xs text-muted-foreground">{item.details}</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground text-center flex items-center justify-center h-full">
                        Click to add
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingCell} onOpenChange={() => setEditingCell(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Schedule Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject/Activity Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Enter subject or activity name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Details (Optional)</label>
                <Textarea
                  value={editForm.details}
                  onChange={(e) => setEditForm({ ...editForm, details: e.target.value })}
                  placeholder="Room number, instructor, notes..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingCell(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteCell}>
                  Delete
                </Button>
                <Button onClick={handleSaveCell}>
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Routine;