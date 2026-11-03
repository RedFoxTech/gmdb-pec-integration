import { Box } from "@mui/material";
import { Chip, Text } from "@/components/common";
import typography from "@/shared/theme/typography-theme";
import { PatientSegmentEntity } from "@/domain/entities/patient";

export type SegmentSectionProps = {
  segments: PatientSegmentEntity[];
};

const SegmentSection: React.FC<SegmentSectionProps> = ({ segments }) => (
  <Box>
    <Text {...typography.title.h3l} mb="3.6rem">
      Segmento
    </Text>
    <Box>
      {segments.map((item) => (
        <Chip key={item.segment.id} label={item.segment.name} />
      ))}
    </Box>
  </Box>
);

export default SegmentSection;
