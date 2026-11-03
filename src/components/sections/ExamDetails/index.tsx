"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { PatientSegmentEntity } from "@/domain/entities/patient";
import { FormEvent, useCallback, useMemo, useState } from "react";
import theme from "@/shared/theme/material-theme";
import { SegmentEnum } from "@/domain/consts";
import { SegmentList } from "@/shared/lists";
import { ExamEntity } from "@/domain/entities/exam";
import { ExamAppointmentHistory, PatientExamSection } from "./components";
import { SegmentSection, TagSection } from "../components";

export type ExamDetailsProps = {
  exam: ExamEntity;
  formId: string;
  segment: SegmentEnum;
  onSubmit: (data: { tags: string[] }) => void;
};

enum tabsId {
  SEGMENT = 0,
  HISTORY = 1,
  TAGS = 2,
}

const ExamDetails: React.FC<ExamDetailsProps> = ({
  exam,
  formId,
  segment,
  onSubmit,
}) => {
  const [selectedTab, setSelectedTab] = useState(tabsId.SEGMENT);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    exam.patient.tags.map((item) => item.tag.name)
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      tags: selectedTags,
    });
  };

  const patientSegments = useMemo(() => {
    const hasCurrentSegement = exam.patient.segments.some(
      (item) => item.segment.id === segment
    );
    if (hasCurrentSegement) {
      return exam.patient.segments;
    }

    return [
      ...exam.patient.segments,
      {
        segment: SegmentList.find((item) => item.id === segment),
      } as PatientSegmentEntity,
    ];
  }, [exam.patient.segments, segment]);

  const RenderTab: React.FC<{
    patientPecId: string;
    tab: tabsId;
    tagsData: string[];
    segments: PatientSegmentEntity[];
    onAddTag: (value: string) => void;
    onRemoveTag: (value: string) => void;
  }> = useCallback(
    ({ patientPecId, tab, tagsData, segments, onAddTag, onRemoveTag }) => {
      switch (tab) {
        case tabsId.SEGMENT:
          return <SegmentSection segments={segments} />;
        case tabsId.HISTORY:
          return <ExamAppointmentHistory patientPecId={patientPecId} />;
        case tabsId.TAGS:
          return (
            <TagSection
              tags={tagsData}
              onAdd={onAddTag}
              onRemove={onRemoveTag}
            />
          );
      }
    },
    []
  );

  return (
    <Box>
      <Box>
        <PatientExamSection exam={exam} segment={segment} />
      </Box>
      <Box mt="3.6rem">
        <Box bgcolor={theme.palette.primary.light}>
          <Tabs
            value={selectedTab}
            onChange={(_, index) => setSelectedTab(index)}
            aria-label="basic tabs example"
          >
            <Tab label="Segmento" value={tabsId.SEGMENT} />
            <Tab label="HistÓrico" value={tabsId.HISTORY} />
            <Tab label="Etiquetas" value={tabsId.TAGS} />
          </Tabs>
        </Box>
        <Box component="form" id={formId} mt="3.6rem" onSubmit={handleSubmit}>
          <RenderTab
            patientPecId={exam.patientPecId}
            tab={selectedTab}
            tagsData={selectedTags}
            segments={patientSegments}
            onAddTag={(value) => setSelectedTags((tags) => [...tags, value])}
            onRemoveTag={(value) =>
              setSelectedTags((tags) => tags.filter((item) => item !== value))
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ExamDetails;
