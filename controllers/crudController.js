const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/http');

function createCrudController(service, options = {}) {
  const {
    idParam = 'id',
    createStatusCode = 201,
  } = options;

  return {
    create: asyncHandler(async (req, res) => {
      const entity = await service.create(req.body);
      sendSuccess(res, entity, createStatusCode);
    }),

    list: asyncHandler(async (req, res) => {
      const entities = await service.list();
      sendSuccess(res, entities);
    }),

    getById: asyncHandler(async (req, res) => {
      const entity = await service.getById(req.params[idParam]);
      sendSuccess(res, entity);
    }),

    update: asyncHandler(async (req, res) => {
      const entity = await service.updateById(req.params[idParam], req.body);
      sendSuccess(res, entity);
    }),

    remove: asyncHandler(async (req, res) => {
      const entity = await service.deleteById(req.params[idParam]);
      sendSuccess(res, entity);
    }),
  };
}

module.exports = createCrudController;
