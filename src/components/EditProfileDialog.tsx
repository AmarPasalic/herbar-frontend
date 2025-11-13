import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../hooks/useLanguage';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function EditProfileDialog({ open, onOpenChange, onUpdate }: EditProfileDialogProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Učitaj trenutne podatke kada se dijalog otvori
  useEffect(() => {
    if (open) {
      setName(localStorage.getItem('userName') || '');
      setGrade(localStorage.getItem('userGrade') || '');
      setSchool(localStorage.getItem('userSchool') || '');
      setEmail(localStorage.getItem('userEmail') || '');
      setProfileImage(localStorage.getItem('userProfileImage') || null);
    }
  }, [open]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim() || !grade.trim() || !school.trim() || !email.trim()) {
      toast.error(
        t('language') === 'bs' ? 'Greška' : 'Error',
        {
          description: t('language') === 'bs' ? 'Molimo popunite sva polja.' : 'Please fill all fields.',
        }
      );
      return;
    }

    if (!email.includes('@')) {
      toast.error(
        t('language') === 'bs' ? 'Greška' : 'Error',
        {
          description: t('language') === 'bs' ? 'Molimo unesite validan email.' : 'Please enter a valid email.',
        }
      );
      return;
    }

    setIsLoading(true);

    // Simuliraj čuvanje
    setTimeout(() => {
      localStorage.setItem('userName', name);
      localStorage.setItem('userGrade', grade);
      localStorage.setItem('userSchool', school);
      localStorage.setItem('userEmail', email);
      if (profileImage) {
        localStorage.setItem('userProfileImage', profileImage);
      }
      
      setIsLoading(false);
      onUpdate();
      onOpenChange(false);
      
      toast.success(
        t('profileUpdated'),
        {
          description: t('language') === 'bs' ? 'Vaši podaci su uspješno sačuvani.' : 'Your data has been successfully saved.',
        }
      );
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('editProfileTitle')}</DialogTitle>
          <DialogDescription>
            {t('language') === 'bs' ? 'Ažurirajte svoje lične informacije' : 'Update your personal information'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="size-24">
              {profileImage ? (
                <AvatarImage src={profileImage} alt={name} />
              ) : null}
              <AvatarFallback className="bg-green-600 text-white">
                <User className="size-12" />
              </AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-4" />
              {t('changePhoto')}
            </Button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{t('fullName')}</Label>
              <Input
                id="edit-name"
                type="text"
                placeholder="Marko Marković"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-grade">{t('grade')}</Label>
              <Input
                id="edit-grade"
                type="text"
                placeholder={t('gradePlaceholder')}
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-school">{t('school')}</Label>
              <Input
                id="edit-school"
                type="text"
                placeholder={t('schoolPlaceholder')}
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading 
              ? (t('language') === 'bs' ? 'Čuvanje...' : 'Saving...') 
              : t('saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
