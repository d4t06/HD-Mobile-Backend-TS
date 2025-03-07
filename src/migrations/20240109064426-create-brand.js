"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable(
         "Brands",
         {
            id: {
               autoIncrement: true,
               primaryKey: true,
               type: Sequelize.INTEGER,
            },
            category_id: {
               onDelete: "CASCADE",
               type: Sequelize.INTEGER,
               allowNull: false,
               references: {
                  model: "Categories",
                  key: "id",
               },
            },
            name_ascii: {
               type: Sequelize.STRING,
               allowNull: false,
            },
            name: {
               allowNull: false,
               type: Sequelize.STRING,
            },
            image_url: {
               type: Sequelize.STRING,
            },
         },
         {
            uniqueKeys: {
               check_unique: {
                  fields: ["category_id", "name_ascii"],
               },
            },
         },
      );
   },
   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("Brands");
   },
};
