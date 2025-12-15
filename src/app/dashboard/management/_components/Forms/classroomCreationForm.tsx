'use client';

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
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
import LoadingButton from '@mui/lab/LoadingButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ReplayIcon from '@mui/icons-material/Replay';
import { useForm, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';

import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { AcademicLevelDto, SubjectDto } from '@/app/_lib/interfaces/types';
import { classroomSchema } from '@/app/_lib/schemas/management';
import { SubmitClassroom } from './submitClassroom';
import CreateSubjectModal from '../Modals/CreateSubjectModal';
import CreateAcademicsModal from '../Modals/CreateAcademicsModal';
import { useAssetUpload } from '@/app/_lib/hooks/useAssetUpload';
import { useClassroomLookups } from '../hooks/useClassroomLookups';

const ADD_SUBJECT = '__add_subject';
const ADD_ACADEMIC = '__add_academic';

interface ClassroomCreationFormProps {
  formId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function formatFileSize(bytes: number): string {
  if (!bytes) return '0 KB';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export default function ClassroomCreationForm({
  formId = 'create-classroom-form',
  onSuccess,
  onCancel,
}: ClassroomCreationFormProps) {
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

  const [lastResult, action, pending] = useActionState(SubmitClassroom, false);
  const [form, fields] = useForm({
    id: formId,
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: classroomSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });
  const formProps = getFormProps(form);
  const { name, teacherId, academicLevelId, subjectId } = fields;

  const [selectedTeacher, setSelectedTeacher] = useState(
    () => `${teacherId.initialValue ?? ''}`
  );
  const [selectedAcademic, setSelectedAcademic] = useState(
    () => `${academicLevelId.initialValue ?? ''}`
  );
  const [selectedSubject, setSelectedSubject] = useState(
    () => `${subjectId.initialValue ?? ''}`
  );

  useEffect(() => {
    if (lastResult && (lastResult as any)?.name) {
      showAlert(
        'success',
        `The ${(lastResult as any).name} classroom was successfully created 🚀!`
      );
      onSuccess?.();
    }
  }, [lastResult, onSuccess, showAlert]);

  const {
    asset: textbookAsset,
    preview: textbookThumbnail,
    stage: uploadStage,
    handleInputChange: handleTextbookInputChange,
    removeAsset: removeTextbookAsset,
  } = useAssetUpload({
    accept: ['application/pdf'],
    maxSizeMb: 100,
    autoUpload: true,
    onUploaded: () =>
      showAlert('success', 'PDF uploaded and ready to attach.'),
    onError: (error) =>
      showAlert('error', error.message || 'Unable to upload textbook.'),
  });

  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [academicModalOpen, setAcademicModalOpen] = useState(false);

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

  const canSubmit = Boolean(textbookAsset);

  return (
    <>
      <DialogContent dividers sx={{ padding: 0 }}>
        <Stack spacing={1} sx={{ width: '100%', p: 1 }}>
          <Alert severity="info">
            Upload a single PDF textbook, confirm the course owner, and
            populate subjects or academic levels inline without leaving this
            screen.
          </Alert>

          <Box component="form" {...formProps} action={action} noValidate>
            <Box
              sx={{
                display: 'grid',
                gap: 1,
                gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
                alignItems: 'stretch',
              }}
            >
              <Box>
                <Card
                  sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <CardHeader
                    title="Course Textbook"
                    subheader="Upload a PDF students can preview before every module"
                  />
                  <CardContent
                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <input
                      ref={fileInputRef}
                      hidden
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />

                    {!textbookAsset ? (
                      <Box
                        onClick={handleUploadClick}
                        role="button"
                        tabIndex={0}
                        sx={{
                          border: '1px dashed',
                          borderColor: 'divider',
                          borderRadius: 3,
                          p: 1,
                          textAlign: 'center',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CloudUploadIcon fontSize="large" color="primary" />
                        <Typography variant="h6">Click to upload PDF</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Upload a single PDF up to 100MB.
                        </Typography>
                      </Box>
                    ) : (
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar variant="rounded">
                            <PictureAsPdfIcon />
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>
                              {textbookAsset.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatFileSize(textbookAsset.size)}
                            </Typography>
                          </Box>
                          <Chip
                            color="success"
                            icon={<CheckCircleOutlineIcon />}
                            label="Ready"
                            size="small"
                            sx={{ ml: 'auto' }}
                          />
                        </Stack>

                        {textbookThumbnail && (
                          <Box
                            component="img"
                            src={textbookThumbnail}
                            alt="PDF preview"
                            sx={{
                              width: '100%',
                              borderRadius: 2,
                              boxShadow: 3,
                              objectFit: 'cover',
                            }}
                          />
                        )}

                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={handleUploadClick}
                            startIcon={<ReplayIcon />}
                          >
                            Replace PDF
                          </Button>
                          <Button
                            variant="text"
                            size="small"
                            color="error"
                            onClick={removeTextbookAsset}
                          >
                            Remove
                          </Button>
                        </Stack>
                      </Stack>
                    )}

                    {uploadStage !== 'idle' && (
                      <Box>
                        <LinearProgress sx={{ borderRadius: 999 }} />
                        <Typography variant="caption" color="text.secondary">
                          {uploadStage === 'preview'
                            ? 'Rendering preview…'
                            : 'Uploading to secure storage…'}
                        </Typography>
                      </Box>
                    )}

                    <Typography variant="caption" color="text.secondary">
                      This PDF file is pinned to the course and available in the
                      Library tab immediately after creation.
                    </Typography>
                  </CardContent>

                  <input
                    type="hidden"
                    name="textbookKey"
                    value={textbookAsset?.key ?? ''}
                  />
                  <input
                    type="hidden"
                    name="textbookHash"
                    value={textbookAsset?.hash ?? ''}
                  />
                  <input
                    type="hidden"
                    name="textbookUrl"
                    value={textbookAsset?.proxyDownload ?? ''}
                  />
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
            </Box>
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
          disabled={!canSubmit}
        >
          Create course
        </Button>
      </DialogActions>
    </>
  );
}
