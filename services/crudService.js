const AppError = require('../utils/appError');

function createCrudService(model, options = {}) {
  const {
    idField = model.primaryKeyAttribute || 'id',
    entityLabel = 'Ressource',
    defaultOrder = [[idField, 'DESC']],
  } = options;

  function buildNotFoundError() {
    return new AppError(`${entityLabel} non trouvé`, 404);
  }

  return {
    async create(payload) {
      return model.create(payload);
    },

    async list(queryOptions = {}) {
      return model.findAll({
        order: defaultOrder,
        ...queryOptions,
      });
    },

    async getById(id, queryOptions = {}) {
      const entity = await model.findByPk(id, queryOptions);

      if (!entity) {
        throw buildNotFoundError();
      }

      return entity;
    },

    async updateById(id, payload) {
      const entity = await this.getById(id);
      await entity.update(payload);
      return entity;
    },

    async deleteById(id) {
      const entity = await this.getById(id);
      await entity.destroy();
      return entity;
    },
  };
}

module.exports = createCrudService;
