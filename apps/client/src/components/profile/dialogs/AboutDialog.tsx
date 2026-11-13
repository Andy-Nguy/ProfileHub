import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseDialog } from './BaseDialog';
import { FloatingTextarea } from '../../shared/FloatingField';
import { Button } from '../../shared/Button';
import { ProfileResponse, profileAPI } from '../../../services/profile.service';
import { getErrorMessage } from '../../../services/api.service';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileResponse;
  onSuccess: () => void;
}

export const AboutDialog: React.FC<Props> = ({ isOpen, onClose, profile, onSuccess }) => {
  const { t } = useTranslation(['profile', 'common']);
  const [bio, setBio] = useState(profile?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await profileAPI.updateProfile({ bio });
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose} title={t('dialogs.about.title')}>
      <div className="space-y-4">
        <FloatingTextarea 
          id="bio" 
          label={t('dialogs.about.bioLabel')} 
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={6}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button className="border border-outline-variant text-primary font-label-lg text-label-lg py-2.5 px-6 rounded-full hover:bg-surface-container-low transition-colors" onClick={onClose}>{t('common:cancel')}</Button>
          <Button onClick={handleSave} isLoading={loading}>{t('common:save')}</Button>
        </div>
      </div>
    </BaseDialog>
  );
};
