import Joi from "joi";

const brandSchema = Joi.object({
   id: Joi.number(),
   product_ascii: Joi.string().required(),
   category_attribute_id: Joi.number().required(),
   value: Joi.string().required(),
});

export default brandSchema;
