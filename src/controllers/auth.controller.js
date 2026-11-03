
const authService = require('../services/auth.services');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'El correo y la contraseña son obligatorios'
            });
        }

        const token = await authService.loginUser(email, password);

        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token
        });

    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};
