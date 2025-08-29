import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import { Edit, Save, X } from 'lucide-react';

interface EditableContentProps {
  section: string;
  defaultContent?: string;
  type?: 'text' | 'textarea';
  className?: string;
  placeholder?: string;
}

const EditableContent = ({ 
  section, 
  defaultContent = '', 
  type = 'text',
  className = '',
  placeholder = 'Click to edit...'
}: EditableContentProps) => {
  const { isAuthenticated } = useAuth();
  const { content, updateContent } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const currentContent = content[section] || defaultContent;

  const handleEdit = () => {
    setEditValue(currentContent);
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateContent(section, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue('');
    setIsEditing(false);
  };

  if (isEditing && isAuthenticated) {
    return (
      <div className="space-y-2">
        {type === 'textarea' ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={className}
            placeholder={placeholder}
            rows={4}
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={className}
            placeholder={placeholder}
          />
        )}
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <div className={currentContent ? '' : 'text-muted-foreground italic'}>
        {currentContent || placeholder}
      </div>
      {isAuthenticated && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default EditableContent;