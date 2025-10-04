'use client';

import React from 'react';
import { Typography, Box } from '@mui/material';
import { RichTextAnswer } from './RichTextAnswer';
import { Question } from '../../interfaces/types';
import { VideoPlayer } from '../video/VideoPlayer';

interface RenderAnswerProps {
  question: Question;
  answer: any;
}

const RenderAnswer: React.FC<RenderAnswerProps> = ({ question, answer }) => {
  switch (question.type) {
    case 'video':
      return (
        <Box>
          {/* Always render video, regardless of context */}
          {question.video && (
            <VideoPlayer video={question.video} title={question.questionText} />
          )}
          {/* Video questions don't have direct answers - they contain subquestions */}
          {question.subquestions && question.subquestions.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              This video section contains {question.subquestions.length}{' '}
              questions
            </Typography>
          )}
        </Box>
      );
    case 'radio':
      return <Typography variant="body2">{answer || ''}</Typography>;
    case 'multi-select':
      return (
        <Typography variant="body2">
          {Array.isArray(answer) ? answer.join(', ') : answer}
        </Typography>
      );
    default:
      return (
        <Typography variant="body2">
          {answer || 'No answer provided'}
        </Typography>
      );
  }
};

export default RenderAnswer;
