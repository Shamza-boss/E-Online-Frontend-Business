// Export all homework-related utilities and components for easy importing
export {
  computeQuestionTotals,
  calculateHomeworkTotals,
  getPercentageColor,
} from '../utils/gradeCalculator';

export { PercentageCell } from '../components/homework/PercentageCell';
export { GradeCell } from '../components/homework/GradeCell';
export { VideoPlayer } from '../components/video/VideoPlayer';
export { VideoUploadField } from '../components/video/VideoUploadField';
export { default as VideoCardThumbnail } from '../components/video/VideoCardThumbnail';

// Export stream actions
export {
  createDirectUpload,
  getVideoMeta,
  signPlayback,
} from '../actions/stream';
