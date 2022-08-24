import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import toast from "react-hot-toast";
import {
  Button,
  Grid,
  Image,
  Loader,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import Layout from "../components/Layout";
import { AxiosError } from "axios";
import { apiLogin, getCurrentUser } from "../api/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery(["user"], getCurrentUser, {
    retry: false,
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  type FormValues = typeof form.values;

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const data = await apiLogin(values);
      localStorage.setItem("token", JSON.stringify(data.data.token));
      if (data.message) {
        toast.success(data.message);
      }
      queryClient.invalidateQueries(["user"]);
      navigate("/");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(`Failed to login: ${err.response?.data?.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Space h={48} />
      <Grid align="center">
        <Grid.Col span={4}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Title order={2}>Login</Title>

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

            <Button type="submit" disabled={loading} fullWidth mt={16}>
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              disabled={loading}
              fullWidth
              mt={8}
              variant="outline"
            >
              Register a new account
            </Button>
            {loading && <Loader />}
          </form>
        </Grid.Col>

        <Grid.Col span={4} offset={1.5}>
          <Image src="/sleepingfish.png" width={400} />
        </Grid.Col>
      </Grid>
    </Layout>
  );
}

export default Login;
