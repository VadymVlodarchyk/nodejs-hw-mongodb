import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().allow('', null),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});
