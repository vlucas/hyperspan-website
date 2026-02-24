import { createRoute } from "@hyperspan/framework";
//import { memoryCacheTime } from '~/app/middleware';

export function createDocsRoute() {
  return createRoute();//.middleware([memoryCacheTime('1w')]);
}