import Project from '../models/project.js'
import Vote from '../models/vote.js'
import randomCodeGenerator from './../../controllers/randomCodeGenerator.js';

export const createProject = async (data) => {
    let accessCode;

    while(true){
        accessCode = randomCodeGenerator()

        let isExisted = (await Project.find({accessCode: accessCode})).length
        if(!isExisted) break;
    }

    let project = await new Project({
        name: data.name,
        admin: data.admin,
        accessCode: accessCode
    })

    await project.save()
    return project;
}

export const getProject = async (data) => {
    try{
        return await Project.findOne({admin: data.admin, _id: data.id})
    }catch(e) {
        return null
    }
}

export const modifyProject = async (data) => {
    try{
        let project = await Project.findById(data._id)

        project.name = data.name
        project.type = data.type
        project.data = data.data

        await project.save()

        return {success: true}
    }catch(error){
        return {success: false, error: error}
    }
}

export const getProjectsByAdmin = async (admin) => {
    try {
        return await Project.find({admin: admin})
    }catch(e) {
        return []
    }
}

export const deletePolls = (ids) => {
    try{
        ids.forEach(id => {
            Project.findByIdAndRemove(id).exec()
        });
    }catch(error) {
        return error
    }
}

export const checkAccessCode = async (accessCode) => {
    let project = await Project.findOne({accessCode: accessCode})

    if(project){
        return {success: true, id:project._id}
    }else{
        return {success: false}
    }
}

export const getProjectById = async (id) => {
    try{
        let project = await Project.findById(id)
        return {success: true, project: project}
    }catch(error){
        return {success: false}
    }
}

export const submitAnswer = async (data) => {
    let project = await Project.findById(data.id)
    let isExisted = await Vote.findOne({text: data.text})
    if(isExisted){
        isExisted.value += 1
        await isExisted.save()
    }else{
        let vote = new Vote({
            parent: data.id,
            text: data.text
        })

        await vote.save()
    }
    project.count += 1;
    await project.save()
    
    return project
}

export const getWords = async(id) => {
    let words = await Vote.find({parent: id})

    return words
}