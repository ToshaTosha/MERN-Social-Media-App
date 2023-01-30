import React from "react";
import axios from "../axios";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { fetchUserRegister, IsAuth } from "../redux/slices/auth";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";

export default function RegisterPage() {
  const isAuth = useSelector(IsAuth);
  const dispatch = useDispatch();
  const [imageURL, setImageURL] = React.useState("");
  const inputFileRef = React.useRef(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      avatarUrl: "",
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageURL(data.url);
    } catch (err) {
      console.warn(err);
      alert("Ошибка при загрузке файла");
    }
  };

  const onSubmit = async (value) => {
    value.avatarUrl = imageURL ? `http://localhost:4444${imageURL}` : "";
    console.log(value.avatarUrl);
    const data = await dispatch(fetchUserRegister(value));
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
          height: 370,
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
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Avatar
            src={
              imageURL
                ? `http://localhost:4444${imageURL}`
                : "https://3myhouse.com/upload/image/store/0.png"
            }
            sx={{ width: 72, height: 72, cursor: "pointer" }}
            onClick={() => inputFileRef.current.click()}
          />
          <input
            ref={inputFileRef}
            //{...register("avatarUrl")}
            onChange={handleChangeFile}
            hidden
            accept="image/*"
            type="file"
          />

          <TextField
            sx={{ width: "100%" }}
            label="Ваше имя"
            error={Boolean(errors.fullName?.message)}
            helperText={errors.fullName?.message}
            {...register("fullName", { required: "Укажите имя" })}
          />
          <TextField
            sx={{ width: "100%" }}
            label="E-Mail"
            error={Boolean(errors.email?.message)}
            helperText={errors.email?.message}
            type="email"
            {...register("email", { required: "Укажите почту" })}
          />
          <TextField
            sx={{ width: "100%" }}
            label="Пароль"
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            {...register("password", { required: "Укажите пароль" })}
          />
          <Button
            sx={{ width: "100%" }}
            variant="contained"
            disableElevation
            type="submit"
            disabled={!isValid}
          >
            Зарегистрироваться
          </Button>
          <Button
            sx={{ width: "100%" }}
            variant="contained"
            disableElevation
            color="success"
          >
            Войти
          </Button>
        </form>
      </Paper>
    );
  }
}
