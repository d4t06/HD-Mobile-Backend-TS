"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function myResponse(res, flag, message, code, data) {
    return res.status(code).json({ flag, message, code, time: "", data: data || null });
}
exports.default = myResponse;
