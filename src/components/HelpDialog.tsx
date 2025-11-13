import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Card } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Mail, MessageCircle, Book, ExternalLink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  const handleContactSupport = () => {
    toast.success('Kontakt forma otvorena', {
      description: 'Molimo opišite vaš problem.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pomoć i podrška</DialogTitle>
          <DialogDescription>
            Često postavljana pitanja i kontakt
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 cursor-pointer hover:bg-accent transition-colors" onClick={handleContactSupport}>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full p-2">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm">Email podrška</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Kontaktirajte nas
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 cursor-pointer hover:bg-accent transition-colors" onClick={handleContactSupport}>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full p-2">
                  <MessageCircle className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm">Chat podrška</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Uživo pomoć
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* FAQ */}
          <div>
            <h4 className="mb-3">Često postavljana pitanja</h4>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Kako identificirati biljku?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Idite na tab "Identifikuj", fotografišite biljku koristeći kameru, 
                    a aplikacija će automatski pokušati da identifikuje vrstu. Možete 
                    dodati više fotografija za bolju tačnost.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Kako zarađujem bodove?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Bodovi se zarađuju na sljedeće načine:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                    <li>10 bodova - Identifikacija bilo koje biljke</li>
                    <li>50 bodova - Identifikacija nove vrste</li>
                    <li>100 bodova - Pronalaženje rijetke biljke</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Šta su dostignuća?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Dostignuća su posebni znački koje osvajate kada ispunite određene 
                    uslove, kao što su fotografisanje određenog broja biljaka ili 
                    identifikacija rijetkih vrsta. Provjerite "Uputstva" za kompletan spisak.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Mogu li koristiti aplikaciju offline?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Ako omogućite "Offline režim" u Preferencijama, možete pristupiti 
                    vašoj biblioteci biljaka i prethodno snimljenim podacima bez internet 
                    konekcije. Identifikacija novih biljaka zahtijeva internet vezu.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Kako ažurirati svoj profil?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Idite na "Profil" tab i kliknite na "Uredi profil" dugme ispod 
                    vaših informacija. Možete promijeniti svoje ime, odjeljenje i 
                    druge detalje.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Contact Info */}
          <Card className="p-4 bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <Book className="size-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm text-green-900 dark:text-green-200">Dokumentacija</h4>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1 mb-2">
                  Kompletna dokumentacija i vodič za korištenje aplikacije
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => toast.info('Dokumentacija', { description: 'Otvara se u novom tabu...' })}
                >
                  Otvori dokumentaciju
                  <ExternalLink className="size-3" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Version Info */}
          <div className="text-center text-xs text-muted-foreground">
            Digitalni Herbarijum v1.0.0<br />
            © 2025 Sva prava zadržana
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
