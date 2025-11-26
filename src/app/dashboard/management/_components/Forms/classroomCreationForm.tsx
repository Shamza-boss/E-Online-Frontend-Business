'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from '@mui/material';
import { useForm, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';
import useSWR from 'swr';

import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import {
  UserDto,
  AcademicLevelDto,
  SubjectDto,
} from '@/app/_lib/interfaces/types';
import { classroomSchema } from '@/app/_lib/schemas/management';
import { SubmitClassroom } from './submitClassroom';
import { getAllAcademics } from '@/app/_lib/actions/academics';
import { getAllSubjects } from '@/app/_lib/actions/subjects';
import { getUsers } from '@/app/_lib/actions/users';
import { PagedResult } from '@/app/_lib/interfaces/pagination';
import { uploadTextbook } from '@/app/_lib/services/storageUpload';

const steps = ['Textbook Upload', 'Classroom Details'];

export default function ClassroomCreationStepper() {
  const { showAlert } = useAlert();
  const { data: academics, isLoading: academicsLoading } = useSWR<
    AcademicLevelDto[]
  >('academics', getAllAcademics, { revalidateOnMount: true });
  const { data: subjects, isLoading: subjectsLoading } = useSWR<SubjectDto[]>(
    'subjects',
    getAllSubjects,
    { revalidateOnMount: true }
  );
  const { data: usersResult, isLoading: usersLoading } = useSWR<
    PagedResult<UserDto>
  >(
    ['users', 'instructors'],
    () =>
      getUsers({
        pageNumber: 1,
        pageSize: 100,
        sortBy: 'lastName',
        sortDirection: 'asc',
      }),
    { revalidateOnMount: false }
  );

  // Conform form setup
  const [lastResult, action, pending] = useActionState(SubmitClassroom, false);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: classroomSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });
  const { name, teacherId, academicLevelId, subjectId } = fields;

  useEffect(() => {
    if (lastResult) {
      showAlert(
        'success',
        `The ${lastResult.name} classroom was successfully created 🚀!`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult]);

  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const [uploading, setUploading] = useState(false);

  // ◀︎ NEW state for the four upload-result fields ▶︎
  const [textbookKey, setTextbookKey] = useState('');
  const [textbookHash, setTextbookHash] = useState('');
  const [textbookProxyDownload, setTextbookProxyDownload] = useState('');
  const [textbookPresignedGet, setTextbookPresignedGet] = useState('');

  // Filter only trainers
  const teachers =
    usersResult?.items.filter((u) => u.role === UserRole.Instructor) ?? [];

  // handle file selection & upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { key, proxyDownload, presignedGet, hash } =
        await uploadTextbook(file);

      // stash them in state…
      setTextbookKey(key);
      setTextbookHash(hash);
      setTextbookProxyDownload(proxyDownload);
      setTextbookPresignedGet(presignedGet);

      // …and advance to step 2
      setActiveStep(1);
    } catch (err) {
      console.error(err);
      showAlert('error', 'Failed to upload textbook. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="contained" component="label" disabled={uploading}>
            {uploading ? 'Uploading…' : 'Select Textbook PDF'}
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {uploading && (
            <Box sx={{ mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </Box>
      )}

      {activeStep === 1 && (
        <Box
          component="form"
          {...getFormProps(form)}
          action={action}
          sx={{ mt: 4 }}
        >
          {/* Hidden fields for your textbook data */}

          <input type="hidden" name="textbookKey" value={textbookKey} />
          <input type="hidden" name="textbookHash" value={textbookHash} />
          <input
            type="hidden"
            name="textbookUrl"
            value={textbookProxyDownload}
          />

          {/* Classroom Name */}
          <TextField
            placeholder="Course Name"
            key={name.key}
            name={name.name}
            defaultValue={name.initialValue}
            error={!name.valid}
            helperText={name.errors?.join(', ')}
            fullWidth
            margin="normal"
          />

          {/* Teacher Select */}
          <FormControl fullWidth error={!teacherId.valid} margin="normal">
            <InputLabel>Instructor</InputLabel>
            <Select
              key={teacherId.key}
              name={teacherId.name}
              defaultValue={`${teacherId.initialValue || ''}`}
              disabled={usersLoading}
            >
              {usersLoading ? (
                <MenuItem disabled>Getting instructors…</MenuItem>
              ) : teachers.length > 0 ? (
                teachers.map((t) => (
                  <MenuItem key={t.userId} value={t.userId}>
                    {t.firstName} {t.lastName}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No instructors found</MenuItem>
              )}
            </Select>
            <FormHelperText>{teacherId.errors?.[0] ?? ''}</FormHelperText>
          </FormControl>

          {/* Academic Level */}
          <FormControl fullWidth error={!academicLevelId.valid} margin="normal">
            <InputLabel>Academic Level</InputLabel>
            <Select
              key={academicLevelId.key}
              name={academicLevelId.name}
              defaultValue={`${academicLevelId.initialValue || ''}`}
              disabled={academicsLoading}
            >
              {academicsLoading ? (
                <MenuItem disabled>Loading…</MenuItem>
              ) : academics && academics.length > 0 ? (
                academics.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No academic levels</MenuItem>
              )}
            </Select>
            <FormHelperText>{academicLevelId.errors?.[0] ?? ''}</FormHelperText>
          </FormControl>

          {/* Subject */}
          <FormControl fullWidth error={!subjectId.valid} margin="normal">
            <InputLabel>Subject</InputLabel>
            <Select
              key={subjectId.key}
              name={subjectId.name}
              defaultValue={`${subjectId.initialValue || ''}`}
              disabled={subjectsLoading}
            >
              {subjectsLoading ? (
                <MenuItem disabled>Getting subjects...</MenuItem>
              ) : subjects && subjects.length > 0 ? (
                subjects.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name} — {s.subjectCode}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No subjects found</MenuItem>
              )}
            </Select>
            <FormHelperText>{subjectId.errors?.[0] ?? ''}</FormHelperText>
          </FormControl>

          {/* Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 3,
            }}
          >
            <Button onClick={() => setActiveStep(0)}>Back</Button>
            <Button type="submit" variant="contained" disabled={pending}>
              {pending ? 'Saving…' : 'Save course'}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
