import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from '@pnp/sp/webs';
import "@pnp/sp/lists";
import "@pnp/sp/items";

// Web Context that provides a common interface for all SharePoint related traffic
export const spWebContext = Web(process.env.REACT_APP_API_URL).configure({
  headers: { "Accept": "application/json; odata=verbose" }
});