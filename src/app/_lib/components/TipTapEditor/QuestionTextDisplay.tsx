'use client';

import React, { Fragment, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { Box, Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import ExcalidrawStaticPreview from '../Excalidraw/ExcalidrawStaticPreview';

interface QuestionTextDisplayProps {
  content?: string | null;
  fallback?: string;
  variant?: TypographyProps['variant'];
  fontWeight?: TypographyProps['fontWeight'];
  color?: TypographyProps['color'];
  fallbackColor?: TypographyProps['color'];
  component?: TypographyProps['component'];
  sx?: SxProps<Theme>;
  showExcalidrawModalTrigger?: boolean;
}

const defaultBlockStyles: SxProps<Theme> = {
  '& p': {
    margin: 0,
  },
  '& p + p': {
    marginTop: 1,
  },
  '& ul, & ol': {
    margin: 0,
    paddingLeft: 3,
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    marginTop: 2,
    marginBottom: 1,
  },
  '& h1:first-of-type, & h2:first-of-type, & h3:first-of-type, & h4:first-of-type, & h5:first-of-type, & h6:first-of-type':
    {
      marginTop: 0,
    },
};

const QuestionTextDisplay: React.FC<QuestionTextDisplayProps> = ({
  content,
  fallback = 'Untitled question',
  variant = 'body1',
  fontWeight,
  color,
  fallbackColor = 'text.secondary',
  component = 'div',
  sx,
  showExcalidrawModalTrigger = true,
}) => {
  const html = useMemo(() => (content ?? '').trim(), [content]);
  const canParse =
    typeof window !== 'undefined' && typeof DOMParser !== 'undefined';

  const parsedContent = useMemo(() => {
    if (!html) {
      return { kind: 'empty' } as const;
    }

    if (!canParse) {
      return { kind: 'raw', html } as const;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const styleStringToObject = (styleValue: string): CSSProperties => {
        const styleObject: CSSProperties = {};
        styleValue
          .split(';')
          .map((declaration) => declaration.trim())
          .filter(Boolean)
          .forEach((declaration) => {
            const [property, value] = declaration.split(':');
            if (!property || !value) return;
            const normalizedValue = value.replace(/!important/g, '').trim();
            if (!normalizedValue) return;
            const camelCaseProperty = property
              .trim()
              .toLowerCase()
              .replace(/-([a-z])/g, (_, char) => char.toUpperCase());
            (styleObject as Record<string, string>)[camelCaseProperty] =
              normalizedValue;
          });
        return styleObject;
      };

      const renderNode = (node: ChildNode, key: string): React.ReactNode => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent ?? '';
          if (!text) return null;
          return <Fragment key={key}>{text}</Fragment>;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
          return null;
        }

        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();

        if (tagName === 'excali-block') {
          const dataAttr = element.getAttribute('data');
          return (
            <Box key={key} sx={{ my: 1.5 }}>
              <ExcalidrawStaticPreview
                data={dataAttr}
                showModalTrigger={showExcalidrawModalTrigger}
              />
            </Box>
          );
        }

        const props: Record<string, unknown> = { key };

        Array.from(element.attributes).forEach((attr) => {
          const name = attr.name.toLowerCase();
          const { value } = attr;

          if (!value) return;

          switch (name) {
            case 'class':
              props.className = attr.value;
              break;
            case 'style':
              props.style = styleStringToObject(attr.value);
              break;
            case 'colspan':
              props.colSpan = Number(attr.value) || undefined;
              break;
            case 'rowspan':
              props.rowSpan = Number(attr.value) || undefined;
              break;
            case 'cellpadding':
              props.cellPadding = attr.value;
              break;
            case 'cellspacing':
              props.cellSpacing = attr.value;
              break;
            default:
              (props as Record<string, string>)[attr.name] = attr.value;
          }
        });

        const children = Array.from(element.childNodes)
          .map((child, index) => renderNode(child, `${key}-${index}`))
          .filter(
            (child): child is React.ReactNode =>
              child !== null && child !== undefined
          );

        if (children.length === 0) {
          return React.createElement(tagName, props);
        }

        return React.createElement(tagName, props, ...children);
      };

      const nodes = Array.from(doc.body.childNodes)
        .map((child, index) => renderNode(child, `node-${index}`))
        .filter(
          (child): child is React.ReactNode =>
            child !== null && child !== undefined
        );

      return { kind: 'nodes', nodes } as const;
    } catch (error) {
      console.error('Failed to parse question content', error);
      return { kind: 'raw', html } as const;
    }
  }, [html, canParse, showExcalidrawModalTrigger]);

  if (!html) {
    return (
      <Typography
        variant={variant}
        fontWeight={fontWeight}
        color={color ?? fallbackColor}
        component={component}
        sx={sx}
      >
        {fallback}
      </Typography>
    );
  }

  return (
    <Typography
      component={component}
      variant={variant}
      fontWeight={fontWeight}
      color={color}
      sx={sx}
    >
      <Box sx={defaultBlockStyles}>
        {parsedContent.kind === 'nodes' ? (
          parsedContent.nodes
        ) : parsedContent.kind === 'raw' ? (
          <Box
            component="div"
            dangerouslySetInnerHTML={{ __html: parsedContent.html }}
          />
        ) : null}
      </Box>
    </Typography>
  );
};

export default QuestionTextDisplay;
