import { Web } from '@pnp/sp/webs';

export const spWebContext = new Web('https://usaf.dps.mil/teams/10251').configure({
    headers: { "Accept": "application/json; odata=verbose" }
  });