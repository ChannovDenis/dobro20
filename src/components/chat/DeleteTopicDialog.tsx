import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicTitle: string;
  onConfirm: () => void;
}

export function DeleteTopicDialog({
  open,
  onOpenChange,
  topicTitle,
  onConfirm,
}: DeleteTopicDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить чат?</AlertDialogTitle>
          <AlertDialogDescription>
            Чат «{topicTitle}» и все его сообщения будут удалены безвозвратно. 
            Это действие нельзя отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
