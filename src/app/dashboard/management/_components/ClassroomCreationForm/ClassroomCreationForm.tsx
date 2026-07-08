'use client';

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useForm, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';

import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import {
  AcademicLevelDto,
  SubjectDto,
} from '@/app/_lib/interfaces/types';
import { classroomSchema } from '@/app/_lib/schemas/management';
import { SubmitClassroom } from '../Forms/submitClassroom';
import { UpdateClassroomAction } from '../Forms/updateClassroomAction';
import CreateSubjectModal from '../Modals/CreateSubjectModal';
import CreateAcademicsModal from '../Modals/CreateAcademicsModal';
import { useAssetUpload } from '@/app/_lib/hooks/useAssetUpload';
import { useClassroomLookups } from '../hooks/useClassroomLookups';
import TextbookSourceTabs, {
  type TextbookSource,
} from '../Textbook/TextbookSourceTabs';
import {
  fileDtoToTextbookSelection,
  type TextbookSelection,
} from '@/app/_lib/utils/textbook';
import TextbookPreviewPanel from '@/app/_lib/components/textbook/TextbookPreviewPanel';
import type { ClassroomCreationFormProps } from './interfaces';
import {
  DEFAULT_FORM_ID,
  ADD_SUBJECT,
  ADD_ACADEMIC,
  TEXTBOOK_ACCEPT,
  TEXTBOOK_MAX_SIZE_MB,
} from './constants';
import {
  textbookFromClassroom,
  buildEffectiveTextbook,
  buildPreviewFile,
  getSubmitButtonLabel,
} from './utils';
import { FormLayout } from './elements';

