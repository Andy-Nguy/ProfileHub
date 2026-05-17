import React, { useState } from 'react';
import { BaseDialog } from './BaseDialog';
import { FloatingTextarea } from '../../shared/FloatingField';
import { Button } from '../../shared/Button';
import { profileAPI } from '../../../services/profile.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onSuccess: () => void;
}

export const AboutDialog: React.FC<Props> = ({ isOpen, onClose, profile, onSuccess }) => {
  const [bio, setBio] = useState(profile?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await profileAPI.updateProfile({ bio });
      onSuccess();
      onClose();
    } catch (e) {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose} title="Edit About">
      <div className="space-y-4">
        <FloatingTextarea 
          id="bio" 
          label="Bio Summary" 
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={6}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button className="border border-outline-variant text-primary font-label-lg text-label-lg py-2.5 px-6 rounded-full hover:bg-surface-container-low transition-colors" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} isLoading={loading}>Save</Button>
        </div>
      </div>
    </BaseDialog>
  );
};
