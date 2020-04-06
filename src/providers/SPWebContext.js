import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from '@pnp/sp/webs';

export const spWebContext = Web(process.env.REACT_APP_API_URL).configure({
  headers: { "Accept": "application/json; odata=verbose" }
});