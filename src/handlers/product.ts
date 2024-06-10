import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import productSchema from "../schemas/product";
import ObjectNotFound from "../errors/ObjectNotFound";
import Product from "../models/product";
import Description from "../models/description";
import DefaultProductVariant from "../models/defaultProductVariant";
import Variant from "../models/variant";
import DefaultVariantCombine from "../models/defaultVariantCombine";
import Category from "../models/category";
import CategoryAttribute from "../models/categoryAttribute";
import Color from "../models/color";
import ProductSlider from "../models/productSlider";
import Slider from "../models/slider";
import Image from "../models/image";
import SliderImage from "../models/sliderImage";
import Combine from "../models/combine";
import { Filterable, FindOptions, InferAttributes, Op } from "sequelize";
import { Sort } from "../types/type";
import { generateId } from "../system/helper";

const PAGE_SIZE = 1;

interface Query  {
   page: number;
   category_id: number;
   brand_id: number[];
};

class priceRangeHandler {
   async findAll(req: Request<{}, {}, {}, Query>, res: Response, next: NextFunction) {
      try {
         const query = req.query;
         const { page = 1, brand_id, category_id } = query;
         const sort = res.locals.sort as Sort;

         const where: Filterable<InferAttributes<Product, { omit: never }>>["where"] = {};
         const order: FindOptions<InferAttributes<Product, { omit: never }>>["order"] =
            [];

         if (category_id) where.category_id = category_id;
         if (brand_id)
            where.brand_id = {
               [Op.in]: brand_id,
            };
         if (sort.enable) {
            if (sort.column === "price") {
               order.push([
                  { model: DefaultProductVariant, as: "default_variant" },
                  {
                     model: Variant,
                     as: "variant",
                  },
                  {
                     model: DefaultVariantCombine,
                     as: "default_combine",
                  },
                  {
                     model: Combine,
                     as: "combine",
                  },
                  sort.column,
                  sort.type,
               ]);
            }
         }

         const { count, rows } = await Product.findAndCountAll({
            offset: (+page - 1) * PAGE_SIZE,
            limit: PAGE_SIZE,
            distinct: true,
            include: [
               {
                  model: DefaultProductVariant,
                  as: "default_variant",
                  include: [
                     {
                        model: Variant,
                        as: "variant",
                        include: [
                           {
                              model: DefaultVariantCombine,
                              as: "default_combine",
                              include: [
                                 {
                                    model: Combine,
                                    as: "combine",
                                 },
                              ],
                           },
                        ],
                     },
                  ],
               },
               {
                  model: Variant,
                  as: "variants",
                  include: [
                     {
                        model: DefaultVariantCombine,
                        as: "default_combine",
                        include: [
                           {
                              model: Combine,
                              as: "combine",
                           },
                        ],
                     },
                  ],
               },
            ],
            order,
            where,
         });

         console.log("check sort", sort);

         return myResponse(res, true, "get all product successful", 200, {
            products: rows,
            count,
            pageSize: PAGE_SIZE,
            sort: sort.enable,
            category_id: +category_id || null,
            brand_id: brand_id?.length ? brand_id : null,
            column: sort.enable ? sort.column : null,
            type: sort.enable ? sort.type : null,
         });
      } catch (error) {
         next(error);
      }
   }

   async findOne(
      req: Request<{ productAscii: string }>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const { productAscii } = req.params;

         const product = await Product.findByPk(productAscii, {
            include: [
               {
                  model: Category,
                  as: "category",
                  include: [
                     {
                        model: CategoryAttribute,
                        as: "attributes",
                     },
                  ],
               },
               {
                  model: Variant,
                  as: "variants",
                  include: [
                     {
                        model: DefaultVariantCombine,
                        as: "default_combine",
                     },
                  ],
               },
               Product.associations.default_variant,
               Product.associations.combines,
               {
                  model: Color,
                  as: "colors",
                  include: [
                     {
                        model: ProductSlider,
                        as: "product_slider",
                        include: [
                           {
                              model: Slider,
                              as: "slider",
                              include: [
                                 {
                                    model: SliderImage,
                                    as: "slider_images",
                                    include: [
                                       {
                                          model: Image,
                                          as: "image",
                                       },
                                    ],
                                 },
                              ],
                           },
                        ],
                     },
                  ],
               },
               Product.associations.attributes,
               Product.associations.description,
            ],
         });

         return myResponse(res, true, "get product successful", 200, product);
      } catch (error) {
         next(error);
      }
   }

   async add(req: Request, res: Response, next: NextFunction) {
      try {
         const body = req.body;
         const value = productSchema.validate(body);

         if (value.error) throw new BadRequest(value.error.message);
         const newProduct = await Product.create(body);

         await new Description({
            content: newProduct.product,
            product_ascii: newProduct.product_ascii,
         }).save();

         await new DefaultProductVariant({
            product_ascii: newProduct.product_ascii,
         }).save();

         return myResponse(res, true, "add product successful", 200, newProduct);
      } catch (error) {
         next(error);
      }
   }

   async update(
      req: Request<{ productAscii: string }>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const { productAscii } = req.params;
         const body = req.body;
         // const value = productSchema.validate(body);

         const item = await Product.findByPk(productAscii);
         if (!item) throw new ObjectNotFound("");

         // if (value.error) throw new BadRequest(value.error.message);
         await item.update(body);

         return myResponse(res, true, "update product successful", 200);
      } catch (error) {
         next(error);
      }
   }

   async search(
      req: Request<{}, {}, {}, { q: string }>,
      res: Response,
      next: NextFunction
   ) {
      const { q } = req.query;

      const products = await Product.findAll({
         limit: 20,
         include: [
            {
               model: DefaultProductVariant,
               as: "default_variant",
               include: [
                  {
                     model: Variant,
                     as: "variant",
                     include: [
                        {
                           model: DefaultVariantCombine,
                           as: "default_combine",
                           include: [
                              {
                                 model: Combine,
                                 as: "combine",
                              },
                           ],
                        },
                     ],
                  },
               ],
            },
         ],
         where: {
            product_ascii: { [Op.like]: `${generateId(q)}%` },
         },
      });

      return myResponse(res, true, "search successful", 200, products);
   }

   async delete(
      req: Request<{ productAscii: string }>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const { productAscii } = req.params;

         const item = await Product.findByPk(productAscii);
         if (!item) throw new ObjectNotFound("");

         item.destroy();

         return myResponse(res, true, "delete price range successful", 200);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }
}

export default new priceRangeHandler();
