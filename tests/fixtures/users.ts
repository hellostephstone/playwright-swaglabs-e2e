// Swag Labs usernames (same password for all users)

type Credentials = { username: string; password: string };

const PASSWORD = process.env.E2E_PASSWORD ?? 'secret_sauce';
const u = (username: string): Credentials => ({ username, password: PASSWORD });

export const users = {
  standard: u(process.env.E2E_USERNAME ?? 'standard_user'),
  lockedOut: u('locked_out_user'),
  problemUser: u('problem_user'),
  performanceGlitchUser: u('performance_glitch_user'),
  errorUser: u('error_user'),
  visualUser: u('visual_user'),
};
