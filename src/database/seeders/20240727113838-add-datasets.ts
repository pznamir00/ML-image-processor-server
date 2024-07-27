import Augmentation from "../../database/models/augmentation";
import Dataset from "../../database/models/dataset";
import { QueryInterface, DataTypes } from "sequelize";
import { AugmentationAlgorithms } from "../../types/augmentation-algorithm.enum";
import { DatasetTypes } from "../../types/dataset-types.enum";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    const datasets = await Dataset.bulkCreate([
      {
        name: "clothing",
        type: DatasetTypes.CLASSIFICATION,
      },
      {
        name: "road holes",
        type: DatasetTypes.OBJECT_DETECTION,
      },
      {
        name: "cat or dog",
        type: DatasetTypes.CLASSIFICATION,
      },
      {
        name: "hotdogs",
        type: DatasetTypes.OBJECT_DETECTION,
      },
    ]);

    await Augmentation.bulkCreate([
      {
        datasetId: datasets[0].id,
        algorithm: AugmentationAlgorithms.BLUR,
        fromPercentage: 0.41,
        toPercentage: 0.77,
      },
      {
        datasetId: datasets[0].id,
        algorithm: AugmentationAlgorithms.NOISE,
        fromPercentage: 0.13,
        toPercentage: 0.37,
      },
      {
        datasetId: datasets[2].id,
        algorithm: AugmentationAlgorithms.GRAYSCALE,
        fromPercentage: 0.66,
        toPercentage: 0.72,
      },
      {
        datasetId: datasets[3].id,
        algorithm: AugmentationAlgorithms.RANDOM_ROTATION,
        fromPercentage: 0.04,
        toPercentage: 0.15,
      },
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await Dataset.truncate();
    await Augmentation.truncate();
  },
};
