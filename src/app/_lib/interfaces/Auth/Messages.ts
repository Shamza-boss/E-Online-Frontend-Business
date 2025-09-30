export const Messages = {
  success: {
    login: (name: string) => `Welcome ${name}! 🎉`,
    signup: `Account created successfully! You can now log in. 🚀`,
    logout: `You have been logged out successfully.`,
    googleSignup: `Account created successfully! 🚀`,
  },
  error: {
    unauthorized:
      "Sorry, you don't have access 🥺. Contact your administrator.",
    internalServerError: 'Something went wrong! Please try again later.',
    generic: 'An unexpected error occurred. Please try again.',
    validation: 'Please ensure all fields are filled correctly.',
  },
  info: {
    loading: 'Loading, please wait...',
    sessionExpired: 'Your session has expired. Please sign in again.',
  },
};
