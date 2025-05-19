declare function getBaseInfo(options: {
  success?: (res: any) => void;
  error?: (err: any) => void;
}): void;

declare function uploadResultData(options: {
  objname?: string;
  methodname?: string;
  appId: string;
  expId: string;
  version: string;
  reportData: Array<{ [key: string]: any }>;
  expScoreDetails:Record<string, any>[];
  expScriptContent: string;
  success?: (res: any) => void;
  error?: (err: any) => void;
}): void;