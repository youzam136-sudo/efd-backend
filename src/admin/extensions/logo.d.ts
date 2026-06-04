declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.css?inline' {
  const content: string;
  export default content;
}
