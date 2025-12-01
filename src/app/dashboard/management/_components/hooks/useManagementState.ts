'use client';

import { useState } from 'react';
import { mutate } from 'swr';

export const useManagementState = () => {
  const [openRegisterPerson, setOpenRegisterPerson] = useState<boolean>(false);
  const [openClassCreator, setOpnClassCreator] = useState<boolean>(false);
  const [openSubjectCreator, setOpnSubjectCreator] = useState<boolean>(false);
  const [openAcademicsCreator, setOpnAcademicsCreator] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('1');

  const handleOpenRegisterPerson = () => setOpenRegisterPerson(true);
  const handleOpenClassCreator = () => setOpnClassCreator(true);
  const handleOpenSubjectCreator = () => setOpnSubjectCreator(true);
  const handleOpenAcademicsCreator = () => setOpnAcademicsCreator(true);

  const handleCloseRegisterPerson = async () => {
    setOpenRegisterPerson(false);
    await mutate((key) => Array.isArray(key) && key[0] === 'users');
  };

  const handleCloseClassCreator = async () => {
    setOpnClassCreator(false);
    await mutate(
      (key) =>
        key === 'classes' ||
        (Array.isArray(key) && key.length > 0 && key[0] === 'classes')
    );
  };

  const handleCloseAcademicsCreator = async () => {
    setOpnAcademicsCreator(false);
    await mutate('academics');
  };

  const handleCloseSubjectCreator = async () => {
    setOpnSubjectCreator(false);
    await mutate('subjects');
  };

  return {
    openRegisterPerson,
    openClassCreator,
    openSubjectCreator,
    openAcademicsCreator,
    activeTab,
    setActiveTab,
    handleOpenRegisterPerson,
    handleOpenClassCreator,
    handleOpenSubjectCreator,
    handleOpenAcademicsCreator,
    handleCloseRegisterPerson,
    handleCloseClassCreator,
    handleCloseAcademicsCreator,
    handleCloseSubjectCreator,
  };
};
