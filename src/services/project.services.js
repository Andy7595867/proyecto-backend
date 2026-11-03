
const Project = require('../models/project.model');
const User = require('../models/user.model');
const UserProject = require('../models/userProject.model');
exports.createProject = async (data) => {
    const { nombre, descripcion, administrador_id } = data;

    if (!nombre) {
        throw new Error('El nombre del proyecto es obligatorio');
    }

    return await Project.create({
        nombre,
        descripcion,
        administrador_id
    });
};

// Obtener proyectos creados por un administrador
exports.getAllProjects = async (administrador_id) => {
    return await Project.findAll({
        where: { administrador_id }
    });
};

// Obtener proyectos asignados a un usuario
exports.getProjectsByUserId = async (userId) => {
    const userProjects = await UserProject.findAll({
        where: { usuario_id: userId },
        include: [{
            model: Project,
            required: true
        }]
    });

    return userProjects.map(item => item.proyectos || item.proyecto);
};

// Asignar usuarios a un proyecto
exports.assignUsersToProject = async (data) => {
    const { proyecto_id, usuarios, administrador_id } = data;

    if (!proyecto_id || !Array.isArray(usuarios) || usuarios.length === 0) {
        throw new Error('Debes indicar el proyecto y una lista de usuarios');
    }

    const project = await Project.findOne({
        where: { id: proyecto_id, administrador_id }
    });

    if (!project) {
        throw new Error('El proyecto no existe o no pertenece a este administrador');
    }

    for (const usuario_id of usuarios) {
        const user = await User.findOne({
            where: { id: usuario_id, administrador_id }
        });

        if (!user) {
            throw new Error(`El usuario ${usuario_id} no existe o no pertenece a este administrador`);
        }

        await UserProject.findOrCreate({
            where: { usuario_id, proyecto_id }
        });
    }

    return { proyecto_id, usuarios };
};

// Quitar un usuario de un proyecto
exports.removeUserFromProject = async (data) => {
    const { proyecto_id, usuario_id, administrador_id } = data;

    const project = await Project.findOne({
        where: { id: proyecto_id, administrador_id }
    });

    if (!project) {
        throw new Error('El proyecto no existe o no pertenece a este administrador');
    }

    const user = await User.findOne({
        where: { id: usuario_id, administrador_id }
    });

    if (!user) {
        throw new Error('El usuario no existe o no pertenece a este administrador');
    }

    const deleted = await UserProject.destroy({
        where: { proyecto_id, usuario_id }
    });

    if (!deleted) {
        throw new Error('Ese usuario no está asignado al proyecto');
    }

    return true;
};

// Actualizar proyecto
exports.updateProject = async (data) => {
    const { id, nombre, descripcion, administrador_id } = data;

    const project = await Project.findOne({
        where: { id, administrador_id }
    });

    if (!project) {
        throw new Error('El proyecto no existe o no pertenece a este administrador');
    }

    await project.update({
        nombre: nombre ?? project.nombre,
        descripcion: descripcion ?? project.descripcion
    });

    return project;
};

// Eliminar proyecto
exports.deleteProject = async (id, administrador_id) => {
    const project = await Project.findOne({
        where: { id, administrador_id }
    });

    if (!project) {
        throw new Error('El proyecto no existe o no pertenece a este administrador');
    }

    await project.destroy();

    return true;
};

// Obtener un proyecto por su ID
exports.getProjectById = async (id, userId) => {
    const project = await Project.findByPk(id, {
        include: [{
            model: User,
            as: 'usuarios',
            attributes: ['id', 'nombre', 'email'],
            through: { attributes: [] },
            required: false
        }]
    });

    if (!project) {
        throw new Error('Proyecto no encontrado');
    }

    const isAdministrator = project.administrador_id === userId;
    const isAssignedUser = project.usuarios.some(user => user.id === userId);

    if (!isAdministrator && !isAssignedUser) {
        throw new Error('No tienes permiso para consultar este proyecto');
    }

    return project;
};
