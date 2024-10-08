"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const myResponse_1 = __importDefault(require("../system/myResponse"));
const BadRequest_1 = __importDefault(require("../errors/BadRequest"));
const categoryAttribute_1 = __importDefault(require("../schemas/categoryAttribute"));
const ObjectNotFound_1 = __importDefault(require("../errors/ObjectNotFound"));
const categoryAttribute_2 = __importDefault(require("../models/categoryAttribute"));
class categoryAttributeHandler {
    add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const value = categoryAttribute_1.default.validate(body);
                // check
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                const founded = yield categoryAttribute_2.default.findOne({
                    where: {
                        name_ascii: body.name_ascii,
                    },
                });
                if (founded)
                    return (0, myResponse_1.default)(res, false, "Category attribute already exist", 409);
                const brand = yield categoryAttribute_2.default.create(body);
                return (0, myResponse_1.default)(res, true, "add category attribute successful", 200, brand);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const body = req.body;
                const value = categoryAttribute_1.default.validate(body);
                if (Number.isNaN(+id))
                    throw new BadRequest_1.default("");
                const item = yield categoryAttribute_2.default.findByPk(id);
                if (!item)
                    throw new ObjectNotFound_1.default("");
                // check
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                const founded = yield categoryAttribute_2.default.findOne({
                    where: {
                        name_ascii: body.name_ascii,
                    },
                });
                if (founded)
                    return (0, myResponse_1.default)(res, false, "Category attribute already exist", 409);
                yield categoryAttribute_2.default.update(body, { where: { id } });
                Object.assign(item, body);
                return (0, myResponse_1.default)(res, true, "update category attribute successful", 200, item);
            }
            catch (error) {
                next(error);
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (Number.isNaN(+id))
                    throw new BadRequest_1.default("");
                const item = yield categoryAttribute_2.default.findByPk(id);
                if (!item)
                    throw new ObjectNotFound_1.default("");
                item.destroy();
                return (0, myResponse_1.default)(res, true, "delete category attribute successful", 200);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
}
exports.default = new categoryAttributeHandler();
