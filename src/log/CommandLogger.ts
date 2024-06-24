import { ILogObjMeta, ISettingsParam, Logger } from "tslog";

export class CommandLogger<LogObj> extends Logger<LogObj> {
  constructor(setting?: ISettingsParam<LogObj>, logObj?: LogObj) {
    super(setting, logObj);
  }

  public command(...args: unknown[]): (LogObj & ILogObjMeta) | undefined {
    return super.log(3, "command", ...args);
  }
}
