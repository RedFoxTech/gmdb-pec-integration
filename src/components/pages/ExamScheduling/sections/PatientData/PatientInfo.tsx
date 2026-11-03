import { Button, Card, Text, TextField } from "@/components/common";
import { PatientExamSchedulingEntity } from "@/domain/entities/patient";
import theme from "@/shared/theme/material-theme";
import typography from "@/shared/theme/typography-theme";
import { Box } from "@mui/material";

export type PatientInfoProps = {
  data: PatientExamSchedulingEntity;
  onNext: () => void;
};

const PatientInfo: React.FC<PatientInfoProps> = ({ data, onNext }) => (
  <Card noBoder bgcolor={theme.palette.white.main} py="3.2rem" mb="1.2rem">
    <Text {...typography.title.h3l}>Informações do Paciente</Text>
    <Text color="#9399A4" {...typography.paragraph.l1}>
      Confirme os dados abaixo
    </Text>
    <Box display="flex" flexDirection="column" gap="2.4rem" mt="2rem">
      <TextField label="Nome completo" value={data.name} disabled />
      <TextField label="Email" value={data.email} disabled />
      <TextField label="Telefone(WhatsApp)" value={data.phone} disabled />
      <Button color="success" onClick={onNext}>
        Próximo
      </Button>
    </Box>
  </Card>
);

export default PatientInfo;
