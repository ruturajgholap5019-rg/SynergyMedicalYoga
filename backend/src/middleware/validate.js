const AppError = require('../utils/AppError');

exports.validate = (schema) => {
  return (req, res, next) => {
    if (schema.safeParse) {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const message = result.error.issues.map((issue) => issue.message).join(', ');
        return next(new AppError(message, 400));
      }
      req.body = result.data;
      return next();
    }

    if (schema.validate) {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        return next(new AppError(error.details.map((detail) => detail.message).join(', '), 400));
      }
      req.body = value;
      return next();
    }

    return next(new AppError('Invalid validation schema configuration.', 500));
  };
};
