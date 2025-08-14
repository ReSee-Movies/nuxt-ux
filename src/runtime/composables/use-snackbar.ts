import { useToast } from 'primevue/usetoast';

export function useSnackbar() {
  const toast = useToast();

  return toast;
}
