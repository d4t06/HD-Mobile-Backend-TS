"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable(
         "Category_Sliders",
         {
            id: {
               autoIncrement: true,
               primaryKey: true,
               type: Sequelize.INTEGER,
            },
            slider_id: {
               onDelete: "CASCADE",
               type: Sequelize.INTEGER,
               references: {
                  model: "Sliders",
                  key: "id",
               },
            },
            category_id: {
               onDelete: "CASCADE",
               type: Sequelize.INTEGER,
               references: {
                  model: "Categories",
                  key: "id",
               },
            },
         },
         {
            uniqueKeys: {
               check_unique: {
                  fields: ["category_id", "slider_id"],
               },
            },
         }
      );
   },
   async down(queryInterface, _Sequelize) {
      await queryInterface.dropTable("Category_Sliders");
   },
};
