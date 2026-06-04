export default {
  register(app: any) {
    app.customFields.register({
      name: 'blocknote',
      pluginId: 'cms-editor',
      type: 'richtext',
      intlLabel: {
        id: 'cms-editor.blocknote.label',
        defaultMessage: 'BlockNote Editor',
      },
      intlDescription: {
        id: 'cms-editor.blocknote.description',
        defaultMessage: 'Notion-style rich text editor',
      },
      components: {
        Input: async () =>
          import('./components/BlockNoteEditor').then((m) => ({
            default: m.default,
          })),
      },
    });
  },
};
