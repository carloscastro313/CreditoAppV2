export interface credit {
  total: number;
  history: history[];
}

export interface history {
  value: number;
  date: Date | any;
}

export interface valueQR {
  value: number;
  code: string;
  user: userCount[];
}

export interface userCount {
  user: string;
  count: number;
}
