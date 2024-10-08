"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countDateDiff = exports.generateId = void 0;
const generateId = (name) => {
    const convertToEn = (str) => {
        const newString = str
            .toLocaleLowerCase()
            .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ắ|ằ|ẳ|ẵ|ặ/g, "a")
            .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
            .replace(/ì|í|ị|ỉ|ĩ/g, "i")
            .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ/g, "o")
            .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
            .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
            .replace(/đ/g, "d");
        return newString;
    };
    return convertToEn(name).replace(/[\W_]/g, "-");
};
exports.generateId = generateId;
const countDateDiff = (createAt) => {
    const current = new Date();
    const hourDiff = +((current.getTime() - createAt.getTime()) /
        (1000 * 60 * 60)).toFixed(1);
    if (hourDiff / 24 > 30)
        return createAt.toLocaleDateString("en-gb");
    if (hourDiff / 24 > 1)
        return `${Math.floor(hourDiff / 24)} days ago`;
    if (hourDiff > 1)
        return `${Math.floor(hourDiff)} hours ago`;
    return `Less than a hour`;
};
exports.countDateDiff = countDateDiff;
