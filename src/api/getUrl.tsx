export const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://api.example.com';

export const getUrl = (path: string) => {
  return `${baseUrl}${path}`;
};
