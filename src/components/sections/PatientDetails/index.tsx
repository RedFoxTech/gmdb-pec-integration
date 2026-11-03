"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { PatientEntity, PatientSegmentEntity } from "@/domain/entities/patient";
import { PatientSection, ResponsibleSection } from "./components";
import { FormEvent, useCallback, useMemo, useState } from "react";
import theme from "@/shared/theme/material-theme";
import { SegmentEnum, VaccinationConsentStatusEnum } from "@/domain/consts";
import { SegmentList } from "@/shared/lists";
import { SegmentSection, TagSection } from "../components";

export type PatientDetailsProps = {
  patient: PatientEntity;
  formId: string;
  segment: SegmentEnum;
  onSubmit: (data: {
    consentId?: string;
    consentStatus: VaccinationConsentStatusEnum;
    tags: string[];
    file?: File;
  }) => void;
};

enum tabsId {
  RESPONSIBLE = 0,
  SEGMENT = 1,
  TAGS = 2,
}

const PatientDetails: React.FC<PatientDetailsProps> = ({
  patient,
  formId,
  segment,
  onSubmit,
}) => {
  const consent = patient.consents.find((item) => (item.segment.id = segment));

  const [selectedTab, setSelectedTab] = useState(tabsId.RESPONSIBLE);
  const [selectedConsentStatus, setSelectedConsentStatus] =
    useState<VaccinationConsentStatusEnum>(
      consent?.consentStatus || VaccinationConsentStatusEnum.PENDING
    );
  const [selectedFile, setSelectedeFile] = useState<File>();
  const [selectedTags, setSelectedTags] = useState<string[]>(
    patient.tags.map((item) => item.tag.name)
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      consentId: consent?.id,
      consentStatus: selectedConsentStatus,
      tags: selectedTags,
      file: selectedFile,
    });
  };

  const patientSegments = useMemo(() => {
    const hasCurrentSegement = patient.segments.some(
      (item) => item.segment.id === segment
    );
    if (hasCurrentSegement) {
      return patient.segments;
    }

    return [
      ...patient.segments,
      {
        segment: SegmentList.find((item) => item.id === segment),
      } as PatientSegmentEntity,
    ];
  }, [patient.segments, segment]);

  const RenderTab: React.FC<{
    tab: tabsId;
    patientData: PatientEntity;
    selectedConsentStatusData?: VaccinationConsentStatusEnum;
    onChangeSelectedConsentStatus?: (
      value: VaccinationConsentStatusEnum
    ) => void;
    selectedFileData?: File;
    onChangeSelectedFile: (value: File) => void;
    tagsData: string[];
    segments: PatientSegmentEntity[];
    onAddTag: (value: string) => void;
    onRemoveTag: (value: string) => void;
  }> = useCallback(
    ({
      tab,
      patientData,
      selectedConsentStatusData,
      selectedFileData,
      tagsData,
      segments,
      onChangeSelectedConsentStatus,
      onChangeSelectedFile,
      onAddTag,
      onRemoveTag,
    }) => {
      switch (tab) {
        case tabsId.RESPONSIBLE:
          return (
            <ResponsibleSection
              patient={patientData}
              segment={segment}
              selectedConsentStatus={selectedConsentStatusData}
              selectedFile={selectedFileData}
              onChangeSelectedConsentStatus={onChangeSelectedConsentStatus}
              onChangeSelectedFile={(file) =>
                onChangeSelectedFile(file as File)
              }
            />
          );
        case tabsId.SEGMENT:
          return <SegmentSection segments={segments} />;
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
        <PatientSection patient={patient} segment={segment} />
      </Box>
      <Box mt="3.6rem">
        <Box bgcolor={theme.palette.primary.light}>
          <Tabs
            value={selectedTab}
            onChange={(_, index) => setSelectedTab(index)}
            aria-label="basic tabs example"
          >
            <Tab label="Responsável" value={tabsId.RESPONSIBLE} />
            <Tab label="Segmento" value={tabsId.SEGMENT} />
            <Tab label="Etiquetas" value={tabsId.TAGS} />
          </Tabs>
        </Box>
        <Box component="form" id={formId} mt="3.6rem" onSubmit={handleSubmit}>
          <RenderTab
            tab={selectedTab}
            patientData={patient}
            selectedConsentStatusData={selectedConsentStatus}
            selectedFileData={selectedFile}
            onChangeSelectedConsentStatus={setSelectedConsentStatus}
            onChangeSelectedFile={setSelectedeFile}
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

export default PatientDetails;
