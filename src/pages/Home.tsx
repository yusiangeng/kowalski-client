import { ActionIcon, Button, Group, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AddEditRecord from "../components/RecordForm";
import { useQuery } from "@tanstack/react-query";
import { RecordData } from "../types/records";
import { IconChartDonut3, IconList, IconPlus } from "@tabler/icons";
import { getCurrentUser } from "../api/users";
import { useNavigate } from "react-router-dom";
import RecordTable from "../components/RecordTable";
import Report from "../components/Report";

enum ViewMode {
  TABLE = 1,
  ANALYTICS = 2,
}

const Home = () => {
  const [showAddEditRecordModal, setShowAddEditRecordModal] = useState(false);
  const [selectedItemToEdit, setSelectedItemToEdit] =
    useState<RecordData | null>(null);
  const [viewMode, setViewMode] = useState(ViewMode.TABLE);

  const navigate = useNavigate();

  const { data: user } = useQuery(["user"], getCurrentUser, {
    retry: false,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <Layout>
      <Group position="apart" my={24}>
        <Group>
          <Tooltip label="Table View">
            <ActionIcon size={36} onClick={() => setViewMode(ViewMode.TABLE)}>
              <IconList size={36} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Report View">
            <ActionIcon
              size={36}
              onClick={() => setViewMode(ViewMode.ANALYTICS)}
            >
              <IconChartDonut3 size={36} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Group>
          <Button
            leftIcon={<IconPlus />}
            className="primary"
            onClick={() => {
              setSelectedItemToEdit(null);
              setShowAddEditRecordModal(true);
            }}
          >
            Add Record
          </Button>
        </Group>
      </Group>

      {viewMode === ViewMode.TABLE ? (
        <RecordTable
          setSelectedItemToEdit={setSelectedItemToEdit}
          setShowAddEditRecordModal={setShowAddEditRecordModal}
        />
      ) : (
        <Report />
      )}

      {showAddEditRecordModal && (
        <AddEditRecord
          showAddEditRecordModal={showAddEditRecordModal}
          setShowAddEditRecordModal={setShowAddEditRecordModal}
          selectedItemToEdit={selectedItemToEdit}
          setSelectedItemToEdit={setSelectedItemToEdit}
        />
      )}
    </Layout>
  );
};

export default Home;
