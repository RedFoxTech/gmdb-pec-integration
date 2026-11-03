import { Button, Card, Text } from "@/components/common";
import theme from "@/shared/theme/material-theme";
import typography from "@/shared/theme/typography-theme";
import { Box } from "@mui/material";
import { Search as IconSearch } from "@mui/icons-material";

export type CpfErrorWarningProps = {
  onClickFillData: () => void;
};

const CpfErrorWarning: React.FC<CpfErrorWarningProps> = ({
  onClickFillData,
}) => (
  <Card noBoder bgcolor={theme.palette.white.main} py="3.2rem" mb="1.2rem">
    <Box
      bgcolor={theme.palette.warning.light}
      border={1}
      borderColor={theme.palette.warning.main}
      display="flex"
      alignItems="center"
      p="1.2rem"
      pr="1.5rem"
      borderRadius="0.4rem"
      mb="1rem"
    >
      <Box px="1.6rem">
        <IconSearch
          color="warning"
          sx={{ width: "2.4rem", height: "2.4rem" }}
        />
      </Box>
      <Box>
        <Text
          color={theme.palette.warning.main}
          {...typography.paragraph.r1}
          mb="0.5rem"
        >
          CPF Não Encontrado
        </Text>
        <Text color={theme.palette.warning.main} {...typography.paragraph.l1}>
          Não encontramos dados para o CPF informado. Preencha as informações
          manualmente ou tente novamente.
        </Text>
      </Box>
    </Box>
    <Button
      color="success"
      fullWidth
      sx={{ py: "1.5rem" }}
      onClick={onClickFillData}
    >
      Preencher dados
    </Button>
  </Card>
);

export default CpfErrorWarning;
