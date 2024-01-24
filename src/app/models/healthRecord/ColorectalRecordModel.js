const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConlorectalRecordModel = new Schema({
    generalInfo: Array,
    clinicalSymptoms: Object,
    responeToTreatment: Array,
    genTest: Object,
    genTestResponseTreatment: Object,
    assessmentResponseTreatment: Object,
    otherInfo: Object,
    patientInfo: Object,
    genTestInfo: Object,
    healthRecordId: String,
    typeHealthRecord: {
        type: String,
    },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('colorectal_record', ConlorectalRecordModel);
