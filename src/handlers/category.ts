import { NextFunction, Request, Response } from "express";
// import ObjectNotFound from "../errors/ObjectNotFound";
import Category from "../models/category";
import Image from "../models/image";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import Brand from "../models/brand";
import ObjectNotFound from "../errors/ObjectNotFound";
import CategoryAttribute from "../models/categoryAttribute";
import PriceRange from "../models/priceRange";
import CategorySlider from "../models/categorySlider";
import Slider from "../models/slider";
import SliderImage from "../models/sliderImage";
import sliderImage from "./sliderImage";
import categorySchema from "../schemas/category";

class categoryHandler {
   async findAll(_req: Request, res: Response, next: NextFunction) {
      try {
         const categories = await Category.findAll({
            include: [
               Category.associations.brands,
               Category.associations.attributes,
               Category.associations.price_ranges,
               {
                  model: CategorySlider,
                  as: "category_slider",
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
         });

         return myResponse(res, true, "get all categories", 200, categories);
      } catch (error) {
         next(error);
      }
   }

   async add(req: Request<{}, {}, Category>, res: Response, next: NextFunction) {
      try {
         const body = req.body;
         const value = categorySchema.validate(body);

         if (value.error) throw new BadRequest(value.error.message);
         // create category
         const category = await Category.create(body);

         // create slider
         const slider = await Slider.create({
            name: `slider for ${category.category_ascii}`,
         });

         await CategorySlider.create({
            category_id: category.id,
            slider_id: slider.id,
         });

         const newCategory = await Category.findByPk(category.id, {
            include: [
               Category.associations.brands,
               Category.associations.attributes,
               Category.associations.price_ranges,
               {
                  model: CategorySlider,
                  as: "category_slider",
                  include: [
                     {
                        model: Slider,
                        as: "slider",
                        include: [
                           {
                              model: SliderImage,
                              as: "slider_images",
                           },
                        ],
                     },
                  ],
               },
            ],
         });

         return myResponse(res, true, "add category successful", 200, newCategory);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }

   async update(
      req: Request<{ id: number }, {}, Category>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const body = req.body;
         const { id } = req.params;

         const value = categorySchema.validate(body);
         if (value.error) throw new BadRequest(value.error.message);

         const item = await Category.findByPk(id);

         if (!item) throw new ObjectNotFound("");

         await item.update(body);

         Object.assign(item, body);

         return myResponse(res, true, "update category successful", 200, item);
      } catch (error) {
         next(error);
      }
   }

   async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;
         const category = await Category.findByPk(+id, {
            include: [
               {
                  model: CategorySlider,
                  as: "category_slider",
                  include: [
                     {
                        model: Slider,
                        as: "slider",
                     },
                  ],
               },
            ],
         });
         if (!category) throw new ObjectNotFound("");

         await Category.destroy({ where: { id: category.id } });

         await Slider.destroy({
            where: {
               id: category.category_slider.slider.id,
            },
         });

         return myResponse(res, true, "delete category successful", 200);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }
}

export default new categoryHandler();
