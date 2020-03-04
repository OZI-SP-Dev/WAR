import "@pnp/sp/sites";
import { Web } from '@pnp/sp/webs';

export const spWebContext = new Web(process.env.REACT_APP_API_URL).configure({
    headers: { "Accept": "application/json; odata=verbose" }
  });