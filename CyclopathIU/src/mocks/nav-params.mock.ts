export class NavParamsMock {
    static returnParam: Object = null;
    public get(key: string): Object | string {
      if (NavParamsMock.returnParam) {
         return NavParamsMock.returnParam[key]
      }
      return 'default';
    }
    static setParams(value: Object){
      NavParamsMock.returnParam = value;
    }
  }