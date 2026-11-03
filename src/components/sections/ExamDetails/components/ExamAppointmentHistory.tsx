import { Box } from "@mui/material";
import { Text } from "@/components/common";
import typography from "@/shared/theme/typography-theme";
import { TableExamAppointments } from "@/components/Tables";
import { useExam } from "@/hooks";

export type ExamAppointmentHistoryProps = {
  patientPecId: string;
};

const ExamAppointmentHistory: React.FC<ExamAppointmentHistoryProps> = ({
  patientPecId,
}) => {
  const { examAppointments, examAppointmentsLoading } = useExam({
    getExamAppointmentsOptions: {
      enabled: true,
      params: {
        patientId: patientPecId,
      },
    },
  });

  return (
    <Box>
      <Text {...typography.title.h3l} mb="3.6rem">
        Histórico
      </Text>
      <Box>
        <TableExamAppointments
          data={examAppointments}
          loading={examAppointmentsLoading}
        />
      </Box>
    </Box>
  );
};

export default ExamAppointmentHistory;
