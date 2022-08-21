import {
  Grid,
  Space,
  Title,
  Progress,
  Loader,
  Text,
  Stack,
  RingProgress,
  Group,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getReport } from "../api/reports";

const Report = () => {
  const { data, isLoading } = useQuery(["report"], getReport);

  if (isLoading || !data) {
    return <Loader />;
  }

  return (
    <>
      <Progress
        radius="sm"
        size={24}
        sections={[
          {
            value:
              data.totalExpense === 0 && data.totalIncome === 0
                ? 50
                : (data.totalExpense * 100) /
                  (data.totalExpense + data.totalIncome),
            color: "pink",
            label: `Expense: ${Math.round(
              (data.totalExpense * 100) / (data.totalExpense + data.totalIncome)
            )}%`,
            tooltip: `Expense: ${Math.round(
              (data.totalExpense * 100) / (data.totalExpense + data.totalIncome)
            )}%`,
          },
          {
            value:
              data.totalExpense === 0 && data.totalIncome === 0
                ? 50
                : (data.totalIncome * 100) /
                  (data.totalExpense + data.totalIncome),
            color: "cyan",
            label: `Income: ${Math.round(
              (data.totalIncome * 100) / (data.totalExpense + data.totalIncome)
            )}%`,
            tooltip: `Income: ${Math.round(
              (data.totalIncome * 100) / (data.totalExpense + data.totalIncome)
            )}%`,
          },
        ]}
      />

      <Space h={24} />
      <Stack spacing={0} align="center">
        <Title order={3}>Balance</Title>
        <Text>
          {data.balance >= 0
            ? `$${data.balance.toFixed(2)}`
            : `-$${Math.abs(data.balance).toFixed(2)}`}
        </Text>
      </Stack>

      <Grid gutter={64}>
        <Grid.Col span={6}>
          <Stack spacing={0} align="center">
            <Title order={3}>Expense</Title>
            <Text>${data.totalExpense.toFixed(2)}</Text>

            <RingProgress
              size={240}
              thickness={48}
              sections={Object.entries(data.expenseCategories).map(
                (cat, idx) => ({
                  value: (cat[1] * 100) / data.totalExpense,
                  color:
                    Object.keys(data.expenseCategories).length > 1 &&
                    Object.keys(data.expenseCategories).length % 3 === 1 &&
                    idx === Object.keys(data.expenseCategories).length - 1
                      ? "cyan"
                      : idx % 3 === 0
                      ? "pink"
                      : idx % 3 === 1
                      ? "cyan"
                      : "yellow",
                  tooltip: `${cat[0]}: ${Math.round(
                    (cat[1] * 100) / data.totalExpense
                  )}%`,
                })
              )}
            />

            {Object.entries(data.expenseCategories).map((cat) => (
              <Stack
                key={cat[0]}
                spacing={0}
                sx={{ width: "100%", paddingBottom: 12 }}
              >
                <Text>
                  {cat[0]}: {Math.round((cat[1] * 100) / data.totalExpense)}%
                </Text>
                <Group position="apart" noWrap>
                  <Progress
                    value={(cat[1] * 100) / data.totalExpense}
                    sx={{ width: "80%" }}
                  />
                  <Text>${cat[1].toFixed(2)}</Text>
                </Group>
              </Stack>
            ))}
          </Stack>
        </Grid.Col>

        <Grid.Col span={6}>
          <Stack spacing={0} align="center">
            <Title order={3}>Income</Title>
            <Text>${data.totalIncome.toFixed(2)}</Text>

            <RingProgress
              size={240}
              thickness={48}
              sections={Object.entries(data.incomeCategories).map(
                (cat, idx) => ({
                  value: (cat[1] * 100) / data.totalIncome,
                  color:
                    idx % 3 === 0 ? "pink" : idx % 3 === 1 ? "cyan" : "yellow",
                  tooltip: `${cat[0]}: ${Math.round(
                    (cat[1] * 100) / data.totalIncome
                  )}%`,
                })
              )}
            />

            {Object.entries(data.incomeCategories).map((cat) => (
              <Stack
                key={cat[0]}
                spacing={0}
                sx={{ width: "100%", paddingBottom: 12 }}
              >
                <Text>
                  {cat[0]}: {Math.round((cat[1] * 100) / data.totalIncome)}%
                </Text>
                <Group position="apart" noWrap>
                  <Progress
                    value={(cat[1] * 100) / data.totalIncome}
                    sx={{ width: "80%" }}
                    color="cyan"
                  />
                  <Text>${cat[1].toFixed(2)}</Text>
                </Group>
              </Stack>
            ))}
          </Stack>
        </Grid.Col>
      </Grid>
    </>
  );
};
export default Report;
