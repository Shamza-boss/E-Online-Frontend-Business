export type ManagementHeaderProps = {
  activeTab: string;
  isElevated: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenRegisterPerson: () => void;
  onOpenClassCreator: () => void;
  onOpenSubjectCreator: () => void;
  onOpenAcademicsCreator: () => void;
}
