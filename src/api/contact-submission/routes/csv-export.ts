export default {
  routes: [
    {
      method: 'GET',
      path: '/contact-submissions/export/csv',
      handler: 'csv-export.exportCsv',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
  ],
};
