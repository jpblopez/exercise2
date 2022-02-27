import * as yup from "yup";

const loginSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const registerSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
  name: yup
    .string()
    .required()
    .matches(/^[a-z]+$/i, "Your username must contain letters only"),
});

export const login = async (req, res, next) => {
  try {
    await loginSchema.validate(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    await registerSchema.validate(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
