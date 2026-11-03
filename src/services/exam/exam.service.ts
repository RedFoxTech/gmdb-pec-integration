import api from "../api/api";
import { AxiosInstance } from "axios";
import { parseObjectToQueryString } from "@/shared/stringUtils";
import { getAuthToken } from "../api/utils/tokenUtils";
import {
  GetExamAppointmentsDto,
  GetExamAppointmentsEntity,
  GetExamsDto,
  GetExamsEntity,
  GetExamsReportDto,
} from "@/domain/entities/exam";
import saveAs from "file-saver";

export class ExamService {
  private readonly api: AxiosInstance = api;
  private readonly path: string = "/exam";

  constructor() {
    this.makePath = this.makePath.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  private makePath(path: string): string {
    return `${this.path}/${path}`;
  }

  async getAll(data?: GetExamsDto): Promise<GetExamsEntity> {
    try {
      const result = await this.api.get<GetExamsEntity>(
        `${this.path}${parseObjectToQueryString(data)}`,
        {
          headers: {
            authorization: getAuthToken(),
          },
        }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getExamAppointmentsByPatientId(
    data: GetExamAppointmentsDto
  ): Promise<GetExamAppointmentsEntity> {
    try {
      const result = await this.api.get<GetExamAppointmentsEntity>(
        this.makePath(
          `${data.patientId}/appointments${parseObjectToQueryString(data.data)}`
        ),
        {
          headers: {
            authorization: getAuthToken(),
          },
        }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async generalReport(data: GetExamsReportDto) {
    try {
      const result = await this.api.get<undefined>(
        this.makePath(`export${parseObjectToQueryString(data)}`),
        {
          headers: {
            authorization: getAuthToken(),
          },
          responseType: "blob",
        }
      );
      if (result.data) {
        const blob = new Blob([result.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `exams-${new Date().toISOString()}.xls`);
      }
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async exportStream(
    data: GetExamsReportDto,
    onProgress: (progress: number, message: string) => void,
    onComplete: () => void,
    onError: (error: any) => void
  ) {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}${this.makePath(`export/stream${parseObjectToQueryString(data)}`)}`;
      const response = await fetch(url, {
        headers: {
          authorization: getAuthToken(),
        } as HeadersInit,
      });

      if (!response.body) throw new Error("ReadableStream not yet supported in this browser.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const messages = buffer.split("\n\n");
          buffer = messages.pop() || "";
          
          for (const msg of messages) {
            const dataMatch = msg.match(/data:\s*([\s\S]+)/);
            if (dataMatch?.[1]) {
              try {
                const parsed = JSON.parse(dataMatch[1].trim());
                if (parsed.message && parsed.progress !== undefined) {
                  onProgress(parsed.progress, parsed.message);
                }
                if (parsed.file) {
                  const byteCharacters = atob(parsed.file);
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);
                  const blob = new Blob([byteArray], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  });
                  saveAs(blob, `exams-${new Date().toISOString()}.xls`);
                }
              } catch (e) {
                console.error("Error parsing stream message", e);
              }
            }
          }
        }
      }
      onComplete();
    } catch (error) {
      console.error(error);
      onError(error);
    }
  }
}
