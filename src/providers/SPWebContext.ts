import "@pnp/sp/sites";
import "@pnp/sp/webs";
import { Web } from '@pnp/sp/webs';
import "@pnp/sp/lists";
import "@pnp/sp/items";

const webUrl = process.env.NODE_ENV === 'development' ? 'http ://localhost:3000':"";

// Web Context that provides a common interface for all SharePoint related traffic
export const spWebContext = Web(webUrl).configure({
  headers: { "Accept": "application/json; odata=verbose" }
});