export const MATHJAX_CONFIG = {
  tex: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
  },
  loader: { load: ['input/tex', 'output/chtml'] },
};
