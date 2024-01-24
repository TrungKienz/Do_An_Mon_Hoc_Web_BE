const MedicineV4Model = require('../models/MedicineV4Model');
const errorResponse = require('../response/errorResponse');
const successResponse = require('../response/successfulResponse');

const medicineTypeToModel = {
    medicineV4AllGene: MedicineV4Model.medicineV4AllGene,
    medicineV4Breast: MedicineV4Model.medicineV4Breast,
    medicineV4Thyriod: MedicineV4Model.medicineV4Thyroid,
    medicineV4Liver: MedicineV4Model.medicineV4Liver,
    medicineV4Lung: MedicineV4Model.medicineV4Lung,
    medicineV4Colorectal: MedicineV4Model.medicineV4Colorectal,
    medicineOtherCancer: MedicineV4Model.medicineOtherCancer,
};

class MedicineV4Controller {
    async getAllMedicine(req, res, medicineType) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const medicineModelToUse = medicineTypeToModel[medicineType];
            if (!medicineModelToUse) {
                return res
                    .status(400)
                    .json(
                        errorResponse.otherErrorResponse(
                            'Invalid medicine type',
                            400,
                        ),
                    );
            }
            const count = await medicineModelToUse.countDocuments({});
            const medicineData = await medicineModelToUse
                .find({})
                .skip(skip)
                .limit(limit);

            const totalPages = Math.ceil(count / limit);
            const resData = {
                currentPage: page,
                totalPages,
                dataMedicine: medicineData.map((medicineModelToUse) => ({
                    _id: medicineModelToUse._id,
                    geneName: medicineModelToUse.geneName,
                    mutation: medicineModelToUse.mutation,
                    medicine: medicineModelToUse.medicine,
                    valence: medicineModelToUse.valence,
                    responseMedication: medicineModelToUse.responseMedication,
                    therapyRank: medicineModelToUse.therapyRank,
                    priority: medicineModelToUse.priority,
                    drugLicensing: [
                        medicineModelToUse.VN != '0' && medicineModelToUse.VN
                            ? 'VietNam'
                            : '',
                        medicineModelToUse.FDA === 'x' ? 'FDA' : '',
                        medicineModelToUse.otherOrganization
                            ? medicineModelToUse.otherOrganization
                            : '',
                        medicineModelToUse.clinicalTrials
                            ? 'clinicalTrials'
                            : '',
                    ],
                    references: medicineModelToUse.references.split(':')[1],
                    note: medicineModelToUse.note,
                })),
            };

            res.json(successResponse.successfulResponse('Get all', resData));
        } catch (error) {
            console.error(error);
            res.status(500).json(
                errorResponse.failedResponse('Get all medicine'),
            );
        }
    }

    async search(req, res, medicineType) {
        const dataBody = req.body;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const medicineModelToUse = medicineTypeToModel[medicineType];
        if (!medicineModelToUse) {
            return res
                .status(400)
                .json(
                    errorResponse.otherErrorResponse(
                        'Invalid medicine type',
                        400,
                    ),
                );
        }

        const count = await medicineModelToUse.countDocuments({
            $or: [
                { geneName: dataBody.filter },
                { mutation: dataBody.filter },
                { medicine: dataBody.filter },
            ],
        });

        const dataSearch = await medicineModelToUse
            .find({
                $or: [
                    { geneName: dataBody.filter },
                    { mutation: dataBody.filter },
                    { medicine: dataBody.filter },
                ],
            })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(count / limit);

        const resData = {
            currentPage: page,
            totalPages,
            dataSearch: dataSearch.map((medicineModelToUse) => ({
                _id: medicineModelToUse._id,
                geneName: medicineModelToUse.geneName,
                mutation: medicineModelToUse.mutation,
                medicine: medicineModelToUse.medicine,
                valence: medicineModelToUse.valence,
                responseMedication: medicineModelToUse.responseMedication,
                therapyRank: medicineModelToUse.therapyRank,
                priority: medicineModelToUse.priority,
                drugLicensing: [
                    medicineModelToUse.VN != '0' && medicineModelToUse.VN
                        ? 'VietNam'
                        : '',
                    medicineModelToUse.FDA === 'x' ? 'FDA' : '',
                    medicineModelToUse.otherOrganization
                        ? medicineModelToUse.otherOrganization
                        : '',
                    medicineModelToUse.clinicalTrials ? 'clinicalTrials' : '',
                ],
                references: medicineModelToUse.references.split(':')[1],
                note: medicineModelToUse.note,
            })),
        };
        res.status(200).json(resData);
    }
}

module.exports = new MedicineV4Controller();
