export const generateId = (name: string) => {
   const convertToEn = (str: string) => {
      return str
         .toLocaleLowerCase()
         .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ắ|ằ|ẳ|ẵ|ặ/g, "a")
         .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
         .replace(/ì|í|ị|ỉ|ĩ/g, "i")
         .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
         .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
         .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
         .replace(/đ/g, "d");
   };
   return convertToEn(name).replace(/[\W_]/g, "_");
};

export const countDateDiff = (createAt: Date) => {
   const current = new Date();

   const hourDiff = +(
      (current.getTime() - createAt.getTime()) /
      (1000 * 60 * 60)
   ).toFixed(1);

   if (hourDiff / 24 > 30) return createAt.toLocaleDateString("en-gb");

   if (hourDiff / 24 > 1) return `${Math.floor(hourDiff / 24)} days ago`;

   if (hourDiff > 1) return `${Math.floor(hourDiff)} hours ago`;

   return `Less than a hour`;
};

export function getProductName(existingNames: string[], name: string) {
   if (!existingNames.includes(name)) return name;

   let counter = 1;
   let newName = name;

   while (existingNames.includes(newName)) {
      counter++;
      newName = `${name} (${counter})`;
   }

   return newName;
}
