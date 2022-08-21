import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import toast from "react-hot-toast";
import {
  Button,
  Grid,
  Group,
  Image,
  Loader,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import Layout from "../components/Layout";
import { AxiosError } from "axios";
import { apiRegister } from "../api/users";
import { useQueryClient } from "@tanstack/react-query";

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      email: (value) =>
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
          ? null
          : "Invalid email",
      password: (value) =>
        value.length < 8 ? "Password must be at least 8 characters long" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  type FormValues = typeof form.values;

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const data = await apiRegister({
        email: values.email,
        password: values.password,
      });
      localStorage.setItem("token", JSON.stringify(data.data?.token));
      if (data.message) {
        toast.success(data.message);
      }
      queryClient.invalidateQueries(["user"]);
      navigate("/");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(`Failed to register: ${err.response?.data.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Space h="xl" />
      <Grid align="center">
        <Grid.Col span={4}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Title order={2}>Register</Title>

            <TextInput
              required
              label="Email"
              type="email"
              disabled={loading}
              mt={8}
              {...form.getInputProps("email")}
            />

            <TextInput
              required
              label="Password"
              type="password"
              disabled={loading}
              mt={8}
              {...form.getInputProps("password")}
            />

            <TextInput
              required
              label="Confirm password"
              type="password"
              disabled={loading}
              mt={8}
              {...form.getInputProps("confirmPassword")}
            />

            <Button type="submit" disabled={loading} fullWidth mt={16}>
              Register
            </Button>
            <Button
              component={Link}
              to="/login"
              disabled={loading}
              fullWidth
              mt={8}
              variant="outline"
            >
              I already have an account
            </Button>
            {loading && <Loader />}
          </form>
        </Grid.Col>

        <Grid.Col span={4} offset={2}>
          <Image src="/fishflag.png" height={512} fit="contain" />
        </Grid.Col>
      </Grid>
    </Layout>
  );
}

export default Register;
