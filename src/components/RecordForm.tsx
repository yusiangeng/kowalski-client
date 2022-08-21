import React, { useState } from "react";
import {
  Button,
  Loader,
  Modal,
  NumberInput,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRecord, updateRecord } from "../api/records";
import dayjs from "dayjs";
import { RecordData } from "../types/records";
import { IconCalendar } from "@tabler/icons";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { RecordType } from "../types/records";

const AddEditRecord: React.FC<{
  setShowAddEditRecordModal: any;
  showAddEditRecordModal: boolean;
  selectedItemToEdit: RecordData | null;
  setSelectedItemToEdit: any;
}> = ({
  setShowAddEditRecordModal,
  showAddEditRecordModal,
  selectedItemToEdit,
  setSelectedItemToEdit,
}) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<{
    amount: number;
    type: string;
    category: string;
    date: Date;
    description: string;
  }>({
    initialValues: selectedItemToEdit
      ? {
          ...selectedItemToEdit,
          description: selectedItemToEdit.description ?? "",
          date: new Date(selectedItemToEdit.date),
        }
      : {
          amount: 0,
          type: RecordType.EXPENSE,
          category: "",
          date: new Date(),
          description: "",
        },
  });

  const queryClient = useQueryClient();
  const addRecordMutation = useMutation(addRecord, {
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
          `Failed to add record: ${
            err.response?.data?.message ?? "try again later"
          }`
        );
      }
    },
  });
  const updateRecordMutation = useMutation(updateRecord, {
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
  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);

    if (selectedItemToEdit) {
      updateRecordMutation.mutate({
        ...values,
        date: dayjs(values.date).format(),
        _id: selectedItemToEdit._id,
      });
    } else {
      addRecordMutation.mutate({
        ...values,
        date: dayjs(values.date).format(),
      });
    }

    setShowAddEditRecordModal(false);
    setSelectedItemToEdit(null);
    setLoading(false);
  });

  return (
    <Modal
      title={
        <Title order={3}>
          {selectedItemToEdit ? "Edit Record" : "Add Record"}
        </Title>
      }
      opened={showAddEditRecordModal}
      onClose={() => setShowAddEditRecordModal(false)}
    >
      {loading && <Loader />}
      <Select
        required
        label="Type"
        data={[RecordType.INCOME, RecordType.EXPENSE]}
        disabled={loading}
        {...form.getInputProps("type")}
      />

      <form onSubmit={handleSubmit}>
        <NumberInput
          step={0.01}
          precision={2}
          required
          label="Amount"
          disabled={loading}
          {...form.getInputProps("amount")}
        />

        <Select
          required
          label="Category"
          data={
            form.values.type === RecordType.INCOME
              ? ["Salary", "Freelance", "Misc"]
              : [
                  "Food",
                  "Groceries",
                  "Transportation",
                  "Entertainment",
                  "Clothing",
                  "Utilities",
                  "Medical",
                  "Education",
                  "Insurance",
                  "Donations",
                  "Misc",
                ]
          }
          disabled={loading}
          {...form.getInputProps("category")}
        ></Select>

        <DatePicker
          required
          icon={<IconCalendar fontSize="small" />}
          label="Date"
          disabled={loading}
          {...form.getInputProps("date")}
        />

        <TextInput
          label="Description"
          disabled={loading}
          {...form.getInputProps("description")}
        />

        <Button type="submit" disabled={loading} mt={16} fullWidth>
          Save
        </Button>
      </form>
    </Modal>
  );
};

export default AddEditRecord;
