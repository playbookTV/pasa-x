import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Edit, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { updateApplicationStatus } from '../lib/dashboard';
import { toast } from 'react-hot-toast';

interface ApplicationItemProps {
  id?: string;
  company: string;
  date: string;
  jobTitle: string;
  status: string;
  location?: string;
  url?: string;
  notes?: string;
  className?: string;
}

export const ApplicationItem: React.FC<ApplicationItemProps> = ({
  id,
  company,
  date,
  jobTitle,
  status,
  location,
  url,
  notes,
  className
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [noteValue, setNoteValue] = useState(notes || '');
  const [currentStatus, setCurrentStatus] = useState(status);

  // Get appropriate color for the status badge
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SAVED':
        return 'bg-blue-100 text-blue-800';
      case 'APPLIED':
        return 'bg-indigo-100 text-indigo-800';
      case 'INTERVIEW':
        return 'bg-amber-100 text-amber-800';
      case 'OFFER':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Update application status
  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    
    try {
      await updateApplicationStatus(id, newStatus);
      setCurrentStatus(newStatus);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  // Save notes
  const handleSaveNotes = async () => {
    if (!id) return;
    
    try {
      // This would typically call an API to update notes
      // For now we're just updating the local state
      setIsEditing(false);
      toast.success('Notes saved');
    } catch (error) {
      toast.error('Failed to save notes');
      console.error(error);
    }
  };

  return (
    <div className={`w-full border-b border-gray-200 py-4 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">{jobTitle}</h3>
            <Badge className={getStatusColor(currentStatus)}>
              {currentStatus}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">{company}</p>
          {location && <p className="text-xs text-gray-500">{location}</p>}
          <p className="text-xs text-gray-500 mt-1">Applied: {date}</p>
        </div>
        <div className="flex items-center gap-2">
          {url && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-auto"
              onClick={() => window.open(url, '_blank')}
            >
              <ExternalLink size={16} />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-auto"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4">
          {/* Status Management */}
          <div>
            <h4 className="text-sm font-medium mb-2">Update Status</h4>
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant={currentStatus === 'SAVED' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('SAVED')}
              >
                Saved
              </Button>
              <Button 
                size="sm" 
                variant={currentStatus === 'APPLIED' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('APPLIED')}
              >
                Applied
              </Button>
              <Button 
                size="sm" 
                variant={currentStatus === 'INTERVIEW' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('INTERVIEW')}
              >
                Interview
              </Button>
              <Button 
                size="sm" 
                variant={currentStatus === 'OFFER' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('OFFER')}
              >
                Offer
              </Button>
              <Button 
                size="sm" 
                variant={currentStatus === 'REJECTED' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('REJECTED')}
              >
                Rejected
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Notes</h4>
              {!isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1 h-auto"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={16} />
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <>
                <Textarea
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  className="min-h-[100px] mb-2"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setNoteValue(notes || '');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSaveNotes}
                  >
                    Save
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {noteValue || 'No notes added yet.'}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.open(`/applications/${id}`, '_blank')}
            >
              View Details
            </Button>
            {url && (
              <Button 
                size="sm"
                onClick={() => window.open(url, '_blank')}
              >
                Go to Job
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

