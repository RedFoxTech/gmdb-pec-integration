import { Button, Card, Chip, Text } from "@/components/common";
import { AgendaEntity } from "@/domain/entities/agenda";
import theme from "@/shared/theme/material-theme";
import { Box, Typography } from "@mui/material";
import {
  ArrowForwardIos as IconArrowForwardIos,
  CalendarToday as IconCalendarToday,
  InfoOutlined as IconInfo,
} from "@mui/icons-material";
import dateUtils from "@/shared/date";
import typography from "@/shared/theme/typography-theme";

export type AgendaListProps = {
  data: AgendaEntity[];
  onSelect: (data: AgendaEntity) => void;
};

export const AgendaList: React.FC<AgendaListProps> = ({ data, onSelect }) => (
  <Box>
    <Card noBoder bgcolor={theme.palette.white.main} py="3.2rem" mb="1.2rem">
      <Text component="h1" {...typography.title.h3l} mb="0.5rem">
        Data do atendimento
      </Text>
      <Text color="#878E9A" {...typography.title.h4l}>
        Escolha o melhor dia para realizar seu atendimento
      </Text>
    </Card>
    {data.map((item) => (
      <Card
        key={item.id}
        noBoder
        bgcolor={theme.palette.white.main}
        py="3.2rem"
        mb="1.2rem"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb="1rem"
        >
          <Box display="flex" alignItems="center" gap="0.8rem">
            <IconCalendarToday sx={{ color: "#636B7B" }} />
            <Text color="#636B7B" {...typography.paragraph.l1}>
              {dateUtils(item.date).utc().format("DD/MM/YYYY")}
            </Text>
          </Box>
          <Box>
            <Button
              variant="outlined"
              color="success"
              sx={{ borderRadius: "3.3rem", py: "0.2rem", px: "1rem" }}
              endIcon={<IconArrowForwardIos sx={{ width: "1.2rem" }} />}
              disabled={item.availableSlots === 0}
              onClick={() => onSelect(item)}
            >
              Agendar
            </Button>
          </Box>
        </Box>
        <Text {...typography.title.h4l} mb="1.6rem">
          {item.type}
        </Text>
        {item.unit ? (
          <Text {...typography.title.h4l}>{`${item.unit?.name} - ${item.unit?.address}, ${item.unit?.addressNumber}`}</Text>
        ) : (
          <Text {...typography.title.h4l}>Unidade não encontrada</Text>
        )}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Text color="#636B7B" {...typography.paragraph.l1}>
            {item.period}
          </Text>
          <Box display="flex" alignItems="center" gap="0.8rem" mt="1rem">
            <Chip
              sx={{
                bgcolor: theme.palette.success.light,
                color: theme.palette.success.main,
              }}
              label={item.availableSlots}
            />
            <Text color="#636B7B" {...typography.paragraph.l1}>
              Vagas restantes
            </Text>
          </Box>
        </Box>
        {item.availableSlots === 0 && (
          <Box
            display="flex"
            alignItems="center"
            bgcolor="#FEF0F0"
            p="1rem"
            gap="1.2rem"
            borderRadius="0.4rem"
            mt="1.5rem"
          >
            <Box>
              <IconInfo sx={{ color: "#FF3940" }} />
            </Box>
            <Box>
              <Typography {...typography.paragraph.l2} color="#FF3940">
                As vagas para agendamento digital estão encerradas.
              </Typography>
              <Typography {...typography.paragraph.sb2} color="#FF3940">
                Dirija-se para a unidade para realizar seu atendimento.
              </Typography>
            </Box>
          </Box>
        )}
      </Card>
    ))}
  </Box>
);

export default AgendaList;
