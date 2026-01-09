let csrfTokenMemory: string | null = null;

export const setCsrfTokenGlobal = (token: string) => {
  csrfTokenMemory = token;
};

export const getCsrfTokenGlobal = () => csrfTokenMemory;
