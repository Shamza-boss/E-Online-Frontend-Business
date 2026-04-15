import type { Homework } from '@/app/_lib/interfaces/types';
import type { HomeworkRow } from './interfaces';

export const resolveModuleId = (module: HomeworkRow) =>
  module.homeworkId ?? module.id ?? '';

export const filterActiveModules = (
  data: Homework[] | undefined
): Homework[] => {
  if (!data) return [];
  return data.filter((module) => module.isActive ?? true);
};

export const buildRows = (modules: Homework[]): HomeworkRow[] =>
  modules.map((module, index) => ({
    ...module,
    __gridId:
      module.homeworkId ?? module.id ?? `${module.title || 'module'}-${index}`,
  }));

export const handlePublishAction = async (
  homeworkId: string,
  teacherId: string,
  publishFn: (teacherId: string, homeworkId: string) => Promise<unknown>,
  showAlert: (...args: any[]) => void,
  mutate: () => Promise<unknown>,
  onAfterChange?: () => void
) => {
  try {
    await publishFn(teacherId, homeworkId);
    showAlert('success', 'Module published successfully');
    await mutate();
    onAfterChange?.();
  } catch (error: any) {
    console.error('Failed to publish module', error);
    showAlert(
      'error',
      "Couldn't publish the module. Please try again in a moment."
    );
  }
};

export const handleUnpublishAction = async (
  homeworkId: string,
  teacherId: string,
  unpublishFn: (teacherId: string, homeworkId: string) => Promise<unknown>,
  showAlert: (...args: any[]) => void,
  mutate: () => Promise<unknown>,
  onAfterChange?: () => void
) => {
  try {
    await unpublishFn(teacherId, homeworkId);
    showAlert('success', 'Module moved back to draft');
    await mutate();
    onAfterChange?.();
  } catch (error: any) {
    console.error('Failed to unpublish module', error);
    showAlert(
      'error',
      "Couldn't unpublish the module. Please try again in a moment."
    );
  }
};

export const handleDeleteAction = async (
  homeworkId: string,
  teacherId: string,
  deleteFn: (teacherId: string, homeworkId: string) => Promise<unknown>,
  showAlert: (...args: any[]) => void,
  mutate: () => Promise<unknown>,
  onAfterChange?: () => void
) => {
  try {
    await deleteFn(teacherId, homeworkId);
    showAlert('success', 'Module deleted successfully');
    await mutate();
    onAfterChange?.();
  } catch (error: any) {
    console.error('Failed to delete module', error);
    showAlert(
      'error',
      "Couldn't delete the module. Please try again in a moment."
    );
  }
};
