import {
  ActionIcon,
  Center,
  createStyles,
  Group,
  Loader,
  Select,
  Stack,
  Table,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconSelector,
  IconTrash,
} from "@tabler/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteRecord, getRecords } from "../api/records";
import { RecordData, RecordType, SortOrder } from "../types/records";

const RecordTable: React.FC<{
  setSelectedItemToEdit: (
    value: React.SetStateAction<RecordData | null>
  ) => void;
  setShowAddEditRecordModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setSelectedItemToEdit, setShowAddEditRecordModal }) => {
  const [viewRecordType, setViewRecordType] = useState(RecordType.ALL);
  const [sortBy, setSortBy] = useState<keyof RecordData>("date");
  const [sortOrder, setSortOrder] = useState(SortOrder.DESC);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery(
    ["records", { viewRecordType, sortBy, sortOrder }],
    () => {
      return getRecords({
        sortBy,
        order: sortOrder,
        type: viewRecordType === RecordType.ALL ? undefined : viewRecordType,
      });
    }
  );

  const deleteRecordMutation = useMutation(deleteRecord, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["records"]);
      queryClient.invalidateQueries(["report"]);
      if (data.message) {
        toast.success(data.message);
      }
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(
          `Failed to update record: ${
            err.response?.data?.message ?? "try again later"
          }`
        );
      }
    },
  });

  const setSorting = (field: keyof RecordData) => {
    const order =
      field !== sortBy
        ? SortOrder.ASC
        : sortOrder === SortOrder.ASC
        ? SortOrder.DESC
        : SortOrder.ASC;
    setSortOrder(order);
    setSortBy(field);
  };

  return (
    <>
      {/* filters */}
      <Group align="flex-start" mb={16}>
        <Stack sx={{ width: "128px" }} spacing="xs">
          <Text>Type</Text>
          <Select
            data={[
              { value: RecordType.ALL, label: "All" },
              { value: RecordType.INCOME, label: "Income" },
              { value: RecordType.EXPENSE, label: "Expense" },
            ]}
            value={viewRecordType}
            onChange={(value) => {
              setViewRecordType(
                !value ? RecordType.ALL : (value as RecordType)
              );
            }}
          ></Select>
        </Stack>
      </Group>

      {isLoading && <Loader />}

      {isError && error instanceof Error && (
        <Text color="gray">{error.message}</Text>
      )}

      {data?.data && (
        <Table>
          <thead>
            <tr>
              <Th
                sorted={sortBy === "date"}
                order={sortOrder}
                onSort={() => setSorting("date")}
              >
                Date
              </Th>
              <Th
                sorted={sortBy === "type"}
                order={sortOrder}
                onSort={() => setSorting("type")}
              >
                Type
              </Th>
              <Th
                sorted={sortBy === "amount"}
                order={sortOrder}
                onSort={() => setSorting("amount")}
              >
                Amount
              </Th>
              <Th
                sorted={sortBy === "category"}
                order={sortOrder}
                onSort={() => setSorting("category")}
              >
                Category
              </Th>
              <Th
                sorted={sortBy === "description"}
                order={sortOrder}
                onSort={() => setSorting("description")}
              >
                Description
              </Th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((record) => (
              <tr key={record._id}>
                <td>{dayjs(record.date).format("DD-MM-YYYY")}</td>
                <td>{record.type}</td>
                <td>{record.amount.toFixed(2)}</td>
                <td>{record.category}</td>
                <td>{record.description}</td>
                <td>
                  <Group spacing="xs">
                    <Tooltip label="Edit record" position="bottom">
                      <ActionIcon>
                        <IconEdit
                          onClick={() => {
                            setSelectedItemToEdit(record);
                            setShowAddEditRecordModal(true);
                          }}
                        />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete record" position="bottom">
                      <ActionIcon>
                        <IconTrash
                          onClick={() =>
                            deleteRecordMutation.mutate(record._id)
                          }
                        />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default RecordTable;

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },
}));

const Th: React.FC<{
  children: React.ReactNode;
  sorted: boolean;
  order: SortOrder;
  onSort(): void;
}> = ({ children, sorted, order, onSort }) => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const Icon = sorted
    ? order === SortOrder.ASC
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton
        onClick={onSort}
        sx={{
          width: "100%",
          padding: `${theme.spacing.sm}px ${theme.spacing.xs}px`,
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        }}
      >
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center sx={{ width: 21, height: 21, borderRadius: 21 }}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
};
