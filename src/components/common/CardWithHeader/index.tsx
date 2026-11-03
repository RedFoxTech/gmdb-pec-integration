import { Box, Typography } from "@mui/material";
import Card from "../Card";
import Text from "../Text";
import theme from "@/shared/theme/material-theme";
import typography from "@/shared/theme/typography-theme";
import { PropsWithChildren, ReactElement } from "react";

export type CardWithHeaderProps = PropsWithChildren & {
  icon: ReactElement;
  title: string;
  titleComplement?: ReactElement;
  loading?: boolean;
};

const CardWithHeader: React.FC<CardWithHeaderProps> = ({
  icon,
  title,
  titleComplement,
  loading,
  children,
}) => {
  if (loading) {
    return (
      <Card
        height="13.7rem"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          fontSize={16}
          textAlign="center"
          fontWeight={600}
          color={theme.palette.primary.main}
        >
          Carregando...
        </Typography>
      </Card>
    );
  }

  return (
    <Card height="100%" display="flex" flexDirection="column">
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          py="0.6rem"
        >
          <Box display="flex" alignItems="center" gap="0.8rem">
            {icon}
            <Text color={theme.palette.primary.main} {...typography.title.h4l}>
              {title}
            </Text>
          </Box>
          {titleComplement}
        </Box>
        <Box
          width="100%"
          height="0.1rem"
          bgcolor={theme.palette.grey[200]}
          mt="1rem"
          mb="1.2rem"
        />
      </Box>
      <Box display="flex" alignItems="flex-end" flex={1}>
        {children}
      </Box>
    </Card>
  );
};

export default CardWithHeader;
