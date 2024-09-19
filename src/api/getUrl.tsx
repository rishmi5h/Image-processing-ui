export const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://imagery.up.railway.app';

export const getUrl = (path: string) => {
  return `${baseUrl}${path}`;
};
