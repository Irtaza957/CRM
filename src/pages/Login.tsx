import { z } from "zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { LuLoader2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import Logo from "../assets/img/logo.svg";
import LoginImg from "../assets/img/login.jpg";
import { logout } from "../store/slices/global";
import FormField from "../components/ui/FormField";
import CustomToast from "../components/ui/CustomToast";
import { useLoginMutation } from "../store/services/user";

const loginSchema = z.object({
  username: z.string().trim().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(64, { message: "Password cannot exceed 64 characters" })
    .refine((password) => !/(password|qwerty)/i.test(password), {
      message: "Password contains a common pattern",
    }),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("username", data.username);
    urlencoded.append("password", data.password);

    try {
      const { data } = await login(urlencoded);
      if (data) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message="Successfully Logged In!"
          />
        ));
        navigate("/");
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message="Invalid Credentials!"
          />
        ));
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    dispatch(logout());
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden px-5">
      <div className="mx-auto grid h-[500px] w-full grid-cols-1 divide-x overflow-hidden rounded-2xl border md:grid-cols-2 xl:w-[50%]">
        <img
          src={LoginImg}
          alt="login-banner"
          className="col-span-1 hidden h-[500px] w-full object-cover md:flex"
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="col-span-1 flex h-[500px] w-full flex-col items-center justify-center space-y-10 px-5 md:px-10"
        >
          <img src={Logo} alt="logo" className="w-72" />
          <FormField
            type="text"
            name="username"
            label="Username"
            register={register}
            placeholder="Username"
            error={errors.username}
          />
          <FormField
            type="password"
            name="password"
            label="Password"
            register={register}
            placeholder="********"
            error={errors.password}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-secondary py-3 font-medium text-white"
          >
            {isLoading ? (
              <div className="flex w-full items-center justify-center space-x-3">
                <LuLoader2 className="h-5 w-5 animate-spin" />
                <p>Please Wait...</p>
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
