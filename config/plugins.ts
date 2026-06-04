export default () => ({
  'strapi-tiptap-editor': {
    enabled: false,
  },
  'cms-editor': {
    enabled: true,
    resolve: './src/plugins/cms-editor',
  },
});
