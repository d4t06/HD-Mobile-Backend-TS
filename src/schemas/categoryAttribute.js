"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const categoryAttributeSchema = joi_1.default.object({
    id: joi_1.default.number(),
    attribute: joi_1.default.string().required(),
    attribute_ascii: joi_1.default.string().required(),
    category_id: joi_1.default.number().required(),
});
exports.default = categoryAttributeSchema;
