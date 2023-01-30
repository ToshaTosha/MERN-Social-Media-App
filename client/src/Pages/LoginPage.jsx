import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";

import { fetchUserData, IsAuth } from "../redux/slices/auth";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

export default function LoginPage() {
  const isAuth = useSelector(IsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  const onSubmit = async (value) => {
    const data = await dispatch(fetchUserData(value));
    if (!data.payload) {
      return alert("Не удалось авторизоваться!");
    }
    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };
  if (isAuth) {
    return <Navigate to="/" />;
  } else {
    return (
      <Paper
        sx={{
          width: 400,
          height: 220,
          margin: "50px auto",
          padding: "20px 10px",
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="E-Mail"
            error={Boolean(errors.email?.message)}
            helperText={errors.email?.message}
            type="email"
            {...register("email", { required: "Укажите почту" })}
          />
          <TextField
            label="Пароль"
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            {...register("password", { required: "Укажите пароль" })}
          />
          <Button
            variant="contained"
            disableElevation
            type="submit"
            disabled={!isValid}
          >
            Войти
          </Button>
          <Link to={"/registration"}>
            <Button
              variant="contained"
              disableElevation
              color="success"
              sx={{ width: "100%" }}
            >
              Зарегистрироваться
            </Button>
          </Link>
        </form>
      </Paper>
    );
  }
}
