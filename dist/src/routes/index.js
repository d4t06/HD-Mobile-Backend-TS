"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const myResponse_1 = __importDefault(require("../system/myResponse"));
const category_1 = __importDefault(require("./category"));
const brand_1 = __importDefault(require("./brand"));
const categoryAttribute_1 = __importDefault(require("./categoryAttribute"));
const priceRange_1 = __importDefault(require("./priceRange"));
const sliderImage_1 = __importDefault(require("./sliderImage"));
const product_1 = __importDefault(require("./product"));
const variant_1 = __importDefault(require("./variant"));
const color_1 = __importDefault(require("./color"));
const combine_1 = __importDefault(require("./combine"));
const description_1 = __importDefault(require("./description"));
const productAttribute_1 = __importDefault(require("./productAttribute"));
const defaultVariantCombine_1 = __importDefault(require("./defaultVariantCombine"));
const defaultProductVariant_1 = __importDefault(require("./defaultProductVariant"));
const auth_1 = __importDefault(require("./auth"));
const image_1 = __importDefault(require("./image"));
const init_1 = __importDefault(require("./init"));
function routeHandler(app) {
    app.use("/api/init", init_1.default);
    app.use("/api/auth", auth_1.default);
    app.use("/api/images", image_1.default);
    app.use("/api/categories", category_1.default);
    app.use("/api/category-brands", brand_1.default);
    app.use("/api/category-attributes", categoryAttribute_1.default);
    app.use("/api/category-price-ranges", priceRange_1.default);
    app.use("/api/slider-images", sliderImage_1.default);
    app.use("/api/products", product_1.default);
    app.use("/api/product-variants", variant_1.default);
    app.use("/api/product-colors", color_1.default);
    app.use("/api/product-combines", combine_1.default);
    app.use("/api/product-descriptions", description_1.default);
    app.use("/api/product-attributes", productAttribute_1.default);
    app.use("/api/default-variant-combines", defaultVariantCombine_1.default);
    app.use("/api/default-product-variants", defaultProductVariant_1.default);
    // app.use("/comments", commentRouter);
    // app.use("/reviews", reviewRouter);
    // app.use("/orders", orderRouter);
    // app.use("/order-management", manageOrderRouter);
    // app.use(tokenMiddleware);
    // app.use("/carts", cartRouter);
    // app.use(roleMiddleware.isAdmin);
    // app.use("/category-management", manageCategoryRouter);
    // app.use("/slider-management", manageSlider);
    // app.use("/product-management", manageProductRouter);
    // app.use("/comment-management", manageCommentRouter);
    // app.use("/image-management", manageImageRouter);
    // app.use("/users", userRouter);
    // app.use("/review-management", manageReviewRouter);
    app.use("/", (req, res) => {
        return (0, myResponse_1.default)(res, false, "Resource not found", 404);
    });
}
exports.default = routeHandler;
