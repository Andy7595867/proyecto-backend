const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const User = require('../models/user.model');
const RolePermission = require('../models/rolePermission.model');

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

exports.loginUser = async (email, password) => {
    try {

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta');
        }

        const rolePermissions = await RolePermission.findAll({
            where: { rol_id: user.rol_id },
            attributes: ['permiso_id']
        });

        const permisos = rolePermissions.map(rp => rp.permiso_id);

        const token = jwt.sign(
            {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol_id: user.rol_id,
                permisos
            },
            SECRET_KEY
        );
        
        return token;

    } catch (error) {
        throw new Error(error.message || 'Error al iniciar sesión');
    }
};