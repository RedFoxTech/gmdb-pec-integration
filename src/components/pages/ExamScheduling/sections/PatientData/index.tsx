import { Box } from "@mui/material";
import PatientFindByCpf from "./PatientFindByCpf";
import { useMemo, useState } from "react";
import { usePatient } from "@/hooks";
import PatientInfo from "./PatientInfo";
import CpfErrorWarning from "./CpfErrorWarning";
import PatientDataFill from "./PatientDataFill";
import { PatientExamSchedulingDto } from "@/domain/entities/patient-scheduling";

export type PatientDataProps = {
  cityHallIbge: string;
  onSubmit: (
    data: Omit<PatientExamSchedulingDto, "agendaId" | "cityHallIbge">
  ) => void;
};

const PatientData: React.FC<PatientDataProps> = ({
  cityHallIbge,
  onSubmit,
}) => {
  const [selectedCpf, setSelectedCpf] = useState("");
  const [showFillData, setShowFillData] = useState(false);

  const { patientExamScheduling, patientExamSchedulingError } = usePatient(
    "exam-scheduling",
    {
      getPatientExamScheduling: {
        enabled: Boolean(selectedCpf),
        params: { document: selectedCpf, cityHallIbge },
      },
    }
  );

  const showWarning = useMemo(() => {
    return patientExamSchedulingError?.response?.status === 400;
  }, [patientExamSchedulingError]);

  return (
    <Box>
      {showFillData ? (
        <PatientDataFill onSubmit={onSubmit} />
      ) : (
        <>
          <PatientFindByCpf onSubmit={setSelectedCpf} />
          {patientExamScheduling && (
            <PatientInfo
              data={patientExamScheduling}
              onNext={() => onSubmit({ patientId: patientExamScheduling.id })}
            />
          )}
          {showWarning && (
            <CpfErrorWarning onClickFillData={() => setShowFillData(true)} />
          )}
        </>
      )}
    </Box>
  );
};

export default PatientData;
