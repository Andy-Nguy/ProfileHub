import React, { useState } from 'react';
import { BaseDialog } from './BaseDialog';
import { FloatingField, FloatingTextarea } from '../../shared/FloatingField';
import { Button } from '../../shared/Button';
import { ProfileResponse, profileAPI } from '../../../services/profile.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileResponse;
  onSuccess: () => void;
}

export const BasicInfoDialog: React.FC<Props> = ({ isOpen, onClose, profile, onSuccess }) => {
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || '',
    headline: profile?.headline || '',
    location: profile?.location || '',
    bio: profile?.bio || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await profileAPI.updateProfile(formData);
      onSuccess();
      onClose();
    } catch (e) {
      // Error handled by api service toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose} title="Edit Basic Info">
      <div className="space-y-4">
        <FloatingField 
          id="displayName" 
          label="Display Name *" 
          value={formData.displayName}
          onChange={e => setFormData({...formData, displayName: e.target.value})}
        />
        <FloatingField 
          id="headline" 
          label="Headline *" 
          value={formData.headline}
          onChange={e => setFormData({...formData, headline: e.target.value})}
        />
        <FloatingField 
          id="location" 
          label="Location" 
          value={formData.location}
          onChange={e => setFormData({...formData, location: e.target.value})}
        />
        <FloatingTextarea
          id="bio"
          label="About Me / Bio"
          value={formData.bio}
          onChange={e => setFormData({...formData, bio: e.target.value})}
          rows={4}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button className="border border-outline-variant text-primary font-label-lg text-label-lg py-2.5 px-6 rounded-full hover:bg-surface-container-low transition-colors" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} isLoading={loading}>Save</Button>
        </div>
      </div>
    </BaseDialog>
  );
};
