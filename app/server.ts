import hyperspanConfig from '../hyperspan.config';
import './styles/build';
import { createServer } from '@hyperspan/framework';
import { trimTrailingSlash } from 'hono/trailing-slash';

const app = await createServer(hyperspanConfig);

app.use(trimTrailingSlash());

export default app;