export default function ClassroomCreationForm({
  formId = DEFAULT_FORM_ID,
  onSuccess,
  onCancel,
  mode = 'create',
  initialClassroom = null,
  isAdmin = true,
}: ClassroomCreationFormProps) {
  const isEditMode = mode === 'edit';
  const { showAlert } = useAlert();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    subjectOptions,
    subjectsLoading,
    upsertSubject,
    revalidateSubjects,
    academicOptions,
    academicsLoading,
    upsertAcademic,
    revalidateAcademics,
    instructors,
    usersLoading,
  } = useClassroomLookups();

  const [createResult, createAction, createPending] = useActionState(
    SubmitClassroom,
    false
  );
  const [updateResult, updateAction, updatePending] = useActionState(
    UpdateClassroomAction,
    false
  );
  const lastResult = isEditMode ? updateResult : createResult;
  const action = isEditMode ? updateAction : createAction;
  const pending = isEditMode ? updatePending : createPending;

  const [form, fields] = useForm({
    id: formId,
    lastResult,
    defaultValue: {
      name: initialClassroom?.name ?? '',
      teacherId: initialClassroom?.teacherId ?? '',
      academicLevelId: initialClassroom?.academicLevelId ?? '',
      subjectId: initialClassroom?.subjectId ?? '',
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: classroomSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });
  const formProps = getFormProps(form);
  const { name, teacherId, academicLevelId, subjectId } = fields;

  const [selectedTeacher, setSelectedTeacher] = useState(
    () => `${teacherId.initialValue ?? initialClassroom?.teacherId ?? ''}`
  );
  const [selectedAcademic, setSelectedAcademic] = useState(
    () => `${academicLevelId.initialValue ?? initialClassroom?.academicLevelId ?? ''}`
  );
  const [selectedSubject, setSelectedSubject] = useState(
    () => `${subjectId.initialValue ?? initialClassroom?.subjectId ?? ''}`
  );
  const [existingTextbook, setExistingTextbook] = useState<TextbookSelection | null>(
    () => textbookFromClassroom(initialClassroom)
  );
  const [textbookSource, setTextbookSource] = useState<TextbookSource>('upload');
  const [selectedLibraryFileId, setSelectedLibraryFileId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!initialClassroom) {
      setExistingTextbook(null);
      return;
    }

    setSelectedTeacher(`${initialClassroom.teacherId ?? ''}`);
    setSelectedAcademic(`${initialClassroom.academicLevelId ?? ''}`);
    setSelectedSubject(`${initialClassroom.subjectId ?? ''}`);
    setExistingTextbook(textbookFromClassroom(initialClassroom));
  }, [initialClassroom]);

  useEffect(() => {
    if (lastResult && (lastResult as { name?: string })?.name) {
      const actionVerb = isEditMode ? 'updated' : 'created';
      showAlert(
        'success',
        `The ${(lastResult as { name: string }).name} classroom was successfully ${actionVerb} 🚀!`
      );
      onSuccess?.();
    }
  }, [isEditMode, lastResult, onSuccess, showAlert]);

  const {
    asset: textbookAsset,
    preview: textbookThumbnail,
    stage: uploadStage,
    handleInputChange: handleTextbookInputChange,
    removeAsset: removeTextbookAsset,
  } = useAssetUpload({
    accept: [...TEXTBOOK_ACCEPT],
    maxSizeMb: TEXTBOOK_MAX_SIZE_MB,
    autoUpload: true,
    onUploaded: () =>
      showAlert('success', 'PDF uploaded and ready to attach.'),
    onError: (error) =>
      showAlert('error', error.message || 'Unable to upload textbook.'),
  });

  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [academicModalOpen, setAcademicModalOpen] = useState(false);

  useEffect(() => {
    if (textbookAsset) {
      setExistingTextbook(null);
      setSelectedLibraryFileId(null);
    }
  }, [textbookAsset]);

  const handleLibrarySelect = React.useCallback(
    (file: Parameters<typeof fileDtoToTextbookSelection>[0]) => {
      removeTextbookAsset();
      setExistingTextbook(fileDtoToTextbookSelection(file));
      setSelectedLibraryFileId(file.id);
      showAlert('success', 'Textbook selected from your library.');
    },
    [removeTextbookAsset, showAlert]
  );

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      void handleTextbookInputChange(event);
    },
    [handleTextbookInputChange]
  );

  const handleSubjectSelect = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    if (value === ADD_SUBJECT) {
      setSubjectModalOpen(true);
      return;
    }
    setSelectedSubject(value);
  };

  const handleAcademicSelect = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    if (value === ADD_ACADEMIC) {
      setAcademicModalOpen(true);
      return;
    }
    setSelectedAcademic(value);
  };

  const handleSubjectCreated = React.useCallback(
    async (created: SubjectDto) => {
      if (!created) return;
      if (created.id) setSelectedSubject(`${created.id}`);
      upsertSubject(created);
      await revalidateSubjects();
    },
    [revalidateSubjects, upsertSubject]
  );

  const handleAcademicCreated = React.useCallback(
    async (created: AcademicLevelDto) => {
      if (!created) return;
      if (created.id) setSelectedAcademic(`${created.id}`);
      upsertAcademic(created);
      await revalidateAcademics();
    },
    [revalidateAcademics, upsertAcademic]
  );

  const effectiveTextbook = buildEffectiveTextbook(textbookAsset, existingTextbook);
  const canSubmit = Boolean(effectiveTextbook);
  const previewFile = buildPreviewFile(
    effectiveTextbook,
    selectedLibraryFileId,
    textbookAsset?.key
  );

  const handleRemoveTextbook = () => {
    removeTextbookAsset();
    setExistingTextbook(null);
    setSelectedLibraryFileId(null);
  };

  const handleReplaceTextbook = () => {
    removeTextbookAsset();
    setExistingTextbook(null);
    setSelectedLibraryFileId(null);
  };

  return (
    <>
      <DialogContent dividers sx={{ padding: 0 }}>
        <Stack spacing={1} sx={{ width: '100%', p: 1 }}>
          <Alert severity="info">
            Upload a new PDF or choose an existing textbook from your library,
            confirm the course owner, and populate subjects or academic levels
            inline without leaving this screen.
          </Alert>

          <Box component="form" {...formProps} action={action} noValidate>
            <FormLayout>
              <Box>
                <Card
                  sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <CardHeader
                    title="Course Textbook"
                    subheader="Upload a new PDF or choose one from your library"
                  />
                  <CardContent
                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {!effectiveTextbook ? (
                      <TextbookSourceTabs
                        source={textbookSource}
                        onSourceChange={setTextbookSource}
                        fileInputRef={fileInputRef}
                        onUploadClick={handleUploadClick}
                        onFileChange={handleFileChange}
                        uploadStage={uploadStage}
                        selectedLibraryFileId={selectedLibraryFileId}
                        onLibrarySelect={handleLibrarySelect}
                        disabled={!isAdmin}
                      />
                    ) : (
                      <TextbookPreviewPanel
                        file={previewFile}
                        title={
                          textbookAsset?.name ??
                          effectiveTextbook?.fileName ??
                          'Current course PDF'
                        }
                        fileSizeBytes={
                          textbookAsset?.size ?? effectiveTextbook?.fileSizeBytes
                        }
                        localPreviewUrl={textbookThumbnail}
                        onReplace={handleReplaceTextbook}
                        onRemove={handleRemoveTextbook}
                        disabled={!isAdmin}
                      />
                    )}

                    {uploadStage !== 'idle' && effectiveTextbook ? (
                      <Box>
                        <LinearProgress sx={{ borderRadius: 999 }} />
                        <Typography variant="caption" color="text.secondary">
                          {uploadStage === 'preview'
                            ? 'Rendering preview…'
                            : 'Uploading to secure storage…'}
                        </Typography>
                      </Box>
                    ) : null}

                    <Typography variant="caption" color="text.secondary">
                      This PDF file is pinned to the course and available in the
                      Library tab immediately after creation.
                    </Typography>
                  </CardContent>

                  <input
                    type="hidden"
                    name="textbookKey"
                    value={effectiveTextbook?.key ?? ''}
                  />
                  <input
                    type="hidden"
                    name="textbookHash"
                    value={effectiveTextbook?.hash ?? ''}
                  />
                  <input
                    type="hidden"
                    name="textbookUrl"
                    value={effectiveTextbook?.url ?? ''}
                  />
                  <input
                    type="hidden"
                    name="textbookFileName"
                    value={effectiveTextbook?.fileName ?? ''}
                  />
                  <input
                    type="hidden"
                    name="textbookFileSizeBytes"
                    value={effectiveTextbook?.fileSizeBytes ?? ''}
                  />
                  <input
                    type="hidden"
                    name="textbookPreviewImageKey"
                    value={effectiveTextbook?.previewImageKey ?? ''}
                  />
                  <input
                    type="hidden"
                    name="textbookUploadedAt"
                    value={effectiveTextbook?.uploadedAt ?? ''}
                  />
                  <input
                    type="hidden"
                    name="textbookUploadedByUserId"
                    value={effectiveTextbook?.uploadedByUserId ?? ''}
                  />
                  {isEditMode && initialClassroom?.id ? (
                    <>
                      <input type="hidden" name="classroomId" value={initialClassroom.id} />
                      <input type="hidden" name="isAdmin" value={String(isAdmin)} />
                    </>
                  ) : null}
                </Card>
              </Box>

              <Box>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardHeader
                    title="Course Details"
                    subheader="Guide instructors through a consistent naming and enrollment experience."
                  />
                  <CardContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <TextField
                      label="Course name"
                      placeholder="e.g. 2025 Applied Maths Cohort"
                      key={name.key}
                      name={name.name}
                      defaultValue={name.initialValue}
                      error={!name.valid}
                      helperText={
                        name.errors?.join(', ') ||
                        'Visible everywhere this class is referenced across the platform.'
                      }
                      fullWidth
                      required
                    />

                    <FormControl fullWidth error={!teacherId.valid}>
                      <InputLabel id="teacher-select-label">
                        Primary instructor
                      </InputLabel>
                      <Select
                        labelId="teacher-select-label"
                        label="Primary instructor"
                        name={teacherId.name}
                        value={selectedTeacher}
                        onChange={(event) => setSelectedTeacher(event.target.value)}
                        disabled={usersLoading}
                      >
                        <MenuItem value="">Select instructor</MenuItem>
                        {usersLoading ? (
                          <MenuItem disabled>Loading instructors…</MenuItem>
                        ) : instructors.length > 0 ? (
                          instructors.map((t) => (
                            <MenuItem key={t.userId} value={t.userId}>
                              {t.firstName} {t.lastName}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No instructors available</MenuItem>
                        )}
                      </Select>
                      <FormHelperText>
                        {teacherId.errors?.[0] ||
                          'This educator becomes the default owner for homework and grading.'}
                      </FormHelperText>
                    </FormControl>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                      <FormControl fullWidth error={!academicLevelId.valid}>
                        <InputLabel id="academic-select-label">
                          Academic level
                        </InputLabel>
                        <Select
                          labelId="academic-select-label"
                          label="Academic level"
                          name={academicLevelId.name}
                          value={selectedAcademic}
                          onChange={handleAcademicSelect}
                          disabled={academicsLoading}
                        >
                          <MenuItem value="">Select level</MenuItem>
                          {academicsLoading ? (
                            <MenuItem disabled>Loading levels…</MenuItem>
                          ) : academicOptions.length > 0 ? (
                            academicOptions.map((level) => (
                              <MenuItem key={level.id} value={level.id}>
                                {level.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No academic levels yet</MenuItem>
                          )}
                          <MenuItem value={ADD_ACADEMIC}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <AddCircleOutlineIcon fontSize="small" />
                              <span>Add academic level</span>
                            </Stack>
                          </MenuItem>
                        </Select>
                        <FormHelperText>
                          {academicLevelId.errors?.[0] ||
                            'Grade, year, or program tier that owns this course.'}
                        </FormHelperText>
                      </FormControl>

                      <FormControl fullWidth error={!subjectId.valid}>
                        <InputLabel id="subject-select-label">Subject</InputLabel>
                        <Select
                          labelId="subject-select-label"
                          label="Subject"
                          name={subjectId.name}
                          value={selectedSubject}
                          onChange={handleSubjectSelect}
                          disabled={subjectsLoading}
                        >
                          <MenuItem value="">Select subject</MenuItem>
                          {subjectsLoading ? (
                            <MenuItem disabled>Loading subjects…</MenuItem>
                          ) : subjectOptions.length > 0 ? (
                            subjectOptions.map((subject) => (
                              <MenuItem key={subject.id} value={subject.id}>
                                {subject.name} — {subject.subjectCode}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No subjects available</MenuItem>
                          )}
                          <MenuItem value={ADD_SUBJECT}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <AddCircleOutlineIcon fontSize="small" />
                              <span>Create subject</span>
                            </Stack>
                          </MenuItem>
                        </Select>
                        <FormHelperText>
                          {subjectId.errors?.[0] ||
                            'Map resources and homework templates to this subject.'}
                        </FormHelperText>
                      </FormControl>
                    </Stack>

                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                      Need a new subject or academic level? Choose “Add” from any
                      dropdown to capture it inline—no context switching required.
                    </Alert>
                  </CardContent>
                </Card>
              </Box>
            </FormLayout>
          </Box>

          <CreateSubjectModal
            open={subjectModalOpen}
            handleClose={() => setSubjectModalOpen(false)}
            onCreated={handleSubjectCreated}
          />

          <CreateAcademicsModal
            open={academicModalOpen}
            handleClose={() => setAcademicModalOpen(false)}
            onCreated={handleAcademicCreated}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="warning"
          onClick={() => onCancel?.()}
          disabled={pending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form={formId}
          variant="contained"
          loading={pending}
          disabled={!canSubmit || !isAdmin}
        >
          {getSubmitButtonLabel(isEditMode)}
        </Button>
      </DialogActions>
    </>
  );
}
