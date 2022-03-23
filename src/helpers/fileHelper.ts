import {
  existsSync,
  writeFileSync,
  readFileSync,
  rmSync,
  mkdirSync,
  copyFileSync,
} from "fs";
import { v4 as uuidv4 } from "uuid";
import { join, dirname } from "path";
import { environment } from "./environment";

const getAccessCodeFilePath = (accessCode): string => {
  return `${environment.filesDirectory}/accessCodes/${accessCode}`;
};

const getNewAccessCode = (): string => {
  let accessCode = uuidv4();
  let filePath = getAccessCodeFilePath(accessCode);
  while (existsSync(filePath)) {
    const now = Math.round(new Date().getTime() / 1000);
    const { time } = getTimeAndFileNameOfAccessFile(accessCode);

    if (time > 0 && now > time) {
      deleteAccessFile(accessCode);
    } else {
      accessCode = uuidv4();
      filePath = getAccessCodeFilePath(accessCode);
    }
  }
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, "");
  return accessCode;
};

const writeToAccessCode = (
  accessCode: string,
  fileName: string,
  allowedTimeInSeconds: number
) => {
  const accessCodeFilePath = getAccessCodeFilePath(accessCode);
  const timeStamp =
    Math.round(new Date().getTime() / 1000) + allowedTimeInSeconds;
  writeFileSync(accessCodeFilePath, `${fileName};${timeStamp}`);
};

export const getAccessCodeForFile = (
  fileName: string,
  allowedTimeInSeconds?: number
) => {
  const accessCode = getNewAccessCode();
  writeToAccessCode(accessCode, fileName, allowedTimeInSeconds ?? 120);
  return accessCode;
};

const getTimeAndFileNameOfAccessFile = (accessCode: string) => {
  const accessCodeFilePath = getAccessCodeFilePath(accessCode);

  try {
    const content = readFileSync(accessCodeFilePath);
    const contentAsString = content.toString();
    if (contentAsString === "") {
      return {
        time: 0,
        fileName: "ACCESS_CODE_FILE_EMPTY",
      };
    }
    const contentParts = contentAsString.split(";");
    const fileName = contentParts[0];
    const time = parseInt(contentParts[1]);
    return {
      time: time,
      fileName: fileName,
    };
  } catch (e) {
    return {
      time: 0,
      fileName: "ACCESS_CODE_FILE_NOT_EXISTS",
    };
  }
};

const deleteAccessFile = (accessCode) => {
  const accessCodeFilePath = getAccessCodeFilePath(accessCode);
  rmSync(accessCodeFilePath);
};

export const hasAccessToFile = (accessCode, requestedFileName) => {
  const { time, fileName } = getTimeAndFileNameOfAccessFile(accessCode);
  if (fileName !== requestedFileName) {
    return false;
  }
  const now = Math.round(new Date().getTime() / 1000);
  if (now >= time) {
    deleteAccessFile(accessCode);
    return false;
  }

  return true;
};

export const handleDownloadRequest = (request, response) => {
  const { accessCode, fileName } = request.body;
  if (!accessCode || !fileName) {
    response.status(401);
    response.send("no-access");
  }

  if (!hasAccessToFile(accessCode, fileName)) {
    response.status(401);
    response.send("no-access");
  }

  const options = {
    root: environment.filesDirectory,
  };
  const fileNameForRead = `dumpFolder/${fileName}`;
  response.sendFile(fileNameForRead, options);
};

export const getTargetFilePath = (fileName: string): string => {
  return `${environment.filesDirectory}/dumpFolder/${fileName}`;
};
export enum EXAMPLE_FILES {
  CSV = "exampleCSV.csv",
  EXCEL = "exampleExcel.xlsx",
}
export const copyExampleFileIfNeeded = (
  exampleFile: EXAMPLE_FILES,
  targetFileName: string
) => {
  const targetFilePath = getTargetFilePath(targetFileName);
  if (!existsSync(targetFilePath)) {
    mkdirSync(dirname(targetFilePath), { recursive: true });
    const exampleFileWithPath = join(
      __dirname,
      "../exampleFiles/" + exampleFile
    );
    copyFileSync(exampleFileWithPath, targetFilePath);
  }
};
