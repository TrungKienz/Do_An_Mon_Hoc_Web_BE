const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commonFields = {
    geneName: String,
    mutation: String,
    medicine: String,
    valence: String,
    responseMedication: String,
    therapyRank: String,
    priority: String,
    VN: String,
    FDA: String,
    otherOrganization: String,
    clinicalTrials: String,
    note: String,
    references: String,
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
};

const medicineV4AllGeneSchema = new Schema(commonFields);
const medicineV4BreastSchema = new Schema(commonFields);
const medicineV4ThyroidSchema = new Schema(commonFields);
const medicineV4LiverSchema = new Schema(commonFields);
const medicineV4LungSchema = new Schema(commonFields);
const medicineV4ColorectalSchema = new Schema(commonFields);

const otherCancerSchema = new Schema({
    cancerName: String,
    ...commonFields,
});

const medicineV4AllGene = mongoose.model(
    'medicine_v4_all_gene',
    medicineV4AllGeneSchema,
);
const medicineV4Breast = mongoose.model(
    'medicine_v4_breast',
    medicineV4BreastSchema,
);
const medicineV4Thyroid = mongoose.model(
    'medicine_v4_thyroid',
    medicineV4ThyroidSchema,
);
const medicineV4Liver = mongoose.model(
    'medicine_v4_liver',
    medicineV4LiverSchema,
);
const medicineV4Lung = mongoose.model('medicine_v4_lung', medicineV4LungSchema);
const medicineV4Colorectal = mongoose.model(
    'medicine_v4_colorectal',
    medicineV4ColorectalSchema,
);
const medicineOtherCancer = mongoose.model(
    'medicine_v4_other_cancer',
    otherCancerSchema,
);

module.exports = {
    medicineV4AllGene,
    medicineV4Breast,
    medicineV4Thyroid,
    medicineV4Liver,
    medicineV4Lung,
    medicineV4Colorectal,
    medicineOtherCancer,
};
