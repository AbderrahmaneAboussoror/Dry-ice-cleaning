// This file is used to declare module paths for TypeScript
// It allows TypeScript to understand the @/* import alias

declare module "@/*" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any;
  export default value;
}
