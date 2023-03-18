import Project from "../models/project.js";
import Word from "../models/word.js";
import Option from "../models/option.js";
import EtcOption from "../models/etc_option.js";
import randomCodeGenerator from "./../../controllers/randomCodeGenerator.js";

export const createProject = async (data) => {
  let accessCode;
  let now = new Date();

  while (true) {
    accessCode = randomCodeGenerator();

    let isExisted = (await Project.find({ accessCode: accessCode })).length;
    if (!isExisted) break;
  }

  let project = await new Project({
    name: data.name,
    admin: data.admin,
    accessCode: accessCode,
    created: now,
  });

  await project.save();
  return project;
};

export const getProject = async (data) => {
  try {
    return await Project.findOne({ admin: data.admin, _id: data.id });
  } catch (e) {
    return null;
  }
};

export const modifyProject = async (data) => {
  try {
    let project = await Project.findById(data._id);
    let accessCode;

    project.name = data.name;
    project.type = data.type;
    project.data = data.data;
    project.question = data.question;

    while (true) {
      accessCode = randomCodeGenerator();

      let isExisted = (await Project.find({ accessCode: accessCode })).length;
      if (!isExisted) break;
    }

    project.accessCode = accessCode;

    await project.save();

    if (project.type === "choice") {
      await Option.deleteMany({ parent: data._id });
      for (var i = 0; i < data.data.options.length; i++) {
        let option = await new Option({
          parent: data._id,
          option: data.data.options[i].value,
        });

        await option.save();
      }

      if (data.data.etcContained) {
        await EtcOption.deleteMany({ parent: data._id });

        let etcOption = await new EtcOption({
          parent: data._id,
        });

        await etcOption.save();
      }
      // project.data.options.forEach(async (item) => {
      //   let option = await new Option({
      //     parent: data._id,
      //     option: item.value,
      //   });

      //   await option.save();
      // });
    }

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: error };
  }
};

export const getProjectsByAdmin = async (admin) => {
  try {
    return await Project.find({ admin: admin });
  } catch (e) {
    return [];
  }
};

export const deletePolls = (ids) => {
  try {
    ids.forEach((id) => {
      Project.findByIdAndRemove(id).exec();
      Word.deleteMany({ parent: id }).exec();
    });
  } catch (error) {
    return error;
  }
};

export const checkAccessCode = async (accessCode) => {
  let project = await Project.findOne({ accessCode: accessCode });

  if (project) {
    return { success: true, id: project._id, type: project.type };
  } else {
    return { success: false };
  }
};

export const getProjectById = async (id) => {
  try {
    let project = await Project.findById(id);
    return { success: true, project: project };
  } catch (error) {
    return { success: false };
  }
};

export const getOptionsById = async (id) => {
  try {
    let project = await Project.findById(id);
    let options = await Option.find({ parent: id });
    let etcOption = await EtcOption.findOne({ parent: id });
    return { success: true, options: options, project: project, etcOption: etcOption };
  } catch (err) {
    return { success: false };
  }
};

export const submitWord = async (data) => {
  let project = await Project.findById(data.id);
  let isExisted = await Word.findOne({ text: data.text, parent: data.id });
  if (isExisted) {
    isExisted.value += 1;

    await isExisted.save();
  } else {
    let word = new Word({
      parent: data.id,
      text: data.text,
    });

    await word.save();
  }
  project.count += 1;
  await project.save();

  return project;
};

export const submitOption = async (data) => {
  let project = await Project.findById(data.id);
  let option = await Option.findOne({ parent: data.id, option: data.option });

  project.count += 1;
  option.value += 1;

  await project.save();
  await option.save();

  return { success: true, project: project };
};

export const submitEtc = async (data) => {
  let project = await Project.findById(data.id);
  let isExisted = await EtcOption.findOne({ parent: data.id });

  if (isExisted) {
    isExisted.value += 1;
    isExisted.texts = [...isExisted.texts, data.text];
    await isExisted.save();
  } else {
    let etcOption = new EtcOption({
      parent: data.id,
      texts: [data.text],
    });

    await etcOption.save();
  }

  project.count += 1;

  await project.save();
  return { success: true, project: project };
};

export const getWords = async (id) => {
  let words = await Word.find({ parent: id });

  return words;
};

export const resetSlide = async (id) => {
  try {
    let project = await Project.findById(id);
    let accessCode;

    while (true) {
      accessCode = randomCodeGenerator();

      let isExisted = (await Project.find({ accessCode: accessCode })).length;
      if (!isExisted) break;
    }

    project.accessCode = accessCode;
    project.count = 0;

    await project.save();
    await Word.deleteMany({ parent: id });
    await Option.updateMany({ parent: id }, { $set: { value: 0 } });
    await EtcOption.updateMany({ parent: id }, { $set: { value: 0, texts: [] } });
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: error };
  }
};
