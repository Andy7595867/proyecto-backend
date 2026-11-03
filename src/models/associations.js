const User = require('./user.model');
const Project = require('./project.model');
const UserProject = require('./userProject.model');

// Relación: un usuario puede tener muchos proyectos
User.belongsToMany(Project, {
    through: UserProject,
    foreignKey: 'usuario_id',
    otherKey: 'proyecto_id',
    as: 'proyectos'
});

// Relación inversa: un proyecto puede tener muchos usuarios
Project.belongsToMany(User, {
    through: UserProject,
    foreignKey: 'proyecto_id',
    otherKey: 'usuario_id',
    as: 'usuarios'
});

// Relación: cada proyecto tiene un administrador
Project.belongsTo(User, {
    foreignKey: 'administrador_id',
    as: 'administrador'
});

module.exports = { User, Project, UserProject };