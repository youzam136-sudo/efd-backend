'use strict';

module.exports = {
  register({ strapi }) {
    strapi.customFields.register({
      name: 'blocknote',
      plugin: 'cms-editor',
      type: 'richtext',
    });
  },
  bootstrap() {},
};
