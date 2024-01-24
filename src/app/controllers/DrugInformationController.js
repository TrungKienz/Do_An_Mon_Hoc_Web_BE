const { _get_evi_mixed, _get_evi } = require('./sharedFunction/getEvidence');
const { json } = require('express');
const fs = require('fs');
const drugInformationModel = require('../models/DrugInformationModel');

class drugInformationController {
    // ------> Begin <------- ONKOKB Drug fucntion
    findAll(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        drugInformationModel.countDocuments({}, function (err, count) {
            if (err) {
                return res.status(500).json({ error: 'Error!!!' });
            }

            drugInformationModel
                .find({})
                .skip(skip)
                .limit(limit)
                .exec(function (err, drugInformationModels) {
                    if (err) {
                        return res.status(500).json({ error: 'Error!!!' });
                    }

                    const totalPages = Math.ceil(count / limit);

                    res.json({
                        drugInformationModels,
                        currentPage: page,
                        totalPages,
                    });
                });
        });
    }

    findByID(req, res, next) {
        drugInformationModel.findById(req.params.id, (err, item) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else if (!item) {
                res.status(404).send('Item not found');
            } else {
                res.send(item);
            }
        });
    }

    search = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            let { geneName, drugName, cancerMainType, cancerSubType } =
                req.body;
            console.log(req.body);
            geneName = geneName || '.*';
            drugName = drugName || '.*';
            cancerMainType = cancerMainType || '.*';
            cancerSubType = cancerSubType || '.*';
            console.log(geneName, drugName, cancerMainType, cancerSubType);

            const count = await drugInformationModel.countDocuments({
                gene: new RegExp(geneName),
                drug: new RegExp(drugName),
                cancer_main_type: new RegExp(cancerMainType),
                cancer_sub_type: new RegExp(cancerSubType),
            });

            const totalPages = Math.ceil(count / limit);

            const records = await drugInformationModel
                .find({
                    gene: new RegExp(geneName),
                    drug: new RegExp(drugName),
                    cancer_main_type: new RegExp(cancerMainType),
                    cancer_sub_type: new RegExp(cancerSubType),
                })
                .select(
                    'gene drug alteration level cancer_main_type cancer_sub_type articles',
                )
                .skip(skip)
                .limit(limit)
                .lean();

            const mappedRecords = records.map((record) => ({
                gene: record.gene,
                drug: record.drug,
                alteration: record.alteration,
                level: record.level,
                cancer_main_type: record.cancer_main_type,
                cancer_sub_type: record.cancer_sub_type,
                articles: record.articles.map((articles) => articles.pmid),
            }));

            console.log(mappedRecords);
            return res.status(200).json({
                success: true,
                data: mappedRecords,
                totalPages: totalPages,
                currentPage: page,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error!!!' });
        }
    };

    // ------> End <------- ONKOKB Drug function

    // ------> Begin <------- New function for new drug data
    getDrug = (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const typeCancer = req.query.typeCancer || '';
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        fs.readFile(
            `data/dataDrug/${typeCancer}_asia_BE.json`,
            'utf8',
            (err, data) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                const jsonData = JSON.parse(data);
                const dataDrug = jsonData.slice(startIndex, endIndex);

                const response = {
                    page,
                    limit,
                    totalItems: jsonData.length,
                    totalPages: Math.ceil(jsonData.length / limit),
                    dataDrug,
                };

                res.json(response);
            },
        );
    };

    searchDrug = (req, res) => {
        const limit = parseInt(req.query.limit) || 5;
        const typeCancer = req.body.typeCancer || '';
        const region = req.body.region;
        const geneName = req.body.geneName;
        const startIndex = 0;
        const endIndex = 5;
        console.log('region: ' + region);

        fs.readFile(
            `data/dataDrug/${typeCancer}_${region}_BE.json`,
            'utf8',
            (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Internal Server Error');
                }

                const jsonData = JSON.parse(data);

                let filteredData = jsonData;
                if (geneName) {
                    filteredData = jsonData.filter(
                        (item) => item['Gene name'] === geneName,
                    );
                }

                const dataDrug = filteredData.slice(startIndex, endIndex);

                const response = {
                    limit,
                    totalItems: filteredData.length,
                    totalPages: Math.ceil(filteredData.length / limit),
                    dataDrug,
                };

                res.json(response);
            },
        );
    };

    getEvidenceAsiaMixed(req, res) {
        const jsonObject = req.body;
        const scope = 'asia';
        const dataPrediction = _get_evi_mixed(jsonObject, scope);
        return res.status(200).json({
            data: dataPrediction,
            success: true,
        });
    }
    getEvidenceWorldMixed(req, res) {
        const jsonObject = req.body;
        const scope = 'world';
        const dataPrediction = _get_evi_mixed(jsonObject, scope);
        return res.status(200).json({
            data: dataPrediction,
            success: true,
        });
    }
    getEvidence(req, res) {
        const condition = req.body.condition;
        const gene = req.body.gene;
        const protein = req.body.protein;
        const dataPrediction = _get_evi(condition, gene, protein);
        return res.status(200).json({
            data: dataPrediction,
            success: true,
        });
    }
}

module.exports = new drugInformationController();
