import "@pnp/sp/sites";
import { Web } from '@pnp/sp/webs';
import { sp } from "@pnp/sp";

export const spWebContext = new Web(sp.site.getWebUrlFromPageUrl(window.location)).configure({
    headers: { "Accept": "application/json; odata=verbose" }
  });