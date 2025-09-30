'use client';

import React from 'react';
import { Typography } from '@mui/material';
import { RichTextAnswer } from './RichTextAnswer';
import { Question } from '../../interfaces/types';
import dynamic from 'next/dynamic';

const MathJax = dynamic(
  () => import('better-react-mathjax').then((mod) => mod.MathJax),
  { ssr: false }
);

interface RenderAnswerProps {
  question: Question;
  answer: any;
}

const RenderAnswer: React.FC<RenderAnswerProps> = ({ question, answer }) => {
  switch (question.type) {
    case 'math-block':
      return (
        <RichTextAnswer
          value={answer || ''}
          onChange={() => {}}
          readOnly={true}
        />
      );
    case 'rich-text':
      return (
        <RichTextAnswer
          value={answer || ''}
          onChange={() => {}}
          readOnly={true}
        />
      );
    case 'radio':
      return <Typography variant="body2">{answer || ''}</Typography>;
    case 'multi-select':
      return (
        <Typography variant="body2">
          {Array.isArray(answer) ? answer.join(', ') : answer}
        </Typography>
      );
    case 'text':
    default:
      // Determine whether the answer contains HTML tags.
      const isHTML = /<\/?[a-z][\s\S]*>/i.test(answer || '');
      if (isHTML) {
        // Render the HTML answer, preserving its HTML properties.
        return (
          <div
            dangerouslySetInnerHTML={{ __html: answer }}
            style={{
              pointerEvents: 'none',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        );
      } else {
        // Render pure text wrapped in a disabled paragraph block.
        return (
          <p
            style={{
              pointerEvents: 'none',
              margin: 0,
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            {answer}
          </p>
        );
      }
  }
};

export default RenderAnswer;
