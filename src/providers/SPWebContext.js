import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from '@pnp/sp/webs';
import "@pnp/sp/lists";
import "@pnp/sp/items";

//export const spWebContext = Web(process.env.REACT_APP_API_URL).configure({
const webUrl = process.env.NODE_ENV === 'development' ? 'http ://localhost:3000' : window._spPageContextInfo.webAbsoluteUrl;
export const spWebContext = Web(webUrl).configure({
  headers: { "Accept": "application/json; odata=verbose" }
});