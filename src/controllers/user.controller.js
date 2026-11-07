const userService = require('../services/user.services');

// Crear usuario
exports.createUser = async (req, res) => {
    try {
        const { nombre, email, password, rol_id } = req.body;
        const administrador_id = req.user.id;

        if (!nombre || !email || !password || !rol_id) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        const user = await userService.createUser(
            nombre,
            email,
            password,
            rol_id,
            administrador_id
        );

        return res.status(201).json({
            message: 'Usuario creado correctamente',
            user
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
    try {
        console.log('DEBUG req.user:',req.user);
        const { nombre, email, rol_id } = req.body;
        const id = req.params.id;
        const administrador_id = req.user.id;


        const user = await userService.updateUser(
            id,
            nombre,
            email,
            rol_id,
            administrador_id,
        );

        return res.status(200).json({
            message: 'Usuario actualizado correctamente',
            user
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Obtener usuarios del administrador
exports.getAllUsersByAdministradorId = async (req, res) => {
    try {
        const administrador_id = req.user.id;
        const { email } = req.query;

        const users = await userService.getAllUsersByAdministradorId(
            administrador_id,
            email
        );

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const administrador_id = req.user.id;

        await userService.deleteUser(id, administrador_id);

        return res.status(200).json({
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Obtener usuarios por rol
exports.getAllUsersByRolId = async (req, res) => {
    try {
        const rol_id = req.params.id;
        const administrador_id = req.user.id;

        const users = await userService.getAllUsersByRolId(
            rol_id,
            administrador_id
        );

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};