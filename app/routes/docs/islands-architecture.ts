import { createRoute } from "@hyperspan/framework";

export default createRoute().get((c) => {
  return c.res.redirect('/docs/clientjs/islands');
});