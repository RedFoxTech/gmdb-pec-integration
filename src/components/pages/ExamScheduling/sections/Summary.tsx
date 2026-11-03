import { Card, Text } from "@/components/common";
import theme from "@/shared/theme/material-theme";
import typography from "@/shared/theme/typography-theme";
import { Box } from "@mui/material";
import { Check as IconCheck } from "@mui//icons-material";
import { AgendaEntity } from "@/domain/entities/agenda";
import dateUtils from "@/shared/date";
import { timeByPeriod } from "@/shared/stringUtils";

export type SummaryProps = {
  agenda: AgendaEntity;
};

export const Summary: React.FC<SummaryProps> = ({ agenda }) => (
  <Box>
    <Card noBoder bgcolor={theme.palette.white.main} py="3.2rem" mb="1.2rem">
      <Box display="flex" alignItems="center" gap="1.8rem">
        <Box
          borderRadius="50%"
          bgcolor={theme.palette.success.main}
          width="2.4rem"
          height="2.4rem"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <IconCheck sx={{ color: theme.palette.white.main }} />
        </Box>
        <Box>
          <Text component="h1" {...typography.title.h3l} mb="0.5rem">
            Agendamento realizado com sucesso!
          </Text>
        </Box>
      </Box>
    </Card>
    <Card noBoder bgcolor={theme.palette.white.main} py="3.2rem" mb="1.2rem">
      <Box>
        <Text color="#636B7B" {...typography.paragraph.l1} mb="1rem">
          Compareça à unidade:
        </Text>
        <Text {...typography.title.h4l}>{agenda.unit.name}</Text>
      </Box>
      <Box mt="1.5rem">
        <Text color="#636B7B" {...typography.paragraph.l1} mb="1rem">
          Data
        </Text>
        <Text {...typography.title.h4l}>
          {dateUtils(agenda.date).utc().format("DD/MM/YYYY")}
        </Text>
      </Box>
      <Box mt="1.5rem">
        <Text color="#636B7B" {...typography.paragraph.l1} mb="1rem">
          Horário
        </Text>
        <Text {...typography.title.h4l}>{timeByPeriod(agenda.period)}</Text>
      </Box>
    </Card>
    <Card noBoder bgcolor={theme.palette.white.main} py="3.2rem" mb="1.2rem">
      <Text {...typography.title.h4l}>
        Importante: Não se esqueça de levar seu CPF
      </Text>
    </Card>
  </Box>
);

export default Summary;
