
const projectService = require('../services/project.services');
const ROLES = require('../utils/constants');

// Crear proyecto
exports.createProject = async (req, res) => {
    try {
        const data = {
            ...req.body,
            administrador_id: req.user.id
        };

        const project = await projectService.createProject(data);

        return res.status(201).json({
            message: 'Proyecto creado correctamente',
            project
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Obtener todos los proyectos
exports.getAllProjects = async (req, res) => {
    try {
        let projects;

        if (req.user.rol_id === ROLES.ADMIN) {
            projects = await projectService.getAllProjects();
        } else {
            projects = await projectService.getProjectsByUserId(req.user.id);
        }

        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Obtener un proyecto por su ID
exports.getProjectById = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        const project = await projectService.getProjectById(id, userId);

        return res.status(200).json(project);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

// Actualizar proyecto
exports.updateProject = async (req, res) => {
    try {
        const data = {
            ...req.body,
            administrador_id: req.user.id
        };

        const project = await projectService.updateProject(data);

        return res.status(200).json({
            message: 'Proyecto actualizado correctamente',
            project
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Eliminar proyecto
exports.deleteProject = async (req, res) => {
    try {
        const id = req.params.id;

        await projectService.deleteProject(id);

        return res.status(200).json({
            message: 'Proyecto eliminado correctamente'
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Asignar usuarios a un proyecto
exports.assignUsersToProject = async (req, res) => {
    try {
        const data = {
            ...req.body,
            administrador_id: req.user.id
        };

        const result = await projectService.assignUsersToProject(data);

        return res.status(200).json({
            message: 'Usuarios asignados correctamente',
            result
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Quitar un usuario de un proyecto
exports.removeUserFromProject = async (req, res) => {
    try {
        const data = {
            ...req.body,
            administrador_id: req.user.id
        };

        await projectService.removeUserFromProject(data);

        return res.status(200).json({
            message: 'Usuario eliminado del proyecto correctamente'
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
