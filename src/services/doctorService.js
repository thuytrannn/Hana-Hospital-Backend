import db from "../models/index"
require('dotenv').config()
import _ from 'lodash'
import emailService from '../services/emailService'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'roleData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true,
            })
            resolve({
                errCode: 0,
                data: users,
            })
        }
        catch (e) {
            console.log(e)
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: doctors,
            })
        }
        catch (e) {
            reject(e)
        }
    })
}


let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown
                || !inputData.action || !inputData.specialtyId || !inputData.clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters.'
                })
            }
            else {
                //upsert to markdown
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    })
                }
                else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false,
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown
                        doctorMarkdown.description = inputData.description
                        doctorMarkdown.updatedAt = new Date()
                        await doctorMarkdown.save()
                    }
                }
                //upsert to doctor-info
                let doctorInfo = await db.Doctor_info.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                })
                if (doctorInfo) {
                    doctorInfo.doctorId = inputData.doctorId
                    doctorInfo.priceId = inputData.selectedPrice
                    doctorInfo.provinceId = inputData.selectedProvince
                    doctorInfo.paymentId = inputData.selectedPayment
                    doctorInfo.nameClinic = inputData.nameClinic
                    doctorInfo.addressClinic = inputData.addressClinic
                    doctorInfo.note = inputData.note
                    doctorInfo.specialtyId = inputData.specialtyId
                    doctorInfo.clinicId = inputData.clinicId
                    await doctorInfo.save()
                } else {
                    await db.Doctor_info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor success.'
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let getDetailDoctorByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters.'
                })
            }
            else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.Doctor_info,
                            attributes: {
                                exclude: ['doctorId', 'id']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi', 'valueEn'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true,
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data,
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters.'
                })
            }
            else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE ? MAX_NUMBER_SCHEDULE : 10
                        return item
                    })
                }
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ['doctorId', 'timeType', 'date', 'maxNumber'],
                    raw: true,
                })
                //check trùng bản ghi
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.doctorId === b.doctorId && +a.date == +b.date && a.timeType == b.timeType
                })
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)

                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let getScheduleDoctorByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters.',
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: true,
                    nest: true,
                })
                if (!data) data = []
                resolve({
                    errCode: 0,
                    data: data,
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let getExtraInforDoctorByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters.',
                })
            } else {
                let data = await db.Doctor_info.findOne({
                    where: { doctorId: doctorId },
                    attributes: {
                        exclude: ['doctorId', 'id']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] },
                    ],
                    raw: true,
                    nest: true,
                })
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data,
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let getProfileDoctorByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters.',
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.Doctor_info,
                            attributes: {
                                exclude: ['doctorId', 'id']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi', 'valueEn'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true,
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data,
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let getListPatientForDoctorService = (inputId, inputDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !inputDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters.',
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: inputId,
                        date: inputDate,
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['firstName', 'email', 'gender', 'address'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn'] },
                            ],
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient',
                            attributes: ['valueVi', 'valueEn'],
                        }
                    ],
                    raw: false,
                    nest: true,
                })

                resolve({
                    errCode: 0,
                    data: data,
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let sendRemedyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters.',
                })
            } else {
                //update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2',
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S3'
                    appointment.updatedAt = new Date()
                    await appointment.save()
                }
                //send email remedy
                await emailService.sendAttachment(data)

                resolve({
                    errCode: 0,
                    errMessage: 'OK.',
                })
            }
        }

        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInforDoctor,
    getDetailDoctorByIdService,
    bulkCreateScheduleService,
    getScheduleDoctorByDateService,
    getExtraInforDoctorByIdService,
    getProfileDoctorByIdService,
    getListPatientForDoctorService,
    sendRemedyService,
}